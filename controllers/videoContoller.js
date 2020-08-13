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

exports.createVideo = catchAsync(async (req, res, next) => {
  // creates new video content with current tutorID and 
  if (!req.body.tutorID) req.body.tutorID = req.user.id;
  const newVideo = await Video.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      review: newVideo
    }
  });
});

exports.updateVideoInfo = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs a password data
  if (req.body.videoURL) {
    return next(new AppError('This route is not for video updates.', 400));
  }

  // Filter out unwanted field names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'thumbnail', 'questions');

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

exports.deleteVideo = catchAsync(async (req, res, next) => {
  await Video.findByIdAndUpdate(req.params.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getVideo = factory.getOne(
  Video,
  {
    path: 'reviews'
  },
  {
    path: 'tutorID',
    select: 'name photo school'
  }
);
exports.getVideos = factory.getAll(Video);
exports.updateVideo = factory.updateOne(Video);
