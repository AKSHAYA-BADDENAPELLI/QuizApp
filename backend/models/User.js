const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  quizAttempts: {
    type: [[String]], // Array of arrays of strings (e.g., question IDs or answers)
    default: []
  }
});

module.exports = mongoose.model('User', userSchema);
