'use strict';

require('@babel/register');
require('@babel/polyfill');
const express = require('express');
const path = require('path');
const app = express();

const server = require('./webpack/webpack.dev').default(app);
server.use(express.static(path.resolve(__dirname, './public')));
const http = require('http');
const DEV_PORT = process.env.PORT;

http.createServer(server).listen(DEV_PORT, function() {
  console.log('Server listening on port:', DEV_PORT);
});
