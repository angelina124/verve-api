// express for routing to different api endpoints
const express = require("express")
const router = express.Router()

// mongoose for actually saving stuff to the MongoDB database
const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types

// import models
const Todo = require('../models/todo')
const TodoList = require('../models/todolist')

const removeFromTodoList = (id, tid) => {
  TodoList.findByIdAndUpdate(tid,
    {
      $pull: {
        "todos": {
          "$in": [
            id
          ]
        }
      }
    },
    { new: true, useFindAndModify: false }
  ).then(() => {
    return { error: false }
  }).catch((err) => {
    return { error: true, err }
  })
}

const completeTodo = (id, tid) => {
  TodoList.findByIdAndUpdate(tid,
    {
      $pull: {
        "todos": {
          "$in": [
            id
          ]
        }
      },
      $push: {
        "completedTodos": ObjectId(id)
      }
    },
    { new: true, useFindAndModify: false }
  ).then(() => {
    return { error: false }
  }).catch((err) => {
    return { error: true, err }
  })
}

router.route('/:id')
  //id is the todolist's id
  .post((req, res) => {
    const { id } = req.params
    const { text, points } = req.body
    if (!text || !points) res.json({ error: true })
    const todo = { todoList: id, text, points }
    Todo.create(todo).then(todoDoc => {
      TodoList.findByIdAndUpdate(id,
        { $push: { todos: todoDoc._id } },
        { new: true, useFindAndModify: false }
      ).exec().then(() => {
        res.json({ success: true, data: todoDoc })
      })
    }).catch((err) => res.json({ error: true, err }))
  })
  // id is the todolist's id
  // returns a list of the todolist's todos
  .get((req, res) => {
    const { id } = req.params
    TodoList.findById(id).populate("todos").exec((err, todoListDoc) => {
      if (err) {
        res.json({ error: true })
      } else {
        res.json({ todos: todoListDoc.todos })
      }
    })
  })
  //id is the todo's id
  .delete((req, res) => {
    const { id } = req.params
    Todo.findByIdAndDelete(id).exec().then(todoDoc => {
      if (!todoDoc) res.json({ error: true })
      const tid = todoDoc.todoList
      const updated = { ...removeFromTodoList(id, tid), todoDoc }
      res.json(updated)
    }).catch((err) => res.json({ error: true, err }))
  })
router.route('/complete/:id')
  .post((req, res) => {
    const { id } = req.params
    Todo.findById(id).exec().then((todoDoc) => {
      if (!todoDoc) res.json({ error: true })
      else {
        const tid = todoDoc.todoList
        const updated = { ...completeTodo(id, tid), todoDoc }
        res.json(updated)
      }
    }).catch((err) => res.json({ error: true, err }))
  })

module.exports = router