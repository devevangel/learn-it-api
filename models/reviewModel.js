const mongoose = require('mongoose');
const Video = require('./videoModel');

// review / rating / createdAt / ref to tour / ref to user
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'A review is required']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    video: {
      type: mongoose.Schema.ObjectId,
      ref: 'Video',
      required: [true, 'Review must belong to a video.']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.index({ video: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function(videoId) {
  const stats = await this.aggregate([
    {
      $match: { video: videoId }
    },
    {
      $group: {
        _id: '$video',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  console.log(stats);
  if (stats.length > 0) {
    await Video.findByIdAndUpdate(videoId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Video.findByIdAndUpdate(videoId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

reviewSchema.post('save', function() {
  // this points to current review
  this.constructor.calcAverageRatings(this.video);
});

reviewSchema.pre(/^findOneAnd/, async function(next) {
  if (this.r !== null) {
    this.r = await this.findOne();
    console.log(this.r);
  }
  next();
});

reviewSchema.post(/^findOneAnd/, async function() {
  // await this.findOne() does not work here the query has already being executed
  await this.r.constructor.calcAverageRatings(this.r.video);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
