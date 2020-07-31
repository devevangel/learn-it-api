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
  level: {
    type: String,
    default: '100',
    enum: {
      values: ['100', '200', '300', '400', '500'],
      message: 'Year is either: 100, 200, 300, 400, 500'
    }
  },
  subject: {
    type: String,
    trim: true,
    lowercase: true,
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
    lowercase: true,
    required: [true, 'A question must have a topic it falls under e.g algebra'],
    maxlength: [35, 'A topic must have 20 characters or less'],
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

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
