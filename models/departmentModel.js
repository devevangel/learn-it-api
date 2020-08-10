const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Department must have a name.'],
    trim: true,
    unique: true
  }
});

departmentSchema.pre('aggregate', function(next) {
  this.project('name');
  // console.log(this.pipeline());
  next();
});

const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;
