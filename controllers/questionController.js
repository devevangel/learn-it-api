const Question = require('./../models/questionModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

// Get questions based on subject e.g math111 topic e.g algebra limit e.g 40 questions
exports.getQuestions = factory.getAll(Question);
// Get a single question
exports.getQuestion = factory.getOne(Question);
// Create a new Question
exports.createQuestion = factory.createOne(Question);
// Update an exisiting question
exports.updateQuestion = factory.updateOne(Question);
// Delete an exisiting question
exports.deleteQuestion = factory.deleteOne(Question);
