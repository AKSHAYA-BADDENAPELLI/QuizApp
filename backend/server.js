require('dotenv').config();
const express = require('express'), cors = require('cors'), mongoose = require('mongoose');
const authRoute = require('./routes/auth'), quizRoute = require('./routes/quiz');
const Question = require('./models/Question');

const app = express();
app.use(cors(), express.json());

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('MongoDB connected');
  const count = await Question.countDocuments();
  if (count === 0) {
    const qs = require('./questions.json');
    await Question.insertMany(qs);
    console.log('Seeded questions:', qs.length);
  }
}).catch(console.error);

app.use('/auth', authRoute);
app.use('/quiz', quizRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
