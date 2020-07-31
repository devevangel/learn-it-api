const express = require('express');
const questionController = require('./../controllers/questionController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, questionController.getAllQuestions)
  .post(questionController.getQuestion);

router
  .route('/:id')
  .get(questionController.getQuestion)
  .patch(questionController.updateQuestion)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'tutor'),
    questionController.deleteQuestion
  );

module.exports = router;
