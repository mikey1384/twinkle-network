'use strict'

require('babel-register')({})
require('babel-polyfill')
const server = require('./entry/server').default
if (!process.env.PORT) {
  require('greenlock-express').create({
    server: 'staging',
    email: 'mikey1384@gmail.com',
    agreeTos: true,
    approveDomains: ['www.stage5society.com'],
    app: server
  }).listen(80, 443)
} else {
  const http = require('http')
  const DEV_PORT = process.env.PORT || 80

  http.createServer(server).listen(DEV_PORT, function() {
    console.log('Server listening on port:', DEV_PORT)
  })
}
