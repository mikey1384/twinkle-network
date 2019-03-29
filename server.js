'use strict';

require('@babel/register');
require('@babel/polyfill');
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.resolve(__dirname, 'public')));
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
    app
  })
  .listen(80, 443);
