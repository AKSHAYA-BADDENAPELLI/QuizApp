const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  quizAttempts: [[String]]
});
module.exports = mongoose.model('User', userSchema);
