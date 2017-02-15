const express = require('express')
const router = express.Router()
const {poolQuery} = require('../helpers')
const {requireAuth} = require('../auth')
const {processedString} = require('../helpers/stringHelpers')

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

router.post('/comments', requireAuth, (req, res) => {
  const {user} = req
  const post = Object.assign({}, req.body, {
    rootType: 'url',
    content: processedString(req.body.content),
    userId: user.id,
    timeStamp: Math.floor(Date.now()/1000)
  })
  return poolQuery('INSERT INTO content_comments SET ?', post).then(
    result => res.send(Object.assign({}, post, {
      id: result.insertId,
      likes: [],
      replies: [],
      profilePicId: user.profilePicId,
      username: user.username
    }))
  ).catch(
    err => {
      console.error({error: err})
      return res.status(500).send({error: err})
    }
  )
})

router.post('/replies', requireAuth, (req, res) => {
  const {user} = req
  const post = Object.assign({}, req.body, {
    rootType: 'url',
    content: processedString(req.body.content),
    userId: user.id,
    timeStamp: Math.floor(Date.now()/1000)
  })
  const {addedFromPanel} = req.body
  return poolQuery('INSERT INTO content_comments SET ? ', post).then(
    result => {
      let {insertId} = result
      let query = `
        SELECT a.id, a.userId, a.content, a.timeStamp, a.commentId, a.replyId, b.username, c.id AS profilePicId,
        d.userId AS targetUserId, e.username AS targetUserName FROM content_comments a LEFT JOIN users b ON
        a.userId = b.id LEFT JOIN users_photos c ON a.userId = c.userId AND c.isProfilePic = '1'
        LEFT JOIN content_comments d ON a.replyId = d.id
        LEFT JOIN users e ON d.userId = e.id WHERE a.id = ?
      `
      return poolQuery(query, insertId)
    }
  ).then(
     ([reply]) => res.send({result: Object.assign({}, reply, {
       likes: [],
       addedFromPanel
     })})
  ).catch(
    err => {
      console.error(err)
      return res.status(500).send({error: err})
    }
  )
})

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

module.exports = router
