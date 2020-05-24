// express for routing to different api endpoints
const express = require("express")
const router = express.Router()

// mongoose for actually saving stuff to the MongoDB database
const mongoose = require('mongoose')
const { ObjectId } = mongoose

// bcrypt for password hashing
const bcrypt = require('bcrypt')

// import models
const Todo = require('../models/todo')
const Reward = require('../models/reward')
const User = require('../models/user')

router.route('/:uid')
  .post((req, res) => {
    const { uid } = req.params
    const { text, points } = req.body
    if (!text || !points) res.json({ error: true })
    const todo = { user: uid, text, points }
    Todo.create(todo).then(todoDoc => {
      User.findByIdAndUpdate(uid,
        { $push: { todos: todoDoc._id } },
        { new: true, useFindAndModify: false }
      ).then(() => {
        res.json({ success: true, data: todoDoc })
      })
    }).catch((err) => console.log(err))
  })
  .get((req, res) => {
    const { uid } = req.params
    User.findById(uid).populate("todos").exec((err, userDoc) => {
      if (err) {
        res.json({ error: true })
      } else {
        res.json({ data: userDoc.todos })
      }
    })
  })

module.exports = router