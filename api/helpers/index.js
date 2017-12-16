const pool = require('../pool')

const poolQuery = (query, params) =>
  new Promise((resolve, reject) => {
    pool.query(query, params, (err, results) => {
      if (err) return reject(err)
      resolve(results)
    })
  })

const promiseSeries = array => {
  let results = []
  if (array.length === 0) return Promise.resolve([])
  return array.reduce((promise, task, index) => {
    return promise
      .then(task)
      .then(result => {
        results.push(result)
        if (index < array.length - 1) return Promise.resolve()
        return Promise.resolve(results)
      })
      .catch(error => Promise.reject(error))
  }, Promise.resolve())
}

module.exports = {
  poolQuery,
  promiseSeries
}
