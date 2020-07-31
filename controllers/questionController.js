const Question = require('./../models/questionModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// needed => { _id: { $in: ['5f242994f740932678827b11', '5f242994f740932678827b19'] } }
// so far => { _id: { '$in': [ '5f242994f740932678827b11', '5f242994f740932678827b19']} }
exports.getQuestionsByIds = catchAsync(async (req, res) => {
  const queryObj = { ...req.query };

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\s+/g, '');
  queryStr = queryStr.replace(/\b(in)\b/g, match => `$${match}`);

  let builtQuery = JSON.parse(queryStr);

  let ids = builtQuery._id.$in;
  ids = ids.split(',');

  builtQuery._id.$in = ids;

  const questions = await Question.find(builtQuery);

  res.status(200).json({
    status: 'success',
    results: questions.length,
    data: {
      questions
    }
  });
});

exports.getAllQuestions = catchAsync(async (req, res, next) => {
  //EXECUTE QUERY
  const features = new APIFeatures(Question.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const questions = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: questions.length,
    data: {
      questions
    }
  });
});

exports.getQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.findById(req.params.id);
  if (!question) {
    return next(
      new AppError(`No Question found with this id '${req.params.id}'.`, 404)
    );
  }
  res.status(200).json({
    status: 'success',
    data: {
      question
    }
  });
});

exports.createQuestion = catchAsync(async (req, res, next) => {
  const newQuestion = await Question.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      question: newQuestion
    }
  });
});

exports.updateQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!question) {
    return next(
      new AppError(`No Question found with this id '${req.params.id}'.`, 404)
    );
  }
  res.status(200).json({
    status: 'success',
    data: {
      question
    }
  });
});

exports.deleteQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.findByIdAndDelete(req.params.id);
  if (!question) {
    return next(
      new AppError(`No Question found with this id '${req.params.id}'.`, 404)
    );
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
});

// exports.getTourStats = catchAsync(async (req, res, next) => {
//   const stats = await Tour.aggregate([
//     {
//       $match: {
//         ratingsAverage: { $gte: 4.5 }
//       }
//     },
//     {
//       $group: {
//         _id: { $toUpper: '$difficulty' },
//         numTours: { $sum: 1 },
//         numRatings: { $sum: '$ratingsQuantity' },
//         avgRating: { $avg: '$ratingsAverage' },
//         avgPrice: { $avg: '$price' },
//         minPrice: { $min: '$price' },
//         maxPrice: { $max: '$price' }
//       }
//     },
//     {
//       $sort: { avgPrice: 1 }
//     }
//     // {
//     //   $match: { _id: { $ne: 'EASY' } }
//     // }
//   ]);

//   res.status(200).json({
//     status: 'success',
//     data: {
//       stats
//     }
//   });
// });

// exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
//   const year = req.params.year * 1;

//   const plan = await Tour.aggregate([
//     {
//       $unwind: '$startDates'
//     },
//     {
//       $match: {
//         startDates: {
//           $gte: new Date(`${year}-01-01`),
//           $lte: new Date(`${year}-12-31`)
//         }
//       }
//     },
//     {
//       $group: {
//         _id: { $month: '$startDates' },
//         numTourStarts: { $sum: 1 },
//         tours: { $push: '$name' }
//       }
//     },
//     {
//       $addFields: {
//         month: '$_id'
//       }
//     },
//     {
//       $project: {
//         _id: 0
//       }
//     },
//     {
//       $sort: {
//         numTourStarts: -1
//       }
//     },
//     {
//       $limit: 6
//     }
//   ]);

//   res.status(200).json({
//     status: 'success',
//     data: {
//       plan
//     }
//   });
// });
