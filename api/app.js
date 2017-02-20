const express = require('express')
const bodyParser = require('body-parser')
const router = require('./router')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json({limit: '5mb'}))

router(app)

module.exports = app
