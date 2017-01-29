const config = require('./siteConfig')
const mysql = require('mysql')
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: config.mysqlUser,
  password: config.mysqlPassword,
  database: config.mysqlDatabase,
  supportBigNumbers: true,
  bigNumberStrings: true,
  debug: false
})

module.exports = pool
