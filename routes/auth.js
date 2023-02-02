const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');

const registerSchema = Joi.object({
  fname: Joi.string().min(3).required(),
  lname: Joi.string().min(3).required(),
  email: Joi.string().min(8).required(),
  password: Joi.string().min(8).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().min(8).required(),
  password: Joi.string().min(8).required(),
});

router.post('/register', async (req, res) => {
  // Validating form data
  const { error } = registerSchema.validate({ ...req.body });
  if (error) {
    return res.send(error.details[0].message);
  }
  // Checking if email already exists
  const existingEmail = await User.findOne({ email: req.body.email });
  if (existingEmail) {
    res.status(409).json('Email already in use');
    return;
  }
  // Hashing the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  // Creating new user data
  const user = new User({
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    password: hashPassword,
  });

  try {
    //   Saving data in database
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/login', async (req, res) => {
  // Validating form data
  const { error } = loginSchema.validate({ ...req.body });
  if (error) {
    return res.send(error.details[0].message);
  }
  try {
    // Checking if user exists
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(401).json("User doesn't exist");
    // Checking if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    !validPass && res.status(401).json("Password doesn't match");

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.usAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const { password, ...others } = user._doc;
    //   res.header('auth-token', accessToken).send(`Logged In!! + ${accessToken}`);
    res
      .status(200)
      .header('auth-token', accessToken)
      .json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
