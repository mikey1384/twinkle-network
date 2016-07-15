const config = require('../siteConfig');
const mysql = require('mysql');
const pool = mysql.createPool({
  connectionLimit: 100,
  host: 'localhost',
  user: config.mysqlUser,
  password: config.mysqlPassword,
  database: config.mysqlDatabase,
  supportBigNumbers: true,
  bigNumberStrings: true,
  debug: false
})

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
        'SELECT a.id, a.userid, b.username FROM ',
        'vq_commentupvotes a JOIN users b ON ',
        'a.userid = b.id WHERE ',
        'a.commentid = ?'
      ].join('')
      pool.query(query, commentId, (err, rows) => {
        callback(err, rows);
      })
    },
    callback => {
      let query = [
        'SELECT a.id, a.userid, a.content, a.timeposted, b.username FROM ',
        'vq_replies a JOIN users b ON ',
        'a.userid = b.id WHERE ',
        'a.commentid = ?'
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
        userId: like.userid,
        username: like.username
      }
    });
    const replies = results[1];
    commentsArray[index] = {
      id: commentId,
      posterId: commentRow.userid,
      posterName: commentRow.username,
      content: commentRow.content,
      timeStamp: commentRow.timeposted,
      likes,
      replies
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
    'SELECT a.userid, b.username ',
    'FROM vq_replyupvotes a JOIN users b ON ',
    'a.userid = b.id WHERE ',
    'a.replyid = ?'
  ].join('')
  pool.query(query, replyId, (err, rows) => {
    repliesArray[index] = {
      id: replyId,
      content: replyRow.content,
      timeStamp: replyRow.timeposted,
      userId: replyRow.userid,
      username: replyRow.username,
      likes: rows.map(like => {
        return {
          userId: like.userid,
          username: like.username
        }
      })
    }
    cb(err);
  })
}
