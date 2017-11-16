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
const {postContents} = require('../helpers/contentHelpers')
const {stringIsEmpty} = require('../helpers/stringHelpers')

router.get('/', (req, res) => {
  const linkId = typeof req.query.linkId !== 'undefined' ? req.query.linkId : null
  const where = linkId !== null ? `WHERE a.id < ${linkId} ` : ''
  let query = `
    SELECT a.*, b.username AS uploaderName,
    (SELECT COUNT(id) FROM content_comments WHERE rootId = a.id AND rootType = 'url') AS numComments
    FROM content_urls a JOIN users b ON a.uploader = b.id ${where}
    ORDER BY id DESC LIMIT 21
  `
  return poolQuery(query).then(
    results => {
      let tasks = results.map(result => {
        let query = `
          SELECT a.userId, b.username FROM content_likes a JOIN users b ON a.userId = b.id
          WHERE a.rootType = 'url' AND a.rootId = ?
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
    error => {
      console.error(error)
      res.status(500).send({error})
    }
  )
})

router.post('/', requireAuth, (req, res) => {
  const {url, title, description} = req.body
  const {user} = req
  return postContents({url, title, description, uploader: user.id, type: 'url'}).then(
    ({result, post}) => res.send(Object.assign({}, post, {
      id: result.insertId,
      uploaderName: user.username,
      numComments: 0,
      likers: []
    }))
  ).catch(
    error => {
      console.error(error)
      res.status(500).send({error})
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
  const query = `SELECT * FROM content_likes WHERE rootType = 'url' AND rootId = ? AND userId = ?`
  return poolQuery(query, [linkId, user.id]).then(
    rows => {
      if (rows.length > 0) {
        let query = `DELETE FROM content_likes WHERE rootType = 'url' AND rootId = ? AND userId = ?`
        return poolQuery(query, [linkId, user.id])
      } else {
        return poolQuery('INSERT INTO content_likes SET ?', {
          rootType: 'url',
          rootId: linkId,
          userId: user.id,
          timeStamp: Math.floor(Date.now()/1000)
        })
      }
    }
  ).then(
    () => {
      const query = `
        SELECT a.userId, b.username
        FROM content_likes a LEFT JOIN users b ON a.userId = b.id
        WHERE a.rootType = 'url' AND a.rootId = ?
      `
      return poolQuery(query, linkId)
    }
  ).then(
    rows => res.send({likes: rows})
  ).catch(
    error => {
      console.error(error)
      res.status(500).send({error})
    }
  )
})

router.delete('/page', requireAuth, (req, res) => {
  const {query: {linkId}, user} = req
  return poolQuery('DELETE FROM content_urls WHERE id = ? AND uploader = ?', [linkId, user.id]).then(
    () => res.send({success: true})
  ).catch(
    error => {
      console.error(error)
      res.status(500).send({error})
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
        SELECT a.userId, b.username FROM content_likes a JOIN users b ON a.userId = b.id
        WHERE a.rootType = 'url' AND a.rootId = ?
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

router.put('/page', requireAuth, (req, res) => {
  const {user, body: {editedTitle, editedDescription, editedUrl, linkId}} = req
  if (stringIsEmpty(editedTitle)) {
    return res.status(500).send({error: 'Title is empty'})
  }
  const post = {title: editedTitle, content: editedUrl, description: editedDescription}
  return poolQuery('UPDATE content_urls SET ? WHERE id = ? AND uploader = ?', [post, linkId, user.id]).then(
    () => res.send({success: true})
  ).catch(
    error => {
      console.error(error)
      return res.status(500).send({error})
    }
  )
})

router.put('/title', requireAuth, (req, res) => {
  const {user, body: {title, id}} = req
  if (stringIsEmpty(title)) {
    return res.status(500).send({error: 'Title is empty'})
  }
  return poolQuery('UPDATE content_urls SET ? WHERE id = ? AND uploader = ?', [{title}, id, user.id]).then(
    () => res.send({success: true})
  ).catch(
    error => {
      console.error(error)
      return res.status(500).send({error})
    }
  )
})

module.exports = router
