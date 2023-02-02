const jwt = require('jsonwebtoken');
const User = require('../model/User');
const verifyToken = (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) {
    return res.status(401).send('Access Denied');
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user.id;
    console.log(user);
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json('You are not authorized for the following action!!');
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, async () => {
    const admin = await User.findOne({ _id: req.user });
    if (admin.isAdmin) {
      next();
    } else {
      console.log(req.user);
      res.status(403).json('You are not authorized for the following action!');
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
