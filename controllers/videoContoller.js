const Video = require('./../models/videoModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObject = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObject[el] = obj[el];
  });
  return newObject;
};

exports.updateVideoInfo = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs a password data
  if (req.body.videoURL) {
    return next(new AppError('This route is not for video updates.', 400));
  }

  // Filter out unwanted field names that are not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    'videoName',
    'thumbnailURL',
    'questions'
  );

  // 2) Update video document
  const updatedVideo = await Video.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      video: updatedVideo
    }
  });
});

exports.getVideo = factory.getOne(
  Video,
  {
    path: 'reviews'
  },
  {
    path: 'user',
    select: 'name photo school'
  }
);

exports.getVideos = factory.getAll(Video);
exports.createVideo = factory.createOne(Video);
exports.deleteVideo = factory.deleteOne(Video);
exports.updateVideo = factory.updateOne(Video);
