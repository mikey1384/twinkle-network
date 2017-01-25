const app = require('./app');
const socket = require('./socket');
const PORT = 3500;

//const https = require('https').Server(options, app);
const http = require('http').Server(app);

const io = require('socket.io')(http);
socket(io);

http.listen(PORT, function () {
  console.log('Server listening on api port:', PORT);
})
