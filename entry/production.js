'use strict';

const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.resolve(__dirname, '../public'), { maxAge: '1y' }));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public', 'index.html'));
});
require('greenlock-express')
  .init({
    packageRoot: path.resolve(__dirname, '../'),
    configDir: path.resolve(__dirname, './greenlock.d'),

    // contact for security and critical bug notices
    maintainerEmail: 'mikey1384@gmail.com',
    skipDryRun: true,

    // whether or not to run at cloudscale
    cluster: false
  })
  // Serves on 80 and 443
  // Get's SSL certificates magically!
  .serve(app);
