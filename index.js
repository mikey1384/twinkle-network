'use strict';

require('babel-core/register')({});
require('babel-polyfill');
var http = require('http');
var server = require('./entry/server').default;
const PORT = process.env.PORT || 80;

http.createServer(server).listen(PORT, function () {
  console.log('Server listening on: ' + PORT);
});
