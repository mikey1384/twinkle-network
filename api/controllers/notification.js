const express = require('express')
const router = express.Router()
const currentVersion = 0.01

router.get('/version', (req, res) => {
  const {version} = req.query
  res.send({match: Number(version) === currentVersion})
})

module.exports = router
