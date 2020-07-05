const mongoose = require('mongoose')
const { Schema, model } = mongoose

// Define user schema
var UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    default: 0
  },
  todolists: [{
    type: Schema.ObjectId,
    ref: 'TodoList',
    required: false
  }],
  rewards: [
    {
      type: Schema.ObjectId,
      ref: 'Reward',
      required: false
    }
  ]
});

// Export Mongoose model
module.exports = model('User', UserSchema);