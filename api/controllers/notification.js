const pool = require('../pool');
const async = require('async');
const express = require('express');
const router = express.Router();
const {requireAuth} = require('../auth');

router.get('/', requireAuth, (req, res) => {
  const user = req.user;
})

module.exports = router;
