'use strict';

require('@babel/register');
require('@babel/polyfill');
const express = require('express');
const path = require('path');
const app = express();
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
  });
  require('greenlock-express')
    .create({
      version: 'draft-12',
      configDir: '~/.config/acme',
      server: 'https://acme-v02.api.letsencrypt.org/directory',
      approveDomains: function approveDomains(opts, certs, cb) {
        if (certs) {
          opts.domains = certs.altnames;
        } else {
          opts.email = 'mikey1384@gmail.com';
          opts.agreeTos = true;
        }

        cb(null, { options: opts, certs });
      },
      app: app
    })
    .listen(80, 443);
} else {
  const webpackServer = require('./webpack/webpack.dev');
  const server = webpackServer.default(app);
  server.use(express.static(path.resolve(__dirname, 'public')));
  const http = require('http');
  const DEV_PORT = process.env.PORT;

  http.createServer(server).listen(DEV_PORT, function() {
    console.log('Server listening on port:', DEV_PORT);
  });
}
