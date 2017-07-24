const pool = require('../pool')
const express = require('express')
const router = express.Router()
const {requireAuth} = require('../auth')
const {
  returnComments,
  likeComments,
  postComments,
  postReplies,
  editComments,
  deleteComments,
  fetchReplies
} = require('../helpers/commentHelpers')
const {uploadContents} = require('../helpers/contentHelpers')
const {fetchFeeds} = require('../helpers/feedHelpers')
const {poolQuery} = require('../helpers')

router.get('/', fetchFeeds)

router.get('/user', (req, res) => {
  const {username, type, lastId} = req.query
  const where = lastId ? `AND a.id < ${lastId}` : ''
  const limit = lastId ? '6' : '21'
  const query = `
    SELECT a.id, a.type, a.contentId, a.rootType, a.rootId, a.uploaderId, a.timeStamp FROM
    noti_feeds a JOIN users b ON a.uploaderId = b.id WHERE b.username = ? AND a.type = ? ${where}
    ORDER BY id DESC LIMIT ${limit}
  `
  return poolQuery(query, [username, type]).then(
    rows => res.send(rows)
  )
})

router.get('/comments', (req, res) => {
  const {type, contentId, lastCommentId, isReply, rootType} = req.query
  const limit = 4
  let where
  switch (type) {
    case 'video':
      where = `rootType = 'video' AND a.rootId = ? AND a.commentId IS NULL`
      break
    case 'comment':
      where = isReply === 'true' ? 'replyId = ?' : 'commentId = ?'
      break
    case 'discussion':
      where = 'discussionId = ? AND a.commentId IS NULL'
      break
    case 'url':
      where = `rootType = 'url' AND a.rootId = ? AND a.commentId IS NULL`
      break
    default:
      console.error('Invalid Content Type')
      return res.status(500).send({error: 'Invalid Content Type'})
  }
  if (!!lastCommentId && lastCommentId !== '0') where += ' AND a.id < ' + lastCommentId
  const query = `
    SELECT a.*, b.username, c.id AS profilePicId, d.userId AS targetUserId, e.username AS targetUserName
    FROM content_comments a
    JOIN users b ON a.userId = b.id
    LEFT JOIN users_photos c ON a.userId = c.userId AND c.isProfilePic = '1'
    LEFT JOIN content_comments d ON a.replyId = d.id
    LEFT JOIN users e ON d.userId = e.id
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
    return returnComments(rows, rootType).then(
      commentsArray => res.send(commentsArray)
    ).catch(
      err => {
        console.error(err)
        return res.status(500).send({error: err})
      }
    )
  })
})

router.delete('/comments', requireAuth, deleteComments)

router.post('/comments', requireAuth, postComments)

router.post('/comments/like', requireAuth, likeComments)

router.put('/comments', requireAuth, editComments)

router.get('/replies', fetchReplies)

router.post('/replies', requireAuth, postReplies)

router.post('/content', requireAuth, (req, res) => {
  const {user} = req
  const {url, title, description, checkedVideo} = req.body
  const type = checkedVideo ? 'video' : 'url'
  return uploadContents({url, description, title, uploader: user.id, type}).then(
    ({result, post}) => res.send({
      type,
      id: type + result.insertId,
      contentId: result.insertId,
      uploaderId: user.id,
      content: post.content,
      rootContent: post.content,
      rootType: type,
      timeStamp: post.timeStamp,
      rootId: result.insertId,
      rootContentTitle: post.title,
      rootContentDescription: post.description,
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
  ).catch(
    error => {
      console.error(error)
      return res.status(500).send({error})
    }
  )
})

router.get('/feed', (req, res) => {
  const {type, contentId, rootType, rootId} = req.query
  const result = Object.assign({}, req.query, {
    id: Number(req.query.id),
    contentId: Number(req.query.contentId),
    rootId: Number(req.query.rootId),
    uploaderId: Number(req.query.uploaderId),
    timeStamp: Number(req.query.timeStamp)
  })
  let query
  let likeQuery = type => `
    SELECT a.userId, b.username
    FROM content_likes a LEFT JOIN users b ON
    a.userId = b.id WHERE
    a.rootType = '${type}' AND a.rootId = ?
  `

  switch (type) {
    case 'comment':
      let rootTableName
      if (rootType === 'url') rootTableName = 'content_urls'
      if (rootType === 'video') rootTableName = 'vq_videos'
      query = `
        SELECT comment1.content, comment1.commentId, comment1.replyId, comment1.discussionId,
        user1.username AS uploaderName, userPhoto.id AS uploaderPicId,
        comment2.userId AS targetCommentUploaderId,
        comment2.content AS targetComment,
        comment2.timeStamp AS targetCommentTimeStamp,
        user2.username AS targetCommentUploaderName,
        comment3.userId AS targetReplyUploaderId,
        comment3.content AS targetReply,
        comment3.timeStamp AS targetReplyTimeStamp,
        user3.username AS targetReplyUploaderName,
        discussion.title AS discussionTitle,
        discussion.description AS discussionDescription,
        discussion.userId AS discussionUploaderId,
        discussion.timeStamp AS discussionTimeStamp,
        user4.username AS discussionUploaderName,

        ${rootType}.title AS rootContentTitle, ${rootType}.description AS rootContentDescription, ${rootType}.title AS contentTitle, ${rootType}.content AS rootContent,
        ${rootType === 'url' ? `${['thumbUrl', 'actualTitle', 'actualDescription', 'siteUrl'].map(prop => `url.${prop}`).join(', ')},` : (rootType === 'video' ? 'video.hasHqThumb,' : '')}

        (SELECT COUNT(id) FROM content_comments WHERE commentId = ${contentId}) AS numChildComments,
        (SELECT COUNT(id) FROM content_comments WHERE replyId = ${contentId}) AS numChildReplies

        FROM content_comments comment1
          LEFT JOIN ${rootTableName} ${rootType}
            ON comment1.rootId = ${rootType}.id
          LEFT JOIN users user1
            ON comment1.userId = user1.id
          LEFT JOIN users_photos userPhoto
            ON comment1.userId = userPhoto.userId AND userPhoto.isProfilePic = '1'
          LEFT JOIN content_comments comment2
            ON comment1.commentId = comment2.id
          LEFT JOIN users user2
            ON comment2.userId = user2.id
          LEFT JOIN content_comments comment3
            ON comment1.replyId = comment3.id
          LEFT JOIN users user3
            ON comment3.userId = user3.id
          LEFT JOIN content_discussions discussion
            ON comment1.discussionId = discussion.id
          LEFT JOiN users user4
            ON discussion.userId = user4.id

        WHERE comment1.id = ?
      `
      break
    case 'discussion':
      query = `
        SELECT discussion.id AS discussionId, discussion.title AS contentTitle, discussion.description AS contentDescription, video.content AS rootContent, video.title AS rootContentTitle, video.description AS rootContentDescription, video.hasHqThumb,
        user.username AS uploaderName, userPhoto.id AS uploaderPicId,
        (SELECT COUNT(id) FROM content_comments WHERE discussionId = discussion.id) AS numChildComments
        FROM content_discussions discussion
          LEFT JOIN vq_videos video
            ON discussion.rootType = 'video' AND rootId = video.id
          LEFT JOIN users user
            ON discussion.userId = user.id
          LEFT JOIN users_photos userPhoto
            ON discussion.userId = userPhoto.userId AND userPhoto.isProfilePic = '1'

        WHERE discussion.id = ?
      `
      break
    case 'url':
      query = `
        SELECT url.title AS rootContentTitle, url.description AS rootContentDescription, 'url' AS rootType,
        url.content AS content, url.title AS contentTitle, url.thumbUrl, url.actualTitle, url.actualDescription,
        url.siteUrl, user.username AS uploaderName, userPhoto.id AS uploaderPicId, url.description AS 
        contentDescription,
        (SELECT COUNT(id) FROM content_comments WHERE rootType = 'url' AND rootId = url.id)
        AS numChildComments
        FROM content_urls url
        LEFT JOIN users user ON url.uploader = user.id
        LEFT JOIN users_photos userPhoto ON
        url.uploader = userPhoto.userId AND userPhoto.isProfilePic = '1'
        WHERE url.id = ?
      `
      break
    case 'video':
      query = `
        SELECT video.title AS rootContentTitle, video.description AS rootContentDescription, 'video' AS rootType, video.content AS rootContent, video.title AS contentTitle,
        video.description AS contentDescription, video.hasHqThumb,
        video.content, user.username AS uploaderName, userPhoto.id AS uploaderPicId,
        (SELECT COUNT(id) FROM vq_video_views WHERE videoId = video.id) AS videoViews,
        (SELECT COUNT(id) FROM content_comments WHERE rootType = 'video' AND rootId = video.id)
        AS numChildComments
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
      if (!feed) return Promise.resolve({})
      let targetId = feed.replyId || feed.commentId
      switch (type) {
        case 'comment':
          return Promise.all([
            poolQuery(likeQuery('comment'), contentId),
            poolQuery(likeQuery('comment'), targetId || '0'),
            poolQuery(likeQuery('video'), rootId)
          ]).then(
            results => {
              feed['contentLikers'] = results[0]
              feed['targetContentLikers'] = results[1]
              feed['rootContentLikers'] = results[2]
              return Promise.resolve(feed)
            }
          )
        case 'url':
          return poolQuery(likeQuery('url'), contentId).then(
            rows => {
              feed['contentLikers'] = rows
              return Promise.resolve(feed)
            }
          )
        case 'discussion':
          feed['contentLikers'] = []
          feed['rootContentLikers'] = []
          return Promise.resolve(feed)
        case 'video':
          return poolQuery(likeQuery('video'), contentId).then(
            rows => {
              feed['contentLikers'] = rows
              return Promise.resolve(feed)
            }
          )
        default:
          return Promise.resolve({})
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
  const query = `INSERT INTO content_comments SET ?`
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
