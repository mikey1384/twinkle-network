const {poolQuery} = require('../helpers')
const {processedString} = require('../helpers/stringHelpers')

module.exports = {
  deleteComments(req, res) {
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
  },
  editComments(req, res) {
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
  },
  fetchComments(req, res) {
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
  },
  fetchReplies(req, res) {
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
  },
  likeComments(req, res) {
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
  },
  postComments(req, res) {
    const {user} = req
    if (!req.body.rootType) {
      console.error('rootType parameter is missing!')
      return res.status(301).send({error: 'wrong version'})
    }
    const post = Object.assign({}, req.body, {
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
  },
  postReplies(req, res) {
    const {user} = req
    if (!req.body.rootType) {
      console.error('rootType parameter is missing!')
      return res.status(301).send({error: 'wrong version'})
    }
    const post = Object.assign({}, req.body, {
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
  },
  returnComments,
  returnReplies
}

function returnComments(commentRows, rootType) {
  let commentsArray = []
  let taskArray = []
  if (commentRows.length === 0) {
    return Promise.resolve([])
  }
  for (let index = 0; index < commentRows.length; index++) {
    let commentRow = commentRows[index]
    taskArray.push(fetchCommentElements({commentRow, commentsArray, index, rootType}))
  }
  return Promise.all(taskArray).then(
    () => Promise.resolve(commentsArray)
  )
}

const fetchCommentElements = ({commentRow, commentsArray, index, rootType}) => {
  let commentId = commentRow.id
  let loadMoreReplies = false
  let query1 = `
    SELECT a.id, a.userId, b.username FROM
    content_comment_likes a JOIN users b ON
    a.userId = b.id WHERE
    a.commentId = ?
  `
  let query2 = `
    SELECT a.id, a.userId, a.content, a.timeStamp, a.rootId, a.commentId, a.replyId, b.username,
    c.id AS profilePicId, d.userId AS targetUserId, e.username AS targetUserName
    FROM content_comments a JOIN users b ON a.userId = b.id
      LEFT JOIN users_photos c ON a.userId = c.userId AND c.isProfilePic = '1'
      LEFT JOIN content_comments d ON a.replyId = d.id
      LEFT JOIN users e ON d.userId = e.id
    WHERE a.rootType = '${rootType}' AND a.commentId = ?
    ORDER BY a.id DESC LIMIT 2
  `

  return Promise.all([
    poolQuery(query1, commentId),
    poolQuery(query2, commentId).then(
      rows => returnReplies(rows)
    )
  ]).then(
    results => {
      const likes = results[0]
      const replies = results[1]
      if (results[1].length > 1) {
        results[1].pop()
        loadMoreReplies = true
      }
      commentsArray[index] = Object.assign({}, commentRow, {
        replies,
        likes,
        loadMoreReplies
      })
      return Promise.resolve()
    }
  ).catch(
    err => {
      console.error(err)
      return Promise.reject()
    }
  )
}

function returnReplies(replyRows) {
  let repliesArray = []
  let taskArray = []
  if (replyRows.length === 0) {
    return Promise.resolve([])
  }
  for (let index = 0; index < replyRows.length; index++) {
    let replyRow = replyRows[index]
    taskArray.push(fetchReplyElements({replyRow, repliesArray, index}))
  }
  return Promise.all(taskArray)
}

const fetchReplyElements = ({replyRow, repliesArray, index}) => {
  let replyId = replyRow.id
  let query = `
    SELECT a.userId, b.username
    FROM content_comment_likes a JOIN users b ON
    a.userId = b.id WHERE
    a.commentId = ?
  `
  return poolQuery(query, replyId).then(
    rows => Promise.resolve(Object.assign({}, replyRow, {
      likes: rows.map(like => ({
        userId: like.userId,
        username: like.username
      }))
    }))
  )
}
