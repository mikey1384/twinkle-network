'use strict'

require('babel-register')({})
require('babel-polyfill')
var http = require('http')
var server = require('./entry/server').default
const DEV_PORT = process.env.PORT || 80

http.createServer(server).listen(DEV_PORT, function() {
  console.log('Server listening on port:', DEV_PORT)
})
