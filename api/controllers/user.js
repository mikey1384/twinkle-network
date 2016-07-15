const config = require('../siteConfig');
const mysql = require('mysql');
const pool = mysql.createPool({
  connectionLimit: 100,
  host: 'localhost',
  user: config.mysqlUser,
  password: config.mysqlPassword,
  database: config.mysqlDatabase,
  supportBigNumbers: true,
  bigNumberStrings: true,
  debug: false
})

const passwordHash = require('password-hash');

const capitalize = require('../helpers/StringHelper').capitalize;
const userExists = require('../helpers/UserHelper').userExists;
const isFalseClaim = require('../helpers/UserHelper').isFalseClaim;

const tokenForUser = require('../auth').tokenForUser;
const requireAuth = require('../auth').requireAuth;
const requireSignin = require('../auth').requireSignin;

const express = require('express');
const router = express.Router();

router.get('/session', requireAuth, function (req, res) {
  res.send(req.user)
})

router.post('/login', requireSignin, function (req, res) {
  const userId = req.user.id;
  res.send({
    result: "success",
    username: req.user.username,
    userId: userId,
    usertype: req.user.usertype,
    token: tokenForUser(userId)
  })
})

router.post('/signup', function (req, res) {
  const isTeacher = req.body.isTeacher;
  const username = req.body.username;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const password = req.body.password;
  const realname = capitalize(firstname) + ' ' + capitalize(lastname);
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
    const usertype = isTeacher ? "teacher" : "user";
    const usernameLowered = username.toLowerCase();
    const post = {
      username: usernameLowered,
      realname,
      email,
      password: hashedPass,
      usertype,
      joindate: Math.floor(Date.now()/1000)
    }
    pool.query('INSERT INTO users SET?', post, function (err, result) {
      if (!err) {
        res.json({
          result: "success",
          username: usernameLowered,
          usertype,
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

module.exports = router;
