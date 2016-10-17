'use strict';

require('babel-core/register')({});
require('babel-polyfill');
var http = require('http');
var server = require('./entry/server').default;
var TestPort = process.env.PORT;

if (!!TestPort) {
  return http.createServer(server).listen(TestPort, function () {
    console.log('Server listening on: ' + TestPort);
  });
}

require('letsencrypt-express').create({

  server: 'staging',
  email: 'twinkle.andrew@gmail.com',
  agreeTos: true,
  approveDomains: [ 'twin-kle.com' ]

, app: server

}).listen(80, 443, function() {
  console.log('Server listening on port 80 and 443');
});
