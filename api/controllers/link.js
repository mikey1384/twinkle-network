const express = require('express')
const router = express.Router()
const {poolQuery} = require('../helpers')

router.get('/', (req, res) => {
  const linkId = typeof req.query.linkId !== 'undefined' ? req.query.linkId : null
  const where = linkId !== null ? `WHERE a.id < ${linkId} ` : ''
  let query = `
    SELECT a.*, b.username AS uploaderName,
    (SELECT COUNT(*) FROM content_url_comments WHERE linkId = a.id) AS numComments
    FROM content_urls a JOIN users b ON a.uploader = b.id ${where}
    ORDER BY id DESC LIMIT 21
  `
  poolQuery(query).then(
    results => {
      let tasks = results.map(result => {
        let query = `
          SELECT a.userId, b.username FROM content_url_likes a JOIN users b ON a.userId = b.id
          WHERE a.linkId = ?
        `
        return poolQuery(query, result.id)
      })
      return Promise.all(tasks).then(
        likersArray => {
          return Promise.resolve(results.map((result, index) => {
            return Object.assign({}, result, {likers: likersArray[index]})
          }))
        }
      )
    }
  ).then(
    results => res.send(results)
  ).catch(
    err => {
      console.error(err)
      res.status(500).send({error: err})
    }
  )
})

module.exports = router
