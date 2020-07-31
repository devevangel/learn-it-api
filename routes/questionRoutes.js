const express = require('express');
const questionController = require('./../controllers/questionController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, questionController.getAllTours)
  .post(questionController.createTour);

router
  .route('/:id')
  .get(questionController.getTour)
  .patch(questionController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    questionController.deleteTour
  );

module.exports = router;
