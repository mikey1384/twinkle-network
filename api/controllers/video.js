const pool = require('../pool');

const requireAuth = require('../auth').requireAuth;
const processedString = require('../helpers/StringHelper').processedString;
const processedTitleString = require('../helpers/StringHelper').processedTitleString;
const fetchedVideoCodeFromURL = require('../helpers/StringHelper').fetchedVideoCodeFromURL;
const stringIsEmpty = require('../helpers/StringHelper').stringIsEmpty;
const returnComments = require('../helpers/VideoHelper').returnComments;

const async = require('async');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const videoId = req.query.videoId || 0;
  const numberToLoad = parseInt(req.query.numberToLoad) + 1 || 13;
  const where = videoId === 0 ? '' : 'WHERE a.id < ? ';
  const query = [
    'SELECT a.id, a.title, a.description, a.videocode, a.uploader AS uploaderid, b.username AS uploadername, ',
    'COUNT(c.id) AS numLikes ',
    'FROM vq_videos a JOIN users b ON a.uploader = b.id ',
    'LEFT JOIN vq_video_likes c ON a.id = c.videoId ',
    where,
    'GROUP BY a.id ',
    'ORDER BY a.id DESC LIMIT ' + numberToLoad
  ].join('');
  pool.query(query, videoId, (err, rows) => {
    if (err) {
      console.error(err)
      return res.status(500).send({error: err})
    }
    res.json(rows);
  });
});

router.post('/', requireAuth, (req, res) => {
  const user = req.user;
  const rawDescription = (!req.body.description || req.body.description === '') ?
  "No description" : req.body.description;
  const title = processedTitleString(req.body.title);
  const description = processedString(rawDescription);
  const videocode = fetchedVideoCodeFromURL(req.body.url);

  const uploaderid = user.id;
  const uploadername = user.username;
  const post = {title, description, videocode, uploader: uploaderid};
  pool.query('INSERT INTO vq_videos SET?', post, (err, row) => {
    let result = {id: row.insertId, title, description, videocode, uploaderid, uploadername, numLikes: 0};
    if (err) {
      console.error(err);
      return res.status(500).send({error: err});
    }
    res.json({result});
  })
});

router.delete('/', requireAuth, (req, res) => {
  const user = req.user;
  const videoId = typeof req.query.videoId !== 'undefined' ? req.query.videoId : 0;
  const lastVideoId = typeof req.query.lastVideoId !== 'undefined' ? req.query.lastVideoId : 0;

  async.parallel([
    (callback) => {
      pool.query('DELETE FROM vq_videos WHERE id = ? AND uploader = ?', [videoId, user.id], (err) => {
        callback(err);
      })
    },
    (callback) => {
      const query = [
        'SELECT a.id, a.title, a.description, a.videocode, a.uploader AS uploaderid, b.username AS uploadername ',
        'FROM vq_videos a JOIN users b ON a.uploader = b.id ',
        'WHERE a.id < ? ',
        'ORDER BY a.id DESC LIMIT 1'
      ].join('');
      pool.query(query, lastVideoId, (err, rows) => {
        callback(err, rows);
      })
    }
  ], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send({error: err});
    }
    res.json({result: results[1]});
  });
})

router.post('/edit/title', requireAuth, (req, res) => {
  const user = req.user;
  const title = req.body.title;
  const videoId = req.body.videoId;
  const newTitle = processedTitleString(title);
  const post = { title: newTitle };

  const userId = user.id;
  pool.query('UPDATE vq_videos SET? WHERE id = ? AND uploader = ?', [post, videoId, userId], err => {
    if (err) {
      console.error(err);
      return res.status(500).send({error: err});
    }
    res.send({result: newTitle});
  })
})

router.post('/like', requireAuth, (req, res) => {
  const user = req.user;
  const videoId = req.body.videoId;
  async.waterfall([
    (callback) => {
      const userId = user.id;
      pool.query('SELECT * FROM vq_video_likes WHERE videoId = ? AND userId = ?', [videoId, userId], (err, rows) => {
        callback(err, rows, userId);
      })
    },
    (rows, userId, callback) => {
      if (rows.length > 0) {
        pool.query('DELETE FROM vq_video_likes WHERE videoId = ? AND userId = ?', [videoId, userId], err => {
          callback(err);
        })
      }
      else {
        pool.query('INSERT INTO vq_video_likes SET ?', {videoId, userId}, err => {
          callback(err);
        })
      }
    },
    (callback) => {
      let query = [
        'SELECT a.userId, b.username ',
        'FROM vq_video_likes a JOIN users b ON a.userId = b.id ',
        'WHERE a.videoId = ?'
      ].join('');
      pool.query(query, videoId, (err, rows) => {
        callback(err, rows)
      })
    }
  ], (err, rows) => {
    if (err) {
      console.error(err);
      return res.json({error: err});
    }
    let likes = rows.map(row => {
      return {
        userId: row.userId,
        username: row.username
      }
    })
    res.json({likes})
  });
})

router.post('/edit/page', requireAuth, (req, res) => {
  const user = req.user;
  let videoId = req.body.videoId;
  let title = req.body.title;
  let description = req.body.description;
  if (stringIsEmpty(title)) {
    return res.status(500).send({error: "Title is empty"});
  }
  if (description === '') description = 'No description';
  const post = {title, description: processedString(description)};
  const userId = user.id;
  pool.query('UPDATE vq_videos SET ? WHERE id = ? AND uploader = ?', [post, videoId, userId], err => {
    if (err) {
      console.error(err);
      return res.status(500).json({error: err});
    }
    res.json({success: true});
  })
})

router.get('/loadPage', (req, res) => {
  const videoId = req.query.videoId;
  let query = [
    'SELECT a.id AS videoId, a.title, a.description, a.videocode, a.uploader AS uploaderId, b.username AS uploaderName ',
    'FROM vq_videos a JOIN users b ON a.uploader = b.id ',
    'WHERE a.id = ?'
  ].join('');
  pool.query(query, videoId, (err, rows) => {
    if (err) {
      return res.status(500).send({error: err});
    }
    if (rows[0]) {
      const videoId = rows[0].videoId;
      const title = rows[0].title;
      const description = rows[0].description;
      const videocode = rows[0].videocode;
      const uploaderId = rows[0].uploaderId;
      const uploaderName = rows[0].uploaderName;
      async.parallel([
        (callback) => {
          pool.query('SELECT * FROM vq_questions WHERE videoid = ? AND isdraft = 0', videoId, (err, rows) => {
            let questions = [];
            if (rows) {
              questions = rows.map(row => {
                return {
                  title: row.questiontitle,
                  choices: [
                    row.choice1,
                    row.choice2,
                    row.choice3,
                    row.choice4,
                    row.choice5
                  ],
                  correctChoice: row.correctchoice
                }
              })
            }
            callback(err, questions);
          })
        },
        (callback) => {
          let likes = [];
          let query = [
            'SELECT a.userId, b.username ',
            'FROM vq_video_likes a JOIN users b ON a.userId = b.id ',
            'WHERE a.videoId = ?'
          ].join('');
          pool.query(query, videoId, (err, rows) => {
            likes = rows.map(row => {
              return {
                userId: row.userId,
                username: row.username
              }
            })
            callback(err, likes);
          })
        }
      ], (err, results) => {
        if (err) return res.status(500).send({error: err});
        res.send({
          videoId,
          title,
          description,
          videocode,
          uploaderId,
          uploaderName,
          questions: results[0],
          likes: results[1]
        })
      });
    } else {
      res.status(500).send({error: 'Video doesn\'t exist'})
    }
  })
})

router.get('/comments', (req, res) => {
  const videoId = req.query.videoId;
  const query = [
    'SELECT a.id, a.userid, a.content, a.timeposted, b.username ',
    'FROM vq_comments a JOIN users b ON a.userid = b.id ',
    'WHERE videoid = ? ORDER BY a.id DESC'
  ].join('');
  pool.query(query, videoId, (err, rows) => {
    if (err) {
      return res.status(500).send({error: err});
    }
    if (rows.length === 0) {
      return res.send({
        noComments: true
      })
    }
    returnComments(rows, (err, commentsArray) => {
      if (err) {
        console.error(err);
        return res.status(500).send({error: err})
      }
      res.send({
        comments: commentsArray,
        noComments: false
      })
    })
  })
})

router.post('/comments', requireAuth, (req, res) => {
  const user = req.user;
  const videoId = req.body.videoId;
  const comment = req.body.comment;
  async.waterfall([
    (callback) => {
      const userId = user.id;
      const post = {
        userid: userId,
        content: processedString(comment),
        timeposted: Math.floor(Date.now()/1000),
        videoid: videoId
      }
      pool.query('INSERT INTO vq_comments SET ?', post, (err) => {
        callback(err)
      })
    },
    (callback) => {
      const query = [
        'SELECT a.id, a.userid, a.content, a.timeposted, b.username ',
        'FROM vq_comments a JOIN users b ON a.userid = b.id ',
        'WHERE videoid = ? ORDER BY a.id DESC'
      ].join('');
      pool.query(query, videoId, (err, rows) => {
        callback(err, rows)
      })
    },
    (rows, callback) => {
      if (rows.length === 0) {
        return res.send({
          noComments: true
        })
      }
      callback(null, rows);
    },
    (rows, callback) => {
      returnComments(rows, (err, commentsArray) => {
        callback(err, commentsArray)
      })
    }
  ], (err, comments) => {
    if (err) {
      console.error(err);
      return res.status(500).send({error: err})
    }
    res.send({
      comments,
      noComments: false
    })
  })
})

router.post('/comments/edit', requireAuth, (req, res) => {
  const user = req.user;
  const content = processedString(req.body.editedComment);
  const commentId = req.body.commentId;
  const userId = user.id;
  pool.query('UPDATE vq_comments SET ? WHERE id = ? AND userid = ?', [{content}, commentId, userId], err => {
    if (err) {
      console.error(err);
      return res.status(500).send({error: err});
    }
    res.send({success: true})
  })
})

router.delete('/comments', requireAuth, (req, res) => {
  const user = req.user;
  const commentId = req.query.commentId;
  pool.query('DELETE FROM vq_comments WHERE id = ? AND userid = ?', [commentId, user.id], err => {
    if (err) {
      console.error(err);
      return res.status(500).send({error: err});
    }
    res.send({success: true})
  })
})

router.post('/comments/like', requireAuth, (req, res) => {
  const user = req.user;
  const commentId = req.body.commentId;
  async.waterfall([
    (callback) => {
      const query = 'SELECT * FROM vq_commentupvotes WHERE commentid = ? AND userid = ?';
      pool.query(query, [commentId, user.id], (err, rows) => {
        callback(err, user.id, rows);
      })
    },
    (userId, rows, callback) => {
      if (rows.length > 0) {
        let query = 'DELETE FROM vq_commentupvotes WHERE commentid = ? AND userid = ?';
        pool.query(query, [commentId, userId], err => {
          callback(err);
        })
      } else {
        let query = 'INSERT INTO vq_commentupvotes SET ?';
        pool.query(query, {commentid: commentId, userid: userId}, err => {
          callback(err);
        })
      }
    },
    (callback) => {
      let query = [
        'SELECT a.id, a.userid, b.username FROM ',
        'vq_commentupvotes a JOIN users b ON ',
        'a.userid = b.id WHERE ',
        'a.commentid = ?'
      ].join('')
      pool.query(query, commentId, (err, rows) => {
        callback(err, rows);
      })
    }
  ], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).send({error: err});
    }
    res.send({
      likes: rows.map(row => {
        return {
          userId: row.userid,
          username: row.username
        }
      })
    });
  })
})

router.post('/replies', requireAuth, (req, res) => {
  const user = req.user;
  const commentId = req.body.commentId;
  const videoId = req.body.videoId;
  const reply = req.body.reply;
  const processedReply = processedString(reply);
  async.waterfall([
    (callback) => {
      const post = {
        userid: user.id,
        content: processedReply,
        timeposted: Math.floor(Date.now()/1000),
        commentid: commentId,
        videoid: videoId
      }
      pool.query('INSERT INTO vq_replies SET ?', post, (err, result) => {
        callback(err, result.insertId)
      })
    },
    (replyId, callback) => {
      let query = [
        'SELECT a.id, a.content, a.timeposted, a.userid, b.username FROM ',
        'vq_replies a JOIN users b ON a.userid = b.id WHERE ',
        'a.id = ?'
      ].join('')
      pool.query(query, replyId, (err, rows) => {
        callback(err, rows)
      })
    }
  ], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).send({error: err});
    }
    res.send({
      result: {
        id: rows[0].id,
        content: rows[0].content,
        timeStamp: rows[0].timeposted,
        userId: rows[0].userid,
        username: rows[0].username,
        likes: []
      }
    })
  })
})

router.post('/replies/edit', requireAuth, (req, res) => {
  const user = req.user;
  const content = processedString(req.body.editedReply);
  const replyId = req.body.replyId;

  pool.query('UPDATE vq_replies SET ? WHERE id = ? AND userid = ?', [{content}, replyId, user.id], err => {
    if (err) {
      console.error(err);
      return res.status(500).send({error: err});
    }
    res.send({success: true})
  })
})

router.delete('/replies', requireAuth, (req, res) => {
  const user = req.user;
  const replyId = req.query.replyId || 0;
  pool.query('DELETE FROM vq_replies WHERE id = ? AND userid = ?', [replyId, user.id], err => {
    if (err) {
      console.error(err);
      return res.status(500).send({error: err});
    }
    res.send({success: true})
  })
})

router.post('/replies/like', requireAuth, (req, res) => {
  const user = req.user;
  const replyId = req.body.replyId;
  const commentId = req.body.commentId;

  async.waterfall([
    (callback) => {
      const query = 'SELECT * FROM vq_replyupvotes WHERE replyid = ? AND userid = ?';
      pool.query(query, [replyId, user.id], (err, rows) => {
        callback(err, rows);
      })
    },
    (rows, callback) => {
      if (rows.length > 0) {
        let query = 'DELETE FROM vq_replyupvotes WHERE replyid = ? AND userid = ?';
        pool.query(query, [replyId, user.id], err => {
          callback(err);
        })
      } else {
        let query = 'INSERT INTO vq_replyupvotes SET ?';
        pool.query(query, {replyid: replyId, commentid: commentId, userid: user.id}, err => {
          callback(err);
        })
      }
    },
    (callback) => {
      let query = [
        'SELECT a.id, a.userid, b.username FROM ',
        'vq_replyupvotes a JOIN users b ON ',
        'a.userid = b.id WHERE ',
        'a.replyid = ?'
      ].join('')
      pool.query(query, replyId, (err, rows) => {
        callback(err, rows)
      })
    }
  ], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).send({error: err});
    }
    res.send({
      likes: rows.map(row => {
        return {
          userId: row.userid,
          username: row.username
        }
      })
    });
  })
})

router.post('/questions', requireAuth, (req, res) => {
  const user = req.user;
  const videoId = req.body.videoId;
  const questions = req.body.questions;
  async.waterfall([
    (callback) => {
      const userId = user.id;
      pool.query('DELETE FROM vq_questions WHERE videoid = ? AND createdby = ?', [videoId, userId], err => {
        callback(err, userId)
      })
    },
    (userId, callback) => {
      let taskArray = [];
      for (let i = 0; i < questions.length; i++) {
        taskArray.push(callback => {
          pool.query('INSERT INTO vq_questions SET ?', questions[i], err => {
            callback(err)
          })
        })
      }
      async.series(taskArray, (err, results) => {
        callback(err, true)
      })
    }
  ], (err, success) => {
    if (err) {
      console.error(err);
      return res.status(500).json({error: err});
    }
    res.json({success});
  });
})

module.exports = router;
