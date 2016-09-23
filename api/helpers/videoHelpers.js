const pool = require('../pool');
const async = require('async');

module.exports = {
  returnComments(commentRows, cb) {
    let commentsArray = [];
    let taskArray = [];
    if (commentRows.length === 0) {
      return cb(null, []);
    }
    for (let index = 0; index < commentRows.length; index++) {
      let commentRow = commentRows[index];
      taskArray.push(fetchCommentElements({commentRow, commentsArray, index}));
    }
    async.parallel(taskArray, err => {
      cb(err, commentsArray)
    });
  }
}

const fetchCommentElements = (params) => cb => {
  let commentRow = params.commentRow;
  let commentsArray = params.commentsArray;
  let index = params.index;
  let commentId = commentRow.id;
  async.parallel([
    callback => {
      let query = [
        'SELECT a.id, a.userId, b.username FROM ',
        'vq_commentupvotes a JOIN users b ON ',
        'a.userId = b.id WHERE ',
        'a.commentId = ?'
      ].join('')
      pool.query(query, commentId, (err, rows) => {
        callback(err, rows);
      })
    },
    callback => {
      let query = [
        'SELECT a.id, a.userId, a.content, a.timeStamp, b.username FROM ',
        'vq_comments a JOIN users b ON ',
        'a.userId = b.id WHERE ',
        'a.commentId = ?'
      ].join('')
      pool.query(query, commentId, (err, rows) => {
        returnReplies(rows, (err, repliesArray) => {
          callback(err, repliesArray);
        })
      })
    }
  ], (err, results) => {
    const likes = results[0].map(like => {
      return {
        userId: like.userId,
        username: like.username
      }
    });
    const replies = results[1];
    commentsArray[index] = {
      id: commentId,
      posterId: commentRow.userId,
      posterName: commentRow.username,
      content: commentRow.content,
      timeStamp: commentRow.timeStamp,
      replies,
      likes
    }
    cb(err);
  })
}

function returnReplies(replyRows, cb) {
  let repliesArray = [];
  let taskArray = [];
  if (replyRows.length === 0) {
    return cb(null, []);
  }
  for (let index = 0; index < replyRows.length; index++) {
    let replyRow = replyRows[index];
    taskArray.push(fetchReplyElements({replyRow, repliesArray, index}));
  }
  async.parallel(taskArray, err => {
    cb(err, repliesArray)
  });
}

const fetchReplyElements = (params) => cb => {
  let replyRow = params.replyRow;
  let repliesArray = params.repliesArray;
  let index = params.index;
  let replyId = replyRow.id;
  let query = [
    'SELECT a.userId, b.username ',
    'FROM vq_commentupvotes a JOIN users b ON ',
    'a.userId = b.id WHERE ',
    'a.commentId = ?'
  ].join('')
  pool.query(query, replyId, (err, rows) => {
    repliesArray[index] = {
      id: replyId,
      content: replyRow.content,
      timeStamp: replyRow.timeStamp,
      userId: replyRow.userId,
      username: replyRow.username,
      likes: rows.map(like => {
        return {
          userId: like.userId,
          username: like.username
        }
      })
    }
    cb(err);
  })
}
