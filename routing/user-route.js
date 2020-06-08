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
const TodoList = require('../models/todolist')

router.route('/')
  // create a user
  .post((req, res) => {
    const { username, password } = req.body
    const hashed_pw = bcrypt.hashSync(password, 10)

    var defaultList = new TodoList({
      title: "Default"
    })

    defaultList.save((err, todoList) => {
      if (err) res.json({ error: true })
      var user = new User({
        username,
        password: hashed_pw,
        todoLists: [defaultList]
      })

      user.save((err, userDoc) => {
        if (err) {
          res.json({ error: true })
        } else {
          res.json({ user: userDoc })
        }
      })
    })
  })


router.route('/login')
  .post((req, res) => {
    const { username, password } = req.body
    if (!username && !password) {
      res.json({ error: true, message: "Could not log in" })
    }
    else {
      User.findOne({ username }).populate("todoLists").populate("rewards").exec((err, user) => {
        if (err) {
          res.json({ error: true })
        } else {
          let hash = user.password
          if (bcrypt.compareSync(password, hash)) {
            res.json({
              user: {
                _id: user._id,
                username: user.username,
                todoLists: user.todoLists,
                rewards: user.rewards
              }
            })
          } else {
            res.json({ error: true })
          }
        }
      })
    }
  })


// get a user of id [id] 
router.route('/:id')
  .get((req, res) => {
    User.findById(req.params.id).populate("todos").exec((err, user) => {
      if (err) {
        res.json({ error: true })
      } else {
        res.json({
          _id: user._id,
          username: user.username,
          todos: user.todos,
          rewards: user.rewards
        })
      }
    })
  })

module.exports = router