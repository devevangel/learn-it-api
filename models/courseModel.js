const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true
  }
});

courseSchema.pre('aggregate', function(next) {
  this.project('name');
  // console.log(this.pipeline());
  next();
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
