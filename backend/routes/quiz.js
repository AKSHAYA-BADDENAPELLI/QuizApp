const express = require('express'), jwt = require('jsonwebtoken');
const User = require('../models/User'), Question = require('../models/Question');
const router = express.Router();

// Middleware to verify JWT token
function auth(req, res, next) {
  const t = req.headers.authorization?.split(' ')[1];
  if (!t) return res.status(401).json({ message: 'No token' });

  jwt.verify(t, process.env.JWT_SECRET, (e, d) => {
    if (e) return res.status(401).json({ message: 'Invalid token' });
    req.userId = d.id;
    next();
  });
}

// Route to get 10 random questions (avoiding repeats)
router.post('/get-questions', auth, async (req, res) => {
  const user = await User.findById(req.userId);
  const asked = user.quizAttempts.flat();

  let pool = await Question.find({ _id: { $nin: asked } });

  if (pool.length < 10) {
    user.quizAttempts = []; // Reset if not enough new questions
    await user.save();
    pool = await Question.find();
  }

  pool = pool.sort(() => 0.5 - Math.random()).slice(0, 10);
  res.json(pool);
});

// Route to submit answers and calculate score
router.post('/submit', auth, async (req, res) => {
  const { answers } = req.body; // answers = [{ q: questionId, answer: selectedOption }]
  const user = await User.findById(req.userId);

  const qs = await Question.find({ _id: { $in: answers.map(a => a.q) } });

  // ✅ Corrected comparison using .toString()
  let score = answers.reduce((sum, a) => {
    const q = qs.find(x => x._id.toString() === a.q);
    return sum + (q && q.answer === a.answer ? 1 : 0);
  }, 0);

  // Save question IDs to user's quiz history
  user.quizAttempts.push(answers.map(a => a.q));
  await user.save();

  res.json({ score }); // ✅ Send back the score
});

module.exports = router;
