const express = require('express');
const questionController = require('./../controllers/questionController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/getQuestionsByIds', questionController.getQuestionsByIds);

router
  .route('/')
  .get(authController.protect, questionController.getQuestions)
  .post(questionController.createQuestion);

router
  .route('/:id')
  .get(questionController.getQuestion)
  .patch(questionController.updateQuestion)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    questionController.deleteQuestion
  );

module.exports = router;
