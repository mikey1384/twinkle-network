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

router.get('/', (req, res) => {
  const feedId = Number(req.query.lastFeedId) || 0
  const filter = req.query.filter
  let where = 'WHERE feed.timeStamp IS NOT NULL '
  if (feedId !== 0) where += 'AND feed.id < ' + feedId + ' '
  if (filter !== 'undefined' && filter !== 'all') where += 'AND feed.type = "' + filter + '" '
  const query = `
    SELECT
      feed.id AS id,
      feed.type AS type,
      feed.contentId AS contentId,
      feed.parentContentId AS parentContentId,
      video.title AS parentContentTitle,
      video.description AS parentContentDescription,
      feed.uploaderId AS uploaderId,
      user1.username AS uploaderName,
      userPhoto.id AS uploaderPicId,
      feed.timeStamp AS timeStamp,
      comment1.content AS content,
      video.title AS contentTitle,
      NULL AS contentDescription,
      video.videoCode AS videoCode,
      comment1.commentId AS commentId,
      comment1.replyId AS replyId,
      comment2.userId AS targetCommentUploaderId,
      comment2.content AS targetComment,
      user2.username AS targetCommentUploaderName,
      comment3.userId AS targetReplyUploaderId,
      comment3.content AS targetReply,
      user3.username AS targetReplyUploaderName,
      comment1.discussionId AS discussionId,
      discussion.title AS discussionTitle,
      discussion.description AS discussionDescription,
      NULL AS videoViews,
      (SELECT COUNT(*) FROM vq_comments WHERE commentId = feed.contentId) AS numChildComments,
      (SELECT COUNT(*) FROM vq_comments WHERE replyId = feed.contentId) AS numChildReplies

    FROM noti_feeds feed
    JOIN vq_comments comment1
      ON feed.type = 'comment' AND feed.contentId = comment1.id
    LEFT JOIN vq_videos video
      ON feed.parentContentId = video.id
    LEFT JOIN users user1
      ON feed.uploaderId = user1.id
    LEFT JOIN users_photos userPhoto
      ON feed.uploaderId = userPhoto.userId AND userPhoto.isProfilePic = '1'
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
    ${where}

    UNION SELECT
      feed.id AS id,
      feed.type AS type,
      feed.contentId AS contentId,
      feed.parentContentId AS parentContentId,
      video.title AS parentContentTitle,
      video.description AS parentContentDescription,
      feed.uploaderId AS uploaderId,
      user.username AS uploaderName,
      userPhoto.id AS uploaderPicId,
      feed.timeStamp AS timeStamp,
      video.videoCode AS content,
      video.title AS contentTitle,
      video.description AS contentDescription,
      video.videoCode AS videoCode,
      NULL AS commentId,
      NULL AS replyId,
      NULL AS targetCommentUploaderId,
      NULL AS targetComment,
      NULL AS targetCommentUploaderName,
      NULL AS targetReplyUploaderId,
      NULL AS targetReply,
      NULL AS targetReplyUploaderName,
      NULL AS discussionId,
      NULL AS discussionTitle,
      NULL AS discussionDescription,
      (SELECT COUNT(*) FROM vq_video_views WHERE videoId = feed.contentId) AS videoViews,
      (SELECT COUNT(*) FROM vq_comments WHERE videoId = feed.contentId) AS numChildComments,
      NULL AS numChildReplies

    FROM noti_feeds feed
    JOIN vq_videos video
      ON feed.type = 'video' AND feed.contentId = video.id
    LEFT JOIN users user
      ON video.uploader = user.id
    LEFT JOIN users_photos userPhoto
      ON feed.uploaderId = userPhoto.userId AND userPhoto.isProfilePic = '1'
    ${where}

    UNION SELECT
      feed.id AS id,
      feed.type AS type,
      feed.contentId AS contentId,
      feed.parentContentId AS parentContentId,
      url.title AS parentContentTitle,
      url.description AS parentContentDescription,
      feed.uploaderId AS uploaderId,
      user.username AS uploaderName,
      userPhoto.id AS uploaderPicId,
      feed.timeStamp AS timeStamp,
      url.url AS content,
      url.title AS contentTitle,
      NULL AS contentDescription,
      NULL AS videoCode,
      NULL AS commentId,
      NULL AS replyId,
      NULL AS targetCommentUploaderId,
      NULL AS targetComment,
      NULL AS targetCommentUploaderName,
      NULL AS targetReplyUploaderId,
      NULL AS targetReply,
      NULL AS targetReplyUploaderName,
      NULL AS discussionId,
      NULL AS discussionTitle,
      NULL AS discussionDescription,
      NULL AS videoViews,
      NULL AS numChildComments,
      NULL AS numChildReplies

    FROM noti_feeds feed
    JOIN content_urls url
      ON feed.type = 'url' AND feed.contentId = url.id
    LEFT JOIN users user
      ON url.uploader = user.id
    LEFT JOIN users_photos userPhoto
      ON feed.uploaderId = userPhoto.userId AND userPhoto.isProfilePic = '1'
    ${where}

    UNION SELECT
      feed.id AS id,
      feed.type AS type,
      feed.contentId AS contentId,
      feed.parentContentId AS parentContentId,
      video.title AS parentContentTitle,
      video.description AS parentContentDescription,
      feed.uploaderId AS uploaderId,
      user.username AS uploaderName,
      userPhoto.id AS uploaderPicId,
      feed.timeStamp AS timeStamp,
      NULL AS content,
      discussion.title AS contentTitle,
      discussion.description AS contentDescription,
      video.videoCode AS videoCode,
      NULL AS commentId,
      NULL AS replyId,
      NULL AS targetCommentUploaderId,
      NULL AS targetComment,
      NULL AS targetCommentUploaderName,
      NULL AS targetReplyUploaderId,
      NULL AS targetReply,
      NULL AS targetReplyUploaderName,
      NULL AS discussionId,
      NULL AS discussionTitle,
      NULL AS discussionDescription,
      NULL AS videoViews,
      (SELECT COUNT(*) FROM vq_comments WHERE discussionId = discussion.id) AS numChildComments,
      NULL AS numChildReplies

    FROM noti_feeds feed
    JOIN content_discussions discussion
      ON feed.type = 'discussion' AND feed.contentId =
    discussion.id
    LEFT JOIN vq_videos video
      ON discussion.refContentType = 'video' AND refContentId = video.id
    LEFT JOIN users user
      ON discussion.userId = user.id
    LEFT JOIN users_photos userPhoto
      ON feed.uploaderId = userPhoto.userId AND userPhoto.isProfilePic = '1'
    ${where}

    ORDER BY id DESC LIMIT 21
  `

  pool.query(query, (err, feeds) => {
    if (err) {
      console.error(err)
      res.status(500).send({error: err})
      return
    }
    let taskArray = feeds.reduce(
      (resultingArray, feed) => {
        feed['commentsShown'] = false
        feed['childComments'] = []
        feed['commentsLoadMoreButton'] = false
        feed['isReply'] = false
        return resultingArray.concat([finalizeFeed(feed)])
        function finalizeFeed(feed) {
          let commentQuery = [
            'SELECT a.userId, b.username ',
            'FROM vq_commentupvotes a LEFT JOIN users b ON ',
            'a.userId = b.id WHERE ',
            'a.commentId = ?'
          ].join('')
          let videoQuery = [
            'SELECT a.userId, b.username ',
            'FROM vq_video_likes a LEFT JOIN users b ON ',
            'a.userId = b.id WHERE ',
            'a.videoId = ?'
          ].join('')
          let targetId = feed.replyId ? feed.replyId : feed.commentId
          if (feed.type === 'comment') {
            return callback => {
              async.parallel([
                cb => {
                  pool.query(commentQuery, feed.contentId, (err, rows) => {
                    cb(err, rows)
                  })
                },
                cb => {
                  pool.query(commentQuery, targetId || '0', (err, rows) => {
                    cb(err, rows)
                  })
                },
                cb => {
                  pool.query(videoQuery, feed.parentContentId, (err, rows) => {
                    cb(err, rows)
                  })
                }
              ], (err, results) => {
                feed['contentLikers'] = results[0]
                feed['targetContentLikers'] = results[1]
                feed['parentContentLikers'] = results[2]
                callback(err)
              })
            }
          } else {
            return callback => {
              if (feed.type === 'url' || feed.type === 'discussion') {
                feed['contentLikers'] = []
                feed['parentContentLikers'] = []
                return callback()
              }
              pool.query(videoQuery, feed.contentId, (err, rows) => {
                feed['contentLikers'] = rows
                callback(err)
              })
            }
          }
        }
      }, []
    )
    async.parallel(taskArray, err => {
      if (err) {
        console.error(err)
        res.status(500).send({error: err})
        return
      }
      res.send(feeds)
    })
  })
})

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
