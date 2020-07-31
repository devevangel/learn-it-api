const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const Question = require('./../../models/questionModel');

dotenv.config({ path: './config.env' });

mongoose
  .connect('mongodb://localhost:27017/learnit', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connection to db established'));

const questions = JSON.parse(
  fs.readFileSync(`${__dirname}/questions-simple.json`, 'utf-8')
);

const importData = async () => {
  try {
    await Question.create(questions);
    console.log('Data successfully loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Question.deleteMany();
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
