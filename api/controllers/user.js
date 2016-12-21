const passwordHash = require('password-hash');
const {capitalize, isValidUsername} = require('../helpers/stringHelpers');
const {userExists, isFalseClaim} = require('../helpers/userHelpers');
const {tokenForUser, requireAuth, requireSignin} = require('../auth');
const express = require('express');
const router = express.Router();
const pool = require('../pool');
const async = require('async');
const {processedString} = require('../helpers/stringHelpers');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({signatureVersion: 'v4'});
const config = require('../siteConfig');
const {bucketName} = config;


router.post('/bio', requireAuth, (req, res) => {
  const {user} = req;
  const {firstLine, secondLine, thirdLine} = req.body;
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

router.get('/session', requireAuth, function (req, res) {
  res.send(Object.assign({}, req.user, {userId: req.user.id}))
})

router.post('/login', requireSignin, function (req, res) {
  res.send(
    Object.assign({}, req.user, {
      userId: req.user.id,
      result: "success",
      token: tokenForUser(req.user.id)
    })
  )
})

router.post('/picture', requireAuth, (req, res) => {
  const dataUri = req.body.image.replace(/^data:image\/\w+;base64,/, "")
  const {user} = req;

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
      const params = {Bucket: bucketName, Key: `pictures/${user.id}/${insertId}.jpg`, Body: new Buffer(dataUri, 'base64')};
      s3.putObject(params, function(err, data) {
        callback(err, insertId)
      });
    }
  ], (err, imageId) => {
    if (err) {
      console.error(err)
      return res.status(500).send({error: err})
    }
    res.send({imageId})
  })
})

router.post('/signup', function (req, res) {
  const isTeacher = req.body.isTeacher;
  const username = req.body.username;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const password = req.body.password;
  const realName = capitalize(firstname) + ' ' + capitalize(lastname);
  pool.query('SELECT * FROM users WHERE username = ?', username, (err, rows) => {
    if (!err) {
      if (userExists(rows)) {
        res.json({
          result: "That username already exists"
        });
      } else {
        if (isFalseClaim(email, isTeacher)) {
          res.json({
            result: "That email is not registered as a teacher's email in our database"
          });
        } else {
          saveUserData();
        }
      }
    } else {
      console.log(err);
      res.status(500).send({
        error: err
      });
    }
  });

  function saveUserData() {
    const hashedPass = passwordHash.generate(password);
    const userType = isTeacher ? "teacher" : "user";
    const usernameLowered = username.toLowerCase();
    const post = {
      username: usernameLowered,
      realName,
      email,
      password: hashedPass,
      userType,
      joinDate: Math.floor(Date.now()/1000)
    }
    pool.query('INSERT INTO users SET?', post, function (err, result) {
      if (!err) {
        res.json({
          result: "success",
          username: usernameLowered,
          userType,
          userId: result.insertId,
          token: tokenForUser(result.insertId)
        });
      } else {
        console.error(err);
        res.status(500).send({
          error: err
        });
      }
    });
  }
});

router.get('/username/check', (req, res) => {
  const {username} = req.query;
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

module.exports = router;
