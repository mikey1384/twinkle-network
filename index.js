'use strict';

require('babel-core/register')({});
require('babel-polyfill');

var server = require('./entry/server').default;
var http = require('http').Server(server);

const PORT = process.env.PORT || 443;

http.listen(PORT, function () {
  console.log('Server listening on: ' + PORT);
});
