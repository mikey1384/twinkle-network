'use strict';

require('babel-core/register')({});
require('babel-polyfill');
require('./memory');

var server = require('./entry/server').default;
var http = require('http').Server(server);

const PORT = process.env.PORT || 80;

http.listen(PORT, function () {
  console.log('Server listening on: ' + PORT);
});
