// express for routing to different api endpoints
const express = require("express")
const router = express.Router()

// mongoose for actually saving stuff to the MongoDB database
const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types

// bcrypt for password hashing
const bcrypt = require('bcrypt')

// import models
const Todo = require('../models/todo')
const Reward = require('../models/reward')
const User = require('../models/user')

const removeFromUser = (id, uid) => {
  User.findByIdAndUpdate(uid,
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

const completeTodo = (id, uid) => {
  User.findByIdAndUpdate(uid,
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
  //id is the user's id
  .post((req, res) => {
    const { id } = req.params
    const { text, points } = req.body
    if (!text || !points) res.json({ error: true })
    const todo = { user: id, text, points }
    Todo.create(todo).then(todoDoc => {
      User.findByIdAndUpdate(id,
        { $push: { todos: todoDoc._id } },
        { new: true, useFindAndModify: false }
      ).then(() => {
        res.json({ success: true, data: todoDoc })
      })
    }).catch((err) => res.json({ error=true, err }))
  })
  // id is the user's id
  // returns a list of the users todos
  .get((req, res) => {
    const { id } = req.params
    User.findById(id).populate("todos").exec((err, userDoc) => {
      if (err) {
        res.json({ error: true })
      } else {
        res.json({ todos: userDoc.todos })
      }
    })
  })
  //id is the todo's id
  .delete((req, res) => {
    const { id } = req.params
    Todo.findByIdAndDelete(id).then(todoDoc => {
      if (!todoDoc) res.json({ error: true })
      const uid = todoDoc.user
      const updated = { ...removeFromUser(id, uid), todoDoc }
      res.json(updated)
    }).catch((err) => res.json({ error=true, err }))
  })
router.route('/complete/:id')
  .post((req, res) => {
    const { id } = req.params
    Todo.findById(id).then((todoDoc) => {
      if (!todoDoc) res.json({ error: true })
      else {
        const uid = todoDoc.user
        const updated = { ...completeTodo(id, uid), todoDoc }
        res.json(updated)
      }
    }).catch((err) => res.json({ error: true, err }))
  })

module.exports = router