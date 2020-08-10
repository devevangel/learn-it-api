const Course = require('./../models/courseModel');
const factory = require('./handlerFactory');

exports.createCourse = factory.createOne(Course);
exports.deleteCourse = factory.deleteOne(Course);
exports.getCourses = factory.getAll(Course);
exports.getCourse = factory.getOne(Course);
exports.updateCourse = factory.updateOne(Course);
