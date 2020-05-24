const mongoose = require('mongoose')
const { Schema, model } = mongoose

// Define user schema
var UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String
  },
  balance: {
    type: Number,
    default: 0
  },
  todos: [
    {
      type: Schema.ObjectId,
      ref: 'Todo',
      required: false
    }
  ],
  completedTodos: [{
    type: Schema.ObjectId,
    ref: 'CompletedTodo',
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