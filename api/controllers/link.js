const express = require('express')
const router = express.Router()
const {poolQuery} = require('../helpers')
const {requireAuth} = require('../auth')
const {processedString} = require('../helpers/stringHelpers')
const {returnComments, returnReplies} = require('../helpers/commentHelpers')

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

router.delete('/comments', requireAuth, (req, res) => {
  const user = req.user
  const commentId = Number(req.query.commentId)
  poolQuery('DELETE FROM content_comments WHERE id = ? AND userId = ?', [commentId, user.id]).then(
    () => res.send({success: true})
  ).catch(
    error => {
      console.error(error)
      return res.status(500).send({error})
    }
  )
})

router.get('/comments', (req, res) => {
  const {rootId, lastCommentId, rootType} = req.query
  const limit = 21
  const where = !!lastCommentId && lastCommentId !== '0' ? 'AND a.id < ' + lastCommentId + ' ' : ''
  const query = `
    SELECT a.id, a.userId, a.content, a.timeStamp, a.rootId, a.commentId, a.replyId, b.username,
    c.id AS profilePicId, d.title AS discussionTitle
    FROM content_comments a LEFT JOIN users b ON a.userId = b.id
    LEFT JOIN users_photos c ON a.userId = c.userId AND c.isProfilePic = '1'
    LEFT JOIN content_discussions d ON a.discussionId = d.id
    WHERE a.rootType = '${rootType}' AND a.rootId = ? AND commentId IS NULL ${where}
    ORDER BY a.id DESC LIMIT ${limit}
  `
  poolQuery(query, rootId).then(
    rows => returnComments(rows, rootType)
  ).then(
    comments => res.send({comments})
  ).catch(
    err => {
      console.error(err)
      return res.status(500).send({error: err})
    }
  )
})

router.post('/comments/edit', requireAuth, (req, res) => {
  const user = req.user
  const content = processedString(req.body.editedComment)
  const commentId = req.body.commentId
  const userId = user.id
  poolQuery('UPDATE content_comments SET ? WHERE id = ? AND userId = ?', [{content}, commentId, userId]).then(
    () => res.send({success: true})
  ).catch(
    error => {
      console.error(error)
      return res.status(500).send({error})
    }
  )
})

router.post('/comments/like', requireAuth, (req, res) => {
  const user = req.user
  const commentId = req.body.commentId
  const query1 = 'SELECT * FROM content_comment_likes WHERE commentId = ? AND userId = ?'
  const query2 = 'DELETE FROM content_comment_likes WHERE commentId = ? AND userId = ?'
  const query3 = 'INSERT INTO content_comment_likes SET ?'
  const query4 = `
    SELECT a.id, a.userId, b.username FROM
    content_comment_likes a LEFT JOIN users b ON
    a.userId = b.id WHERE
    a.commentId = ?
  `
  return poolQuery(query1, [commentId, user.id]).then(
    rows => {
      if (rows.length > 0) {
        return poolQuery(query2, [commentId, user.id])
      } else {
        return poolQuery(query3, {commentId, userId: user.id})
      }
    }
  ).then(
    () => poolQuery(query4, commentId)
  ).then(
    rows => res.send({
      likes: rows
    })
  )
})

router.get('/replies', (req, res) => {
  const {lastReplyId, commentId, rootType} = req.query
  const where = !!lastReplyId && lastReplyId !== '0' ? 'AND a.id < ' + lastReplyId + ' ' : ''
  let loadMoreReplies = false
  const query = `
    SELECT a.id, a.userId, a.content, a.timeStamp, a.rootId, a.commentId, a.replyId, b.username,
    c.id AS profilePicId, d.userId AS targetUserId, e.username AS targetUserName
    FROM content_comments a JOIN users b ON a.userId = b.id
    LEFT JOIN users_photos c ON a.userId = c.userId AND c.isProfilePic = '1'
    LEFT JOIN content_comments d ON a.replyId = d.id
    LEFT JOIN users e ON d.userId = e.id WHERE a.commentId = ? ${where} AND a.rootType = '${rootType}'
    ORDER BY a.id DESC LIMIT 11
  `
  return poolQuery(query, [commentId, lastReplyId]).then(
    rows => {
      if (rows.length > 10) {
        rows.pop()
        loadMoreReplies = true
      }
      rows.sort(function(a, b) { return a.id - b.id })
      return returnReplies(rows).then(
        replies => res.send({replies, loadMoreReplies})
      )
    }
  ).catch(
    err => {
      console.error(err)
      return res.status(500).send({error: err})
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

module.exports = router
