const pool = require('../pool')

const poolQuery = (query, params) => new Promise((resolve, reject) => {
  pool.query(query, params, (err, results) => {
    if (err) return reject(err)
    resolve(results)
  })
})

const promiseSeries = array => array.reduce((promise, task) => promise.then(task), Promise.resolve())

module.exports = {
  poolQuery,
  promiseSeries
}
