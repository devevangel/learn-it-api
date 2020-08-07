const express = require('express');
const videoController = require('./../controllers/videoContoller');
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');

const router = express.Router();

router.patch(
  '/updateVideo/:id',
  authController.protect,
  authController.restrictTo('tutor'),
  videoController.updateVideoInfo
);

router
  .route('/')
  .get(videoController.getVideos)
  .post(videoController.createVideo);

router
  .route('/:id')
  .get(videoController.getVideo)
  .patch(videoController.updateVideo)
  .delete(videoController.deleteVideo);

router
  .route('/:videoId/reviews')
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

module.exports = router;
