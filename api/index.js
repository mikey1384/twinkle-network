const app = require('./app')
const socket = require('./socket')

if (!process.env.PORT) {
  const http = require('http').Server(app)
  const io = require('socket.io')(http)
  socket(io)
  require('greenlock-express').create({
    server: 'staging',
    email: 'mikey1384@gmail.com',
    agreeTos: true,
    approveDomains: ['www.stage5society.com'],
    app: http
  }).listen(3500)
} else {
  const http = require('http').Server(app)

  const io = require('socket.io')(http)
  socket(io)

  http.listen(process.env.PORT, function() {
    console.log('Server listening on api port:', process.env.PORT)
  })
}
