const Department = require('./../models/departmentModel');
const factory = require('./handlerFactory');

exports.createDepartment = factory.createOne(Department);
exports.deleteDepartment = factory.deleteOne(Department);
exports.getDepartments = factory.getAll(Department);
exports.getDepartment = factory.getOne(Department);
exports.updateDepartment = factory.updateOne(Department);
