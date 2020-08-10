const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// Documents are instances of a model
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name.']
  },
  photo: String,
  email: {
    type: String,
    required: [true, 'Please provide your email.'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email.']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please provide a password confirm.'],
    validate: {
      // This only runs on create and save
      validator: function(el) {
        return el === this.password;
      },
      message: "Passwords don't match."
    }
  },
  course: {
    type: String,
    minlength: [4, 'A course must have 4 characters or more'],
    maxlength: [20, 'A course must have 20 characters or less']
  },
  level: {
    type: String,
    default: '100',
    enum: {
      values: ['100', '200', '300', '400', '500'],
      message: 'Year is either: 100, 200, 300, 400, 500'
    }
  },
  school: String,
  role: {
    type: String,
    enum: ['user', 'tutor', 'admin'],
    default: 'user'
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now()
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

// Middlewares
userSchema.pre('save', async function(next) {
  // only run this function if password was modified
  if (!this.isModified('password')) return next();

  // Hash pasword with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm
  this.passwordConfirm = undefined;
  // console.log('This function runs when the password was modified or changed');
  next();
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  // console.log('Just added a new password changed at date');
  next();
});

userSchema.pre(/^find/, function(next) {
  // this points to the current ^find query object
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  // console.log(await bcrypt.compare(candidatePassword, userPassword));
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // console.log(`DB stamp: ${changedTimeStamp} JWT: ${JWTTimestamp}`);
    // console.log(JWTTimestamp < changedTimeStamp);
    return JWTTimestamp < changedTimeStamp;
  }

  // This means password was not changed
  return false;
};

// returns a random 32 characters long string
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // console.log({ resetToken }, `Crypt: ${this.passwordResetToken}`);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
