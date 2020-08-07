const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId
  },
  subscriptionType: {
    type: String
  },
  startDate: {
    type: Date,
    default: Date.now()
  },
  endDate: {
    type: Date
  },
  price: {
    type: Number
  }
});

const Subcription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subcription;
