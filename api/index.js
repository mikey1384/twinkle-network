const express = require('express');
const bodyParser = require('body-parser');
const siteSession = require('./siteConfig').siteSession;
const router = require('./router');
const socket = require('./socket');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit: '5mb'}));
const PORT = 3500;

/*
const options = {
  key: fs.readFileSync('./certs/server/privkey.pem'),
  cert: fs.readFileSync('./certs/certificate.pem')
}
*/

router(app);
//const https = require('https').Server(options, app);
const http = require('http').Server(app);

const io = require('socket.io')(http);
socket(io);

http.listen(PORT, function () {
  console.log('Server listening on api port:', PORT);
})
