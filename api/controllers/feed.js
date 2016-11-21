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
  const feedLength = Number(req.query.feedLength) || 0;
  const limit = feedLength === 0 ? '21' : feedLength + ', 21';
  const query = [
    'SELECT \'comment\' AS type, a.id AS contentId, a.userId AS uploaderId, a.content, a.timeStamp, ',
    'a.videoId AS parentContentId, a.commentId, a.replyId, b.title AS contentTitle, ',
    'c.username AS uploaderName, d.userId AS targetCommentUploaderId, d.content AS targetComment, ',
    'e.username AS targetCommentUploaderName, f.userId AS targetReplyUploaderId, f.content AS targetReply, ',
    'g.username AS targetReplyUploaderName, NULL AS videoViews, ',
    '(SELECT COUNT(*) FROM vq_comments WHERE commentId = contentId) AS numChildComments, ',
    '(SELECT COUNT(*) FROM vq_comments WHERE replyId = contentId) AS numChildReplies ',

    'FROM vq_comments a JOIN vq_videos b ON a.videoId = b.id LEFT JOIN users c ON a.userId = c.id ',
    'LEFT JOIN vq_comments d ON a.commentId = d.id LEFT JOIN users e ON d.userId = e.id ',
    'LEFT JOIN vq_comments f ON a.replyId = f.id LEFT JOIN users g ON f.userId = g.id ',

    'UNION SELECT \'video\' AS type, a.id AS contentId, a.uploader AS uploaderId, a.videoCode AS content, ', 'a.timeStamp, a.id AS parentContentId, NULL AS commentId, NULL AS replyId, ',
    'a.title AS contentTitle ,',
    'b.username AS uploaderName, NULL AS targetCommentUploaderId, NULL AS targetComment, ',
    'NULL AS targetCommentUploaderName, NULL AS targetReplyUploaderId, NULL AS targetReply, ',
    'NULL AS targetReplyUploaderName, ',
    '(SELECT COUNT(*) FROM vq_video_views WHERE videoId = contentId) AS videoViews, ',
    '(SELECT COUNT(*) FROM vq_comments WHERE videoId = contentId) AS numChildComments, ',
    'NULL AS numChildReplies ',

    'FROM vq_videos a LEFT JOIN users b ON a.uploader = b.id ',

    'UNION SELECT \'url\' AS type, a.id AS contentId, a.uploader AS uploaderId, a.url AS content, ',
    'a.timeStamp, a.id AS parentContentId, NULL AS commentId, NULL AS replyId, ',
    'a.title AS contentTitle ,',
    'b.username AS uploaderName, NULL AS targetCommentUploaderId, NULL AS targetComment, ',
    'NULL AS targetCommentUploaderName, NULL AS targetReplyUploaderId, NULL AS targetReply, ',
    'NULL AS targetReplyUploaderName, ',
    'NULL AS videoViews, NULL AS numChildComments, NULL AS numChildReplies ',

    'FROM content_urls a LEFT JOIN users b ON a.uploader = b.id ',

    'WHERE timeStamp IS NOT NULL ORDER BY timeStamp DESC LIMIT ' + limit
  ].join('')
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
          let query = feed.type === 'comment' ? [
            'SELECT a.userId, b.username ',
            'FROM vq_commentupvotes a LEFT JOIN users b ON ',
            'a.userId = b.id WHERE ',
            'a.commentId = ?'
          ].join('') : [
            'SELECT a.userId, b.username ',
            'FROM vq_video_likes a LEFT JOIN users b ON ',
            'a.userId = b.id WHERE ',
            'a.videoId = ?'
          ].join('')
          let targetId = feed.replyId ? feed.replyId : feed.commentId;
          if (feed.type === 'comment' && !!targetId) {
            return callback => {
              async.parallel([
                cb => {
                  pool.query(query, feed.contentId, (err, rows) => {
                    cb(err, rows)
                  })
                },
                cb => {
                  pool.query(query, targetId, (err, rows) => {
                    cb(err, rows)
                  })
                }
              ], (err, results) => {
                feed['contentLikers'] = results[0];
                feed['targetContentLikers'] = results[1];
                callback()
              })
            }
          } else {
            return callback => {
              if (feed.type === 'url') {
                feed['contentLikers'] = [];
                return callback();
              }
              pool.query(query, feed.contentId, (err, rows) => {
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
