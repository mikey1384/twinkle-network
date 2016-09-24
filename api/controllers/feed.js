const pool = require('../pool');
const async = require('async');
const express = require('express');
const router = express.Router();
const {requireAuth} = require('../auth');

router.get('/', (req, res) => {
  const feedLength = Number(req.query.feedLength) || 0;
  const limit = feedLength === 0 ? '21' : feedLength + ', 21';
  const query = [
    'SELECT a.id AS contentId, a.userId AS uploaderId, a.content, a.timeStamp, a.videoId AS parentContentId, a.commentId, ', 'b.title AS parentContentTitle, ',
    'c.username AS uploaderName, d.userId AS siblingContentUploaderId, d.content AS siblingContent, ',
    'e.username AS siblingContentUploaderName ',
    'FROM vq_comments a JOIN vq_videos b ON a.videoId = b.id JOIN users c ON a.userId = c.id ',
    'LEFT JOIN vq_comments d ON a.commentId = d.id LEFT JOIN users e ON d.userId = e.id ',
    'ORDER BY a.timeStamp DESC LIMIT ' + limit
  ].join('')
  pool.query(query, (err, feeds) => {
    let taskArray = feeds.reduce(
      (resultingArray, feed) => {
        return resultingArray.concat([attachContentLikersToFeed(feed)])
        function attachContentLikersToFeed(feed) {
          let query = [
            'SELECT a.userId, b.username ',
            'FROM vq_commentupvotes a JOIN users b ON ',
            'a.userId = b.id WHERE ',
            'a.commentId = ?'
          ].join('')
          if (!!feed.commentId) {
            return callback => {
              async.parallel([
                cb => {
                  pool.query(query, feed.contentId, (err, rows) => {
                    cb(err, rows)
                  })
                },
                cb => {
                  pool.query(query, feed.commentId, (err, rows) => {
                    cb(err, rows)
                  })
                }
              ], (err, results) => {
                feed['contentLikers'] = results[0];
                feed['siblingContentLikers'] = results[1];
                callback()
              })
            }
          } else {
            return callback => {
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

module.exports = router;
