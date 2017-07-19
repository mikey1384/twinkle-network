const passwordHash = require('password-hash')
const {capitalize, isValidUsername} = require('../helpers/stringHelpers')
const {userExists} = require('../helpers/userHelpers')
const {tokenForUser, requireAuth, requireSignin} = require('../auth')
const express = require('express')
const router = express.Router()
const pool = require('../pool')
const {poolQuery} = require('../helpers')
const async = require('async')
const {processedString} = require('../helpers/stringHelpers')
const useragent = require('useragent')
const AWS = require('aws-sdk')
const s3 = new AWS.S3({signatureVersion: 'v4'})
const config = require('../siteConfig')
const {bucketName} = config

router.post('/bio', requireAuth, (req, res) => {
  const {user} = req
  const {firstLine, secondLine, thirdLine} = req.body
  const post = {
    profileFirstRow: processedString(firstLine),
    profileSecondRow: processedString(secondLine),
    profileThirdRow: processedString(thirdLine)
  }
  pool.query(`UPDATE users SET ? WHERE id = ?`, [post, user.id], (err, rows) => {
    if (err) {
      console.error(err)
      return res.status(500).send({error: err})
    }
    res.send(post)
  })
})

router.get('/check', (req, res) => {
  const {username} = req.query
  const query = `
    SELECT a.id, a.username, a.realName, a.email, a.userType, a.joinDate, a.profileFirstRow,
    a.profileSecondRow, a.profileThirdRow, b.id AS profilePicId
    FROM users a LEFT JOIN users_photos b ON a.id = b.userId AND b.isProfilePic = '1' WHERE a.username = ?
  `
  return poolQuery(query, username).then(
    rows => res.send(rows.length > 0)
  ).catch(
    err => {
      console.error(err)
      res.status(500).send({error: err})
    }
  )
})

router.post('/logout', requireAuth, (req, res) => {
  const {user} = req
  const userAgent = useragent.parse(req.headers['user-agent']).toString()
  return poolQuery(`INSERT INTO users_actions SET ?`, {
    userId: user.id,
    action: 'logout',
    userAgent,
    ip: req.ip,
    timeStamp: Math.floor(Date.now()/1000)
  }).then(
    () => res.send(true)
  ).catch(
    err => {
      console.error(err)
      res.status(500).send({error: err})
    }
  )
})

router.post('/navigation', requireAuth, (req, res) => {
  const {user, body: {target}} = req
  const userAgent = useragent.parse(req.headers['user-agent']).toString()
  return poolQuery(`INSERT INTO users_actions SET ?`, {
    userId: user.id,
    action: 'navigate',
    target,
    userAgent,
    ip: req.ip,
    timeStamp: Math.floor(Date.now()/1000)
  }).then(
    () => res.send(true)
  ).catch(
    err => {
      console.error(err)
      res.status(500).send({error: err})
    }
  )
})

router.post('/search', requireAuth, (req, res) => {
  const {user, body: {target, subTarget}} = req
  const userAgent = useragent.parse(req.headers['user-agent']).toString()
  return poolQuery(`INSERT INTO users_actions SET ?`, {
    userId: user.id,
    action: 'search',
    target,
    subTarget,
    userAgent,
    ip: req.ip,
    timeStamp: Math.floor(Date.now()/1000)
  }).then(
    () => res.send(true)
  ).catch(
    err => {
      console.error(err)
      res.status(500).send({error: err})
    }
  )
})

router.get('/session', requireAuth, (req, res) => {
  const {user, query: {pathname}} = req
  const query = `INSERT INTO users_actions SET ?`
  const userAgent = useragent.parse(req.headers['user-agent']).toString()
  poolQuery(query, {
    userId: user.id,
    action: 'enter',
    target: 'website',
    subTarget: pathname,
    method: 'default',
    userAgent,
    ip: req.ip,
    timeStamp: Math.floor(Date.now()/1000)
  })
  res.send(Object.assign({}, user, {userId: user.id}))
})

router.post('/login', requireSignin, function(req, res) {
  const query = `INSERT INTO users_actions SET ?`
  const userAgent = useragent.parse(req.headers['user-agent']).toString()
  poolQuery(query, {
    userId: req.user.id,
    action: 'login',
    userAgent,
    ip: req.ip,
    timeStamp: Math.floor(Date.now()/1000)
  })
  res.send(
    Object.assign({}, req.user, {
      userId: req.user.id,
      result: 'success',
      token: tokenForUser(req.user.id)
    })
  )
})

router.post('/picture', requireAuth, (req, res) => {
  const dataUri = req.body.image.replace(/^data:image\/\w+;base64,/, '')
  const {user} = req

  async.waterfall([
    callback => {
      pool.query('UPDATE users_photos SET ? WHERE userId = ?', [{isProfilePic: 0}, user.id], err => {
        callback(err)
      })
    },
    callback => {
      pool.query('INSERT INTO users_photos SET ?', {userId: user.id, isProfilePic: 1}, (err, result) => {
        callback(err, result.insertId)
      })
    },
    (insertId, callback) => {
      const params = {Bucket: bucketName, Key: `pictures/${user.id}/${insertId}.jpg`, Body: new Buffer(dataUri, 'base64')}
      s3.putObject(params, function(err, data) {
        callback(err, insertId)
      })
    }
  ], (err, imageId) => {
    if (err) {
      console.error(err)
      return res.status(500).send({error: err})
    }
    res.send({imageId, userId: user.id})
  })
})

router.post('/signup', function(req, res) {
  const username = req.body.username
  const firstname = req.body.firstname
  const lastname = req.body.lastname
  const email = req.body.email
  const password = req.body.password
  const realName = capitalize(firstname) + ' ' + capitalize(lastname)
  pool.query('SELECT * FROM users WHERE username = ?', username, (err, rows) => {
    if (!err) {
      if (userExists(rows)) {
        res.status(500).send('That account already exists')
      } else {
        saveUserData()
      }
    } else {
      console.error(err)
      res.status(500).send({
        error: err
      })
    }
  })

  function saveUserData() {
    const hashedPass = passwordHash.generate(password)
    const usernameLowered = username.toLowerCase()
    const post = {
      username: usernameLowered,
      realName,
      email,
      password: hashedPass,
      joinDate: Math.floor(Date.now()/1000)
    }
    pool.query('INSERT INTO users SET?', post, function(err, result) {
      if (!err) {
        res.json({
          result: 'success',
          username: usernameLowered,
          userId: result.insertId,
          token: tokenForUser(result.insertId)
        })
      } else {
        console.error(err)
        res.status(500).send({
          error: err
        })
      }
    })
  }
})

router.get('/users', (req, res) => {
  const {shownUsers} = req.query
  const where = shownUsers ? 'WHERE ' + shownUsers.map(id => `a.id != ${id}`).join(' AND ') : ''
  const query = `
    SELECT a.id, a.username, a.realName, a.email, a.userType, a.joinDate, a.profileFirstRow,
    a.profileSecondRow, a.profileThirdRow, a.online, b.id AS profilePicId FROM users a LEFT JOIN users_photos b ON a.id = b.userId AND b.isProfilePic = '1' ${where}
    ORDER BY a.online DESC, a.lastActive DESC
    LIMIT 21
  `
  return poolQuery(query).then(
    rows => res.send(rows)
  ).catch(
    err => {
      console.error(err)
      res.status(500).send({error: err})
    }
  )
})

router.get('/username/check', (req, res) => {
  const {username} = req.query
  const query = `
    SELECT a.id, a.username, a.realName, a.email, a.userType, a.joinDate, a.profileFirstRow,
    a.profileSecondRow, a.profileThirdRow, b.id AS profilePicId
    FROM users a LEFT JOIN users_photos b ON a.id = b.userId AND b.isProfilePic = '1' WHERE a.username = ?
  `
  if (!isValidUsername(username)) return res.send({pageNotExists: true})
  pool.query(query, username, (err, rows) => {
    if (err) {
      console.error(err)
      return res.send({error: err})
    }
    if (rows.length === 0 || !rows) {
      return res.send({pageNotExists: true})
    }
    res.send({user: rows[0]})
  })
})

router.post('/recordAnonTraffic', (req, res) => {
  const {pathname} = req.body
  const query = `INSERT INTO users_actions SET ?`
  const userAgent = useragent.parse(req.headers['user-agent']).toString()
  return poolQuery(query, {
    action: 'enter',
    target: 'website',
    subTarget: pathname,
    method: 'default',
    userAgent,
    ip: req.ip,
    timeStamp: Math.floor(Date.now()/1000)
  }).then(
    () => res.send(true)
  ).catch(
    err => console.error(err)
  )
})

module.exports = router
