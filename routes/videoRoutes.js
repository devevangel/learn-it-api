const express = require('express');
const videoController = require('../controllers/videoContoller');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');
const fixUpQuery = require('./../utils/queryFix');

const router = express.Router();

router.use('/:videoId/reviews', reviewRouter);
router.use((req, res, next) => {
  req.query.views = fixUpQuery(req.query.views);
  req.query.ratingsAverage = fixUpQuery(req.query.ratingsAverage);
  req.query.ratingsQuantity = fixUpQuery(req.query.ratingsQuantity);
  req.query.level = fixUpQuery(req.query.level);
  req.query.likes = fixUpQuery(req.query.likes);
  req.query.dislikes = fixUpQuery(req.query.dislikes);
  next();
});

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
