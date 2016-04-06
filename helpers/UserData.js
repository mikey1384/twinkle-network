export function userExists (rows) {
  var result = (rows.length === 0) ? false : true;
  return result;
}

export function isFalseClaim (email, isTeacher) {
  var emailDomain = typeof email !== 'undefined' ? email.split(".")[0] : '';
  var result = false;
  if (isTeacher) {
    if (emailDomain !== "twinkle") {
      result = true;
    }
  }
  return result;
}


function SignInHandler () {
  var self = this;

  self.loginUser = function (req, res, username, password) {
    pool.query('SELECT * FROM users WHERE username = ?', username, function (err, rows) {
      if (!err) {
        if (userExists(rows)) {
          var hashedPass = rows[0].password;
          if (passwordHash.verify(password, hashedPass)){
            req.session.sessionCode = rows[0].sessioncode;
            res.send({res: "success"});
          } else {
            res.send({res: "wrong password"});
          }
        } else {
          res.send({res:"no user"});
        }
      } else {
        console.log(err);
        res.send({res:"error"});
      }
    });
  }
}
