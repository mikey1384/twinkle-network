const express = require('express')
const router = express.Router()
const {poolQuery} = require('../helpers')
const {requireAuth} = require('../auth')
const {
  deleteComments,
  editComments,
  likeComments,
  postComments,
  postReplies,
  fetchComments,
  fetchReplies
} = require('../helpers/commentHelpers')

router.get('/', (req, res) => {
  const linkId = typeof req.query.linkId !== 'undefined' ? req.query.linkId : null
  const where = linkId !== null ? `WHERE a.id < ${linkId} ` : ''
  let query = `
    SELECT a.*, b.username AS uploaderName,
    (SELECT COUNT(*) FROM content_comments WHERE rootId = a.id AND rootType = 'url') AS numComments
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

router.delete('/comments', requireAuth, deleteComments)

router.get('/comments', fetchComments)

router.put('/comments', requireAuth, editComments)

router.post('/comments/like', requireAuth, likeComments)

router.get('/replies', fetchReplies)

router.post('/replies', requireAuth, postReplies)

router.post('/comments', requireAuth, postComments)

router.post('/like', requireAuth, (req, res) => {
  const {user, body: {contentId: linkId}} = req
  return poolQuery('SELECT * FROM content_url_likes WHERE linkId = ? AND userId = ?', [linkId, user.id]).then(
    rows => {
      if (rows.length > 0) {
        return poolQuery('DELETE FROM content_url_likes WHERE linkId = ? AND userId = ?', [linkId, user.id])
      } else {
        return poolQuery('INSERT INTO content_url_likes SET ?', {linkId, userId: user.id})
      }
    }
  ).then(
    () => {
      const query = `
        SELECT a.userId, b.username
        FROM content_url_likes a LEFT JOIN users b ON a.userId = b.id
        WHERE a.linkId = ?
      `
      return poolQuery(query, linkId)
    }
  ).then(
    rows => res.send({likes: rows})
  ).catch(
    err => {
      console.error(err)
      res.status(500).send({error: err})
    }
  )
})

router.get('/page', (req, res) => {
  const {linkId} = req.query
  let query = `
    SELECT a.*, b.username AS uploaderName FROM content_urls a JOIN users b
    ON a.uploader = b.id
    WHERE a.id = ?
  `
  poolQuery(query, linkId).then(
    ([result]) => {
      let query = `
        SELECT a.userId, b.username FROM content_url_likes a JOIN users b ON a.userId = b.id
        WHERE a.linkId = ?
      `
      return poolQuery(query, result.id).then(
        likers => Promise.resolve({result, likers})
      )
    }
  ).then(
    ({result, likers}) => {
      res.send(Object.assign({}, result, {likers}))
    }
  ).catch(
    error => {
      console.error(error)
      return res.status(500).send({error})
    }
  )
})

module.exports = router
