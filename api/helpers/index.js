const pool = require('../pool')

const poolQuery = (query, params) => new Promise((resolve, reject) => {
  pool.query(query, params, (err, results) => {
    if (err) return reject(err)
    resolve(results)
  })
})

module.exports = {
  poolQuery
}
