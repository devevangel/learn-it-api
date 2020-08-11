const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const Question = require('./../../models/questionModel');
const Video = require('./../../models/videoModel');
const Course = require('./../../models/courseModel');
const User = require('./../../models/userModel');
const Review = require('./../../models/reviewModel');

dotenv.config({ path: './config.env' });

mongoose
  .connect('mongodb://localhost:27017/learnit', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connection to db established'));

const videos = JSON.parse(fs.readFileSync(`${__dirname}/videos.json`, 'utf-8'));
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/courses.json`, 'utf-8')
);
const questions = JSON.parse(
  fs.readFileSync(`${__dirname}/questions-simple.json`, 'utf-8')
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

const importData = async () => {
  try {
    await User.create(users, { validateBeforeSave: false });
    await Question.create(questions);
    await Review.create(reviews);
    await Video.create(videos);
    await Course.create(courses);
    console.log('Data successfully loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await User.deleteMany();
    await Question.deleteMany();
    await Review.deleteMany();
    await Video.deleteMany();
    await Course.deleteMany();
    console.log('Deleted successfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
