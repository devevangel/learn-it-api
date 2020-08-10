const express = require('express');
const videoController = require('./../controllers/videoContoller');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

router.use('/:videoId/reviews', reviewRouter);

router.patch(
  '/updateVideo/:id',
  authController.protect,
  authController.restrictTo('tutor'),
  videoController.updateVideoInfo
);

router
  .route('/')
  .get(videoController.getVideos)
  .post(
    authController.protect,
    authController.restrictTo('tutor', 'admin'),
    videoController.createVideo
  );

router
  .route('/:id')
  .get(videoController.getVideo)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    videoController.updateVideo
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'tutor'),
    videoController.deleteVideo
  );

module.exports = router;
