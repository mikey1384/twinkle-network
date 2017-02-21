const app = require('./app')
const socket = require('./socket')
const lex = require('greenlock-express').create({
  server: 'staging',
  email: 'mikey1384@gmail.com',
  agreeTos: true,
  approveDomains: ['www.stage5society.com']
})

if (!process.env.PORT) {
  const https = require('https').createServer(lex.httpsOptions, lex.middleware(app))
  const io = require('socket.io')(https)
  socket(io)
  https.listen(3500, function() {
    console.log('Listening for ACME tls-sni-01 challenges and serve app on', 3500)
  })
} else {
  const http = require('http').Server(app)

  const io = require('socket.io')(http)
  socket(io)

  http.listen(process.env.PORT, function() {
    console.log('Server listening on api port:', process.env.PORT)
  })
}
