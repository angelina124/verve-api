const mongoose = require('mongoose')
const { Schema, model } = mongoose

// Define todo schema
var TodoSchema = new Schema({
  todoList: {
    type: Schema.ObjectId,
    ref: 'TodoList',
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
module.exports = model('Todo', TodoSchema);