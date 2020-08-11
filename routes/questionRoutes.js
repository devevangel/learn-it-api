const express = require('express');
const questionController = require('./../controllers/questionController');
const authController = require('../controllers/authController');
const fixUpQuery = require('./../utils/queryFix');

const router = express.Router();

router.use((req, res, next) => {
  req.query.level = fixUpQuery(req.query.level);
  next();
});

router
  .route('/')
  .get(questionController.getQuestions)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    questionController.createQuestion
  );

router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router
  .route('/:id')
  .get(questionController.getQuestion)
  .patch(questionController.updateQuestion)
  .delete(questionController.deleteQuestion);

module.exports = router;
