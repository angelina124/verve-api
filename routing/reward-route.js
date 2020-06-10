// express for routing to different api endpoints
const express = require("express")
const router = express.Router()

// mongoose for actually saving stuff to the MongoDB database
const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types

// import models
const Reward = require('../models/reward')
const User = require('../models/user')

//id is the id of the user
router.route("/:uid")
  .post((req, res) => {
    const { uid } = req.params
    const { text, points } = req.body
    if (!text || !points) return res.json({ error: true })
    const reward = new Reward({ user: uid, text, points })
    reward.save((err, rewardDoc) => {
      console.log(rewardDoc)
      if (err) return res.json({ error: true, err })
      User.findByIdAndUpdate(uid,
        { $push: { rewards: rewardDoc._id } },
        { new: true, useFindAndModify: false }
      ).exec().then(() => {
        console.log("success")
        return res.json({ success: true, data: rewardDoc })
      })
    })
  })
  .get((req, res) => {
    const { uid } = req.params
    User.findById(uid).populate("rewards").exec((err, userDoc) => {
      if (err) {
        return res.json({ error: true })
      } else {
        return res.json({ rewards: userDoc.rewards })
      }
    })
  })

module.exports = router