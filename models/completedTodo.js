const mongoose = require('mongoose')
const { Schema, model } = mongoose

// Define todo schema
var CompletedTodoSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  dateCompleted: {
    type: Date,
    required: true
  },
  points: {
    type: Number,
    required: true
  }
});

// Export Mongoose model
module.exports = model('CompletedTodo', CompletedTodoSchema);