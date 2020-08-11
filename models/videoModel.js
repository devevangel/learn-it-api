const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    tutorID: {
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
      type: Number,
      default: 100,
      validate: {
        // This only runs on create and save
        validator: function(el) {
          const levels = [100, 200, 300, 400, 500];

          return levels.includes(el);
        },
        message: 'Level can either 100, 200, 300, 400, or 500'
      }
    },
    departments: {
      type: [String],
      trim: true,
      lowercase: true
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
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5.0, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
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

videoSchema.index({ ratingsAverage: 1 });

// Aggregation pipeline for get default values for each video
videoSchema.pre('aggregate', function(next) {
  this.match({ active: { $ne: false } });
  this.lookup({
    from: 'users',
    localField: 'tutorID',
    foreignField: '_id',
    as: 'tutor'
  })
    .unwind('tutor')
    .project(
      'tutor.name tutor.school name thumbnail views likes dislikes course topic level ratingsAverage ratingsQuantity'
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
