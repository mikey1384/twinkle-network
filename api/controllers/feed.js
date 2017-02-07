const pool = require('../pool')
const async = require('async')
const express = require('express')
const router = express.Router()
const {requireAuth} = require('../auth')
const {
  processedString,
  processedTitleString,
  fetchedVideoCodeFromURL,
  processedURL
} = require('../helpers/stringHelpers')
const {returnComments} = require('../helpers/videoHelpers')
const {fetchFeeds} = require('../helpers/feedHelpers')
const {poolQuery} = require('../helpers')

router.get('/', fetchFeeds)

router.get('/category', (req, res) => {
  const {searchText} = req.query
  async.waterfall([
    callback => {
      pool.query('SELECT COUNT(*) AS numCategories FROM content_categories', (err, rows) => {
        const numCategories = Number(rows[0].numCategories)
        if (searchText === 'undefined' && numCategories > 7) {
          return callback(err, [])
        }
        callback(err)
      })
    },
    callback => {
      const where = searchText !== 'undefined' ? ' WHERE label LIKE ?' : ''
      pool.query('SELECT id, label FROM content_categories' + where, '%' + searchText + '%', (err, rows) => {
        callback(err, rows)
      })
    }
  ], (err, result) => {
    if (err) {
      console.error(err)
      res.status(500).send({error: err})
      return
    }
    res.send(result)
  })
})

router.get('/comments', (req, res) => {
  const {type, contentId, lastCommentId, isReply} = req.query
  const limit = 4
  let where
  switch (type) {
    case 'video':
      where = 'videoId = ? AND a.commentId IS NULL'
      break
    case 'comment':
      where = isReply === 'true' ? 'replyId = ?' : 'commentId = ?'
      break
    case 'discussion':
      where = 'discussionId = ? AND a.commentId IS NULL'
      break
    default:
      console.error('Invalid Content Type')
      return res.status(500).send({error: 'Invalid Content Type'})
  }
  if (!!lastCommentId && lastCommentId !== '0') where += ' AND a.id < ' + lastCommentId
  const query = `
    SELECT a.id, a.userId, a.content, a.timeStamp, a.videoId, a.commentId, a.replyId, b.username,
    c.id AS profilePicId, d.userId AS targetUserId, e.username AS targetUserName FROM vq_comments a JOIN users b ON
    a.userId = b.id LEFT JOIN users_photos c ON a.userId = c.userId AND c.isProfilePic = '1' LEFT JOIN vq_comments d
    ON a.replyId = d.id LEFT JOIN users e ON d.userId = e.id
    WHERE a.${where} ORDER BY a.id DESC LIMIT ${limit}
  `
  pool.query(query, contentId, (err, rows) => {
    if (err) {
      console.error(err)
      return res.status(500).send({error: err})
    }
    if (rows.length === 0) {
      return res.send([])
    }
    returnComments(rows, (err, commentsArray) => {
      if (err) {
        console.error(err)
        return res.status(500).send({error: err})
      }
      res.send(commentsArray)
    })
  })
})

router.post('/content', requireAuth, (req, res) => {
  const {user} = req
  const {url, title, description, selectedCategory, checkedVideo} = req.body
  const type = checkedVideo ? 'video' : 'url'
  const query = checkedVideo ? 'INSERT INTO vq_videos SET ?' : 'INSERT INTO content_urls SET ?'
  const content = checkedVideo ? fetchedVideoCodeFromURL(url) : processedURL(url)
  const post = Object.assign({}, {
    title: processedTitleString(title),
    description: (!description || description === '') ? 'No description' : processedString(description),
    uploader: user.id,
    timeStamp: Math.floor(Date.now()/1000),
    categoryId: selectedCategory},
    (checkedVideo ? {videocode: content} : {url: content})
  )
  pool.query(query, post, (err, result) => {
    if (err) {
      console.error(err)
      return res.status(500).send({error: err})
    }

    res.send({
      type,
      id: type + result.insertId,
      contentId: result.insertId,
      uploaderId: user.id,
      content,
      videoCode: content,
      timeStamp: post.timeStamp,
      parentContentId: result.insertId,
      parentContentTitle: post.title,
      parentContentDescription: post.description,
      commentId: null,
      replyId: null,
      contentTitle: post.title,
      contentDescription: post.description,
      uploaderName: user.username,
      uploaderPicId: user.profilePicId,
      targetCommentUploaderId: null,
      targetComment: null,
      targetCommentUploaderName: null,
      targetReplyUploaderId: null,
      targetReply: null,
      targetReplyUploaderName: null,
      videoViews: null,
      childComments: [],
      contentLikers: [],
      targetContentLikers: []
    })
  })
})

router.get('/feed', (req, res) => {
  const {type, contentId, parentContentId} = req.query
  const result = Object.assign({}, req.query, {
    id: Number(req.query.id),
    contentId: Number(req.query.contentId),
    parentContentId: Number(req.query.parentContentId),
    uploaderId: Number(req.query.uploaderId),
    timeStamp: Number(req.query.timeStamp)
  })
  let query
  let videoQuery = `
    SELECT a.userId, b.username
    FROM vq_video_likes a LEFT JOIN users b ON
    a.userId = b.id WHERE
    a.videoId = ?
  `
  let commentQuery = `
    SELECT a.userId, b.username
    FROM vq_commentupvotes a LEFT JOIN users b ON
    a.userId = b.id WHERE
    a.commentId = ?
  `

  switch (type) {
    case 'comment':
      query = `
        SELECT comment1.content, comment1.commentId, comment1.replyId, comment1.discussionId,
        user1.username AS uploaderName, userPhoto.id AS uploaderPicId,
        comment2.userId AS targetCommentUploaderId, comment2.content AS targetComment,
        user2.username AS targetCommentUploaderName,
        comment3.userId AS targetReplyUploaderId, comment3.content AS targetReply,
        user3.username AS targetReplyUploaderName,
        discussion.title AS discussionTitle,
        discussion.description AS discussionDescription,

        video.title AS parentContentTitle, video.description AS parentContentDescription, video.title AS contentTitle,
        video.videoCode,

        (SELECT COUNT(*) FROM vq_comments WHERE commentId = ${contentId}) AS numChildComments,
        (SELECT COUNT(*) FROM vq_comments WHERE replyId = ${contentId}) AS numChildReplies

        FROM vq_comments comment1
          LEFT JOIN vq_videos video
            ON comment1.videoId = video.id
          LEFT JOIN users user1
            ON comment1.userId = user1.id
          LEFT JOIN users_photos userPhoto
            ON comment1.userId = userPhoto.userId AND userPhoto.isProfilePic = '1'
          LEFT JOIN vq_comments comment2
            ON comment1.commentId = comment2.id
          LEFT JOIN users user2
            ON comment2.userId = user2.id
          LEFT JOIN vq_comments comment3
            ON comment1.replyId = comment3.id
          LEFT JOIN users user3
            ON comment3.userId = user3.id
          LEFT JOIN content_discussions discussion
            ON comment1.discussionId = discussion.id

        WHERE comment1.id = ?
      `
      break
    case 'discussion':
      query = `
        SELECT discussion.title AS contentTitle, discussion.description AS contentDescription,
        video.videoCode, video.title AS parentContentTitle, video.description AS parentContentDescription,
        user.username AS uploaderName, userPhoto.id AS uploaderPicId,
        (SELECT COUNT(*) FROM vq_comments WHERE discussionId = discussion.id) AS numChildComments
        FROM content_discussions discussion
          LEFT JOIN vq_videos video
            ON discussion.refContentType = 'video' AND refContentId = video.id
          LEFT JOIN users user
            ON discussion.userId = user.id
          LEFT JOIN users_photos userPhoto
            ON discussion.userId = userPhoto.userId AND userPhoto.isProfilePic = '1'

        WHERE discussion.id = ?
      `
      break
    case 'url':
      query = `
        SELECT url.title AS parentContentTitle, url.description AS parentContentDescription,
        url.url AS content, url.title AS contentTitle, user.username AS uploaderName, userPhoto.id AS uploaderPicId
        FROM content_urls url JOIN users user ON url.uploader = user.id JOIN users_photos userPhoto ON
        url.uploader = userPhoto.userId
        WHERE url.id = ?
      `
      break
    case 'video':
      query = `
        SELECT video.title AS parentContentTitle, video.description AS parentContentDescription,
        video.videoCode AS content, video.title AS contentTitle, video.description AS contentDescription,
        video.videoCode, user.username AS uploaderName, userPhoto.id AS uploaderPicId,
        (SELECT COUNT(*) FROM vq_video_views WHERE videoId = video.id) AS videoViews,
        (SELECT COUNT(*) FROM vq_comments WHERE videoId = video.id) AS numChildComments
        FROM vq_videos video
          LEFT JOIN users user
            ON video.uploader = user.id
          LEFT JOIN users_photos userPhoto
            ON video.uploader = userPhoto.userId AND userPhoto.isProfilePic = '1'
        WHERE video.id = ?
      `
      break
    default: break
  }

  return poolQuery(query, contentId).then(
    rows => {
      let feed = rows[0]
      let targetId = feed.replyId || feed.commentId
      switch (type) {
        case 'comment':
          return Promise.all([
            poolQuery(commentQuery, contentId),
            poolQuery(commentQuery, targetId || '0'),
            poolQuery(videoQuery, parentContentId)
          ]).then(
            results => {
              feed['contentLikers'] = results[0]
              feed['targetContentLikers'] = results[1]
              feed['parentContentLikers'] = results[2]
              return Promise.resolve(feed)
            }
          )
        case 'url':
        case 'discussion':
          feed['contentLikers'] = []
          feed['parentContentLikers'] = []
          return Promise.resolve(feed)
        default:
          return poolQuery(videoQuery, contentId).then(
            rows => {
              feed['contentLikers'] = rows
              return Promise.resolve(feed)
            }
          )
      }
    }
  ).then(
    feed => res.send(Object.assign({}, result, feed))
  ).catch(
    err => {
      console.error(err)
      res.status(500).send({error: err})
    }
  )
})

router.post('/targetContentComment', requireAuth, (req, res) => {
  const {user, body} = req
  const query = `INSERT INTO vq_comments SET ?`
  const post = Object.assign({}, body, {
    userId: user.id,
    timeStamp: Math.floor(Date.now()/1000)
  })
  pool.query(query, post, (err, result) => {
    if (err) {
      console.error(err)
      res.status(500).send({error: err})
    }
    res.send(Object.assign({}, post, {
      id: result.insertId,
      username: user.username,
      profilePicId: user.profilePicId
    }))
  })
})

module.exports = router
