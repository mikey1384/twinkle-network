const {poolQuery} = require('../helpers')

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

module.exports = {returnComments, returnReplies}
