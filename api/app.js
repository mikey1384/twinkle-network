const express = require('express')
const bodyParser = require('body-parser')
const router = require('./router')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json({limit: '5mb'}))

/*
const options = {
  key: fs.readFileSync('./certs/server/privkey.pem'),
  cert: fs.readFileSync('./certs/certificate.pem')
}
*/

router(app)

module.exports = app
