const passport = require('passport');
const config = require('../siteConfig');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const passwordHash = require('password-hash');
const localOptions = {};

const pool = require('../pool');
const query = `SELECT a.id, a.username, a.realName, a.class, a.email, a.userType, a.joinDate, a.password, a.lastChannelId, b.id AS profilePicId FROM users a LEFT JOIN users_photos b ON a.id = b.userId AND b.isProfilePic = '1' WHERE `;

const localLogin = new LocalStrategy(localOptions, function(username, password, done) {
  const usernameLowered = username.toLowerCase();
  pool.query(query + 'a.username = ?', usernameLowered, function (err, rows) {
    if (err) return done(err, false);
    if (!rows || rows.length === 0) return done(null, false);

    var hashedPass = rows[0].password;
    if (passwordHash.verify(password, hashedPass)) {
      done(null, rows[0]);
    } else {
      done(null, false);
    }
  });
})

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.jwtSecret
};

const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  pool.query(query + 'a.id = ?', payload.sub, function(err, rows) {
    if (err) {
      return done(err, false);
    }
    if (!rows || rows.length === 0) {
      return done(null, false);
    }
    done(null, rows[0]);
  })
});

passport.use(jwtLogin);
passport.use(localLogin);
