'use strict';

const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.resolve(__dirname, '../public'), { maxAge: '1y' }));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public', 'index.html'));
});
require('greenlock-express')
  .create({
    version: 'draft-11',
    configDir: '~/.config/acme',
    renewWithin: 30 * 24 * 60 * 60 * 1000,
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
