const mongoose = require('mongoose')
const { Schema, model } = mongoose

var TodoListSchema = new Schema({
  title: {
    type: String
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
    ref: 'Todo',
    required: false
  }]
})

module.exports = model('TodoList', TodoListSchema);