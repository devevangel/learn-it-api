const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'A question is required.'],
    unique: true,
    trim: true,
    minlength: [10, 'A question must have 10 characters or more.']
  },
  questionImage: String,
  options: {
    type: [String],
    required: [true, 'A question must have options.'],
    trim: true
  },
  answer: {
    type: String,
    required: [true, 'A question must have an answer.'],
    trim: true
  },
  answerImage: String,
  year: {
    type: Number,
    default: 1,
    enum: {
      values: [1, 2, 3, 4, 5],
      message: 'Year is either: 1, 2, 3, 4, 5'
    }
  },
  subject: {
    type: String,
    trim: true,
    required: [
      true,
      'A question must have a subject it falls under e.g Mathematics 111'
    ],
    minlength: [5, 'A subject must have 5 characters or more'],
    maxlength: [20, 'A subject must have 20 characters or less']
  },
  topic: {
    type: String,
    trim: true,
    required: [true, 'A question must have a topic it falls under e.g algebra'],
    maxlength: [20, 'A topic must have 20 characters or less'],
    minlength: [4, 'A topic must have 4 characters or more']
  },
  explanation: {
    type: String,
    trim: true
  },
  explanationImage: String,
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
});
