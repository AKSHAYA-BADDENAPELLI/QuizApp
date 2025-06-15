const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router(); // ✅ This line was missing

router.post('/login', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username || typeof username !== 'string') {
      return res.status(400).json({ message: 'Valid username required' });
    }

    let user = await User.findOne({ username });
    if (!user) {
      user = await User.create({ username });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
