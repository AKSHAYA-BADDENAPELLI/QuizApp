const express = require('express'), jwt = require('jsonwebtoken');
const User = require('../models/User'), Question = require('../models/Question');
const router = express.Router();

function auth(req, res, next) {
  const t = req.headers.authorization?.split(' ')[1];
  if (!t) return res.status(401).json({ message: 'No token' });
  jwt.verify(t, process.env.JWT_SECRET, (e, d) => {
    if (e) return res.status(401).json({ message: 'Invalid token' });
    req.userId = d.id;
    next();
  });
}

router.post('/get-questions', auth, async (req, res) => {
  const user = await User.findById(req.userId);
  const asked = user.quizAttempts.flat();
  let pool = await Question.find({ _id: { $nin: asked } });
  if (pool.length < 10) {
    user.quizAttempts = [];
    await user.save();
    pool = await Question.find();
  }
  pool = pool.sort(() => 0.5 - Math.random()).slice(0, 10);
  res.json(pool);
});

router.post('/submit', auth, async (req, res) => {
  const { answers } = req.body;
  const user = await User.findById(req.userId);
  const qs = await Question.find({ _id: { $in: answers.map(a => a.q) } });
  let score = answers.reduce((sum, a) => {
    const q = qs.find(x => x._id == a.q);
    return sum + (q && q.answer === a.answer ? 1 : 0);
  }, 0);
  user.quizAttempts.push(answers.map(a => a.q));
  await user.save();
  res.json({ score });
});

module.exports = router;
