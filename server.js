const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require('body-parser')
require('dotenv').config()

// set up cors to allow cross-origin requests
const cors = require('cors')


mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/verve-api');

/*if (!mongoose.connection.db) {
  console.log("connecting")
  mongoose.connect(
    "mongodb+srv://angelina:JTapdc43qlrrxqy3@cluster0-x45de.mongodb.net/test?retryWrites=true&w=majority",
    {
      keepAlive: true,
      reconnectTries: Number.MAX_VALUE,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    }
  )
}*/

// Initialize http server
const app = express()

// to allow parsing of request bodies
// set up bodyParser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/api/users/', require('./routing/user-route'))
app.use('/api/todos/', require('./routing/todo-route'))
app.use('/api/rewards/', require('./routing/reward-route'))

const port = process.env.PORT || 3000;
// creates express server
app.listen(port, () => {
  console.log('listening on 3000')
})
