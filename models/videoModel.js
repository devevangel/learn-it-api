const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Video must belong to a tutor.']
    },
    name: String,
    thumbnail: String,
    video: String,
    topic: String,
    course: {
      type: String,
      lowercase: true
    },
    level: {
      type: String,
      default: '100',
      enum: {
        values: ['100', '200', '300', '400', '500'],
        message: 'Year is either: 100, 200, 300, 400, 500'
      }
    },
    department: {
      type: String,
      trim: true
    },
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    dislikes: {
      type: Number,
      default: 0
    },
    description: String,
    questions: Array,
    createdAt: {
      type: Date,
      default: Date.now()
    },
    active: {
      type: Boolean,
      default: true,
      select: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Aggregation pipeline for get default values for each video
videoSchema.pre('aggregate', function(next) {
  this.match({ active: { $ne: false } });
  this.lookup({
    from: 'users',
    localField: 'user',
    foreignField: '_id',
    as: 'tutor'
  })
    .unwind('tutor')
    .project(
      'tutor.name tutor.school name thumbnail views likes dislikes course topic level'
    );
  console.log(this.pipeline());
  next();
});

// Getting all reviews that belongs to a certain video
videoSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'video',
  localField: '_id'
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
