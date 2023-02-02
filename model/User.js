const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
    min: 3,
    max: 16,
  },
  lname: {
    type: String,
    required: true,
    min: 3,
    max: 16,
  },
  email: {
    type: String,
    required: true,
    min: 8,
    max: 128,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 2048,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);
