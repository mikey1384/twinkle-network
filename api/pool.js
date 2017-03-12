const config = require('./siteConfig')
const mysql = require('mysql')
const pool = mysql.createPool({
  connectionLimit: 10,
  host: config.mysqlHost,
  user: config.mysqlUser,
  password: config.mysqlPassword,
  database: config.mysqlDatabase,
  supportBigNumbers: true,
  bigNumberStrings: true,
  charset: 'utf8mb4',
  debug: false
})

module.exports = pool
