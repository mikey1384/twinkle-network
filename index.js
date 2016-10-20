'use strict';

require('babel-core/register')({});
require('babel-polyfill');
var http = require('http');
var server = require('./entry/server').default;
var fs = require('fs');
const DEV_PORT = process.env.PORT || 80;

http.createServer(server).listen(DEV_PORT, function () {
  console.log('Server listening on port:', DEV_PORT);
})


/*
const options = {
  key: fs.readFileSync('./certs/server/privkey.pem'),
  cert: fs.readFileSync('./certs/certificate.pem')
}
*/

/*
if (!!DEV_PORT) {
  return https.createServer(options, server).listen(DEV_PORT, function () {
    console.log('Server listening on: https:', DEV_PORT);
  })
}
*/

/*
if (DEV_PORT != 443 && DEV_PORT != 80) {
  http.createServer(server).listen(DEV_PORT, function () {
    console.log('Server listening on: ' + DEV_PORT);
  })
}
else {
  require('letsencrypt-express').create({
    server: 'staging',
    email: 'mikey1384@gmail.com',
    agreeTos: true,
    approveDomains: ['twin-kle-dev.com'],
    app: server
  }).listen(80, 443);
}
*/
