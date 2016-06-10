const express = require('express');
const bodyParser = require('body-parser');
const siteSession = require('./siteConfig').siteSession;
const router = require('./router');
const socket = require('./socket');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

router(app);
const http = require('http').Server(app);
const io = require('socket.io')(http);
socket(io);

const PORT = 3500;

http.listen(PORT, function () {
  console.log('Server listening on: ' + PORT);
});
