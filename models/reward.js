const mongoose = require('mongoose')
const { Schema, model } = mongoose

// Define reward schema
var RewardSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: true
  }
});

// Export Mongoose model
module.exports = model('Reward', RewardSchema);