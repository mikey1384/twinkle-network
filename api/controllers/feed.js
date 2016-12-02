const pool = require('../pool');
const async = require('async');
const express = require('express');
const router = express.Router();
const {requireAuth} = require('../auth');
const {
  processedString,
  processedTitleString,
  fetchedVideoCodeFromURL,
  processedURL,
  stringIsEmpty
} = require('../helpers/stringHelpers');
const {returnComments} = require('../helpers/videoHelpers');

router.get('/', (req, res) => {
  const feedId = Number(req.query.lastFeedId) || 0;
  let where = 'WHERE a.timeStamp IS NOT NULL ';
  if(feedId !== 0) where += 'AND a.id < ' + feedId + ' ';
  const query = [
    'SELECT a.id, a.type, a.contentId, a.parentContentId, a.uploaderId, a.timeStamp, b.content, ',
    'b.commentId, b.replyId, c.title AS contentTitle, NULL AS contentDescription, c.videoCode AS videoCode, ',
    'd.username AS uploaderName, e.userId AS targetCommentUploaderId, e.content AS targetComment, ',
    'f.username AS targetCommentUploaderName, ',
    'g.userId AS targetReplyUploaderId, g.content AS targetReply, h.username AS targetReplyUploaderName, ',
    'NULL AS videoViews, ',
    '(SELECT COUNT(*) FROM vq_comments WHERE commentId = a.contentId) AS numChildComments, ',
    '(SELECT COUNT(*) FROM vq_comments WHERE replyId = a.contentId) AS numChildReplies ',

    'FROM noti_feeds a JOIN vq_comments b ON a.type = \'comment\' AND a.contentId = b.id LEFT JOIN vq_videos c ',
    'ON a.parentContentId = c.id LEFT JOIN users d ON a.uploaderId = d.id LEFT JOIN vq_comments e ON ',
    'b.commentId = e.id LEFT JOIN users f ON e.userId = f.id LEFT JOIN vq_comments g ON b.replyId = g.id ',
    'LEFT JOIN users h ON g.userId = h.id ',
    where,

    'UNION SELECT a.id, a.type, a.contentId, a.parentContentId, a.uploaderId, a.timeStamp, b.videoCode AS ', 'content, NULL AS commentId, NULL AS replyId, b.title AS contentTitle, b.description AS contentDescription, ',
    'b.videoCode AS videoCode, c.username AS uploaderName, NULL AS targetCommentUploaderId, NULL AS targetComment, ',
    'NULL AS targetCommentUploaderName, NULL AS targetReplyUploaderId, NULL AS targetReply, ',
    'NULL AS targetReplyUploaderName, ',
    '(SELECT COUNT(*) FROM vq_video_views WHERE videoId = a.contentId) AS videoViews, ',
    '(SELECT COUNT(*) FROM vq_comments WHERE videoId = a.contentId) AS numChildComments, ',
    'NULL AS numChildReplies ',

    'FROM noti_feeds a JOIN vq_videos b ON a.type = \'video\' AND a.contentId = b.id ',
    'LEFT JOIN users c ON b.uploader = c.id ',
    where,

    'UNION SELECT a.id, a.type, a.contentId, a.parentContentId, a.uploaderId, a.timeStamp, b.url AS content, ',
    'NULL AS commentId, NULL AS replyId, b.title AS contentTitle, NULL AS contentDescription, NULL AS videoCode, ', 'c.username AS uploaderName, NULL AS targetCommentUploaderId, NULL AS targetComment, ',
    'NULL AS targetCommentUploaderName, NULL AS targetReplyUploaderId, NULL AS targetReply, ',
    'NULL AS targetReplyUploaderName, ',
    'NULL AS videoViews, NULL AS numChildComments, NULL AS numChildReplies ',

    'FROM noti_feeds a JOIN content_urls b ON a.type = \'url\' AND a.contentId = b.id ',
    'LEFT JOIN users c ON b.uploader = c.id ',
    where,
    
    'ORDER BY id DESC LIMIT 21'
  ].join('');

  pool.query(query, (err, feeds) => {
    if (err) {
      console.error(err);
      res.status(500).send({error: err});
      return;
    }
    let taskArray = feeds.reduce(
      (resultingArray, feed) => {
        feed['commentsShown'] = false;
        feed['childComments'] = [];
        feed['commentsLoadMoreButton'] = false;
        feed['isReply'] = false;
        return resultingArray.concat([finalizeFeed(feed)])
        function finalizeFeed(feed) {
          let commentQuery = [
            'SELECT a.userId, b.username ',
            'FROM vq_commentupvotes a LEFT JOIN users b ON ',
            'a.userId = b.id WHERE ',
            'a.commentId = ?'
          ].join('');
          let videoQuery = [
            'SELECT a.userId, b.username ',
            'FROM vq_video_likes a LEFT JOIN users b ON ',
            'a.userId = b.id WHERE ',
            'a.videoId = ?'
          ].join('');
          let targetId = feed.replyId ? feed.replyId : feed.commentId;
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
                feed['contentLikers'] = results[0];
                feed['targetContentLikers'] = results[1];
                feed['parentContentLikers'] = results[2];
                callback()
              })
            }
          } else {
            return callback => {
              if (feed.type === 'url') {
                feed['contentLikers'] = [];
                feed['parentContentLikers'] = [];
                return callback();
              }
              pool.query(videoQuery, feed.contentId, (err, rows) => {
                feed['contentLikers'] = rows;
                callback();
              })
            }
          }
        }
      }, []
    )
    async.parallel(taskArray, err => {
      if (err) {
        console.error(err);
        res.status(500).send({error: err});
        return;
      }
      res.send(feeds);
    })
  })
})

router.get('/category', (req, res) => {
  const {searchText} = req.query;
  async.waterfall([
    callback => {
      pool.query('SELECT COUNT(*) AS numCategories FROM content_categories', (err, rows) => {
        const numCategories = Number(rows[0].numCategories);
        let result = [];
        if (searchText === 'undefined' && numCategories > 7) {
          return callback(err, [])
        }
        callback(err)
      })
    },
    callback => {
      const where = searchText !== 'undefined' ? ' WHERE label LIKE ?' : '';
      pool.query('SELECT id, label FROM content_categories' + where, '%' + searchText + '%', (err, rows) => {
        callback(err, rows)
      })
    }
  ], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send({error: err});
      return;
    }
    res.send(result)
  })
})

router.get('/comments', (req, res) => {
  const {type, contentId, lastCommentId, isReply} = req.query;
  const limit = 4;
  let where = type === 'video' ? 'videoId = ? AND a.commentId IS NULL' : (isReply === 'true' ? 'replyId = ?' : 'commentId = ?');
  if (!!lastCommentId && lastCommentId !== '0') where += ' AND a.id < ' + lastCommentId;
  const query = [
    'SELECT a.id, a.userId, a.content, a.timeStamp, a.videoId, a.commentId, a.replyId, b.username, ',
    'c.userId AS targetUserId, d.username AS targetUserName FROM vq_comments a JOIN users b ON ',
    'a.userId = b.id LEFT JOIN vq_comments c ON a.replyId = c.id ',
    'LEFT JOIN users d ON c.userId = d.id ',
    'WHERE a.'+ where +' ORDER BY a.id DESC LIMIT ' + limit
  ].join('');
  pool.query(query, contentId, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).send({error: err});
    }
    if (rows.length === 0) {
      return res.send([])
    }
    returnComments(rows, (err, commentsArray) => {
      if (err) {
        console.error(err);
        return res.status(500).send({error: err})
      }
      res.send(commentsArray)
    })
  })
})

router.post('/content', requireAuth, (req, res) => {
  const {user} = req;
  const {url, title, description, categoryId, checkedVideo} = req.body.params;
  const type = !!checkedVideo ? 'video' : 'url';
  const query = !!checkedVideo ?
  'INSERT INTO vq_videos SET ?' :
  'INSERT INTO content_urls SET ?';
  const content = !!checkedVideo ? fetchedVideoCodeFromURL(url) : processedURL(url);
  const post = Object.assign({},
    {title: processedTitleString(title), description: (!description || description === '') ?
    "No description" : processedString(description), uploader: user.id, timeStamp: Math.floor(Date.now()/1000), categoryId},
    (!!checkedVideo ? {videocode: content} : {url: content})
  )
  pool.query(query, post, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({error: err});
    }

    res.send({
      type,
      contentId: result.insertId,
      uploaderId: user.id,
      content,
      timeStamp: post.timeStamp,
      parentContentId: result.insertId,
      commentId: null,
      replyId: null,
      contentTitle: post.title,
      contentDescription: post.description,
      uploaderName: user.username,
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

module.exports = router;
