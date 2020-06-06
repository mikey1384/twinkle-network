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
    configDir: './greenlock.d',
    maintainerEmail: 'jon@example.com',
    app
  })
  .listen(80, 443);
