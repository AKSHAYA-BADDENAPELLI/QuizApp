const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: {
    type: [String],
    validate: [arrayLimit, '{PATH} must have exactly 4 options'],
    required: true
  },
  answer: {
    type: String,
    required: true,
    trim: true
  }
});

// Optional: Ensures exactly 4 options (for a typical MCQ)
function arrayLimit(val) {
  return val.length === 4;
}

module.exports = mongoose.model('Question', questionSchema);
