const pool = require('../pool');

const {requireAuth} = require('../auth');
const {
  processedString,
  processedTitleString,
  fetchedVideoCodeFromURL,
  stringIsEmpty
} = require('../helpers/stringHelpers');
const {returnComments} = require('../helpers/videoHelpers');

const async = require('async');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const videoId = Number(req.query.videoId) || 0;
  const numberToLoad = Number(req.query.numberToLoad) + 1 || 13;
  const where = videoId === 0 ? '' : 'WHERE a.id < ? ';
  const query = [
    'SELECT a.id, a.title, a.description, a.videoCode, a.uploader AS uploaderId, b.username AS uploaderName, ',
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
  const videoCode = fetchedVideoCodeFromURL(req.body.url);

  const uploaderId = user.id;
  const uploaderName = user.username;
  const post = {title, description, videoCode, uploader: uploaderId};
  pool.query('INSERT INTO vq_videos SET?', post, (err, row) => {
    let result = {id: row.insertId, title, description, videoCode, uploaderId, uploaderName, numLikes: 0};
    if (err) {
      console.error(err);
      return res.status(500).send({error: err});
    }
    res.json({result});
  })
});

router.delete('/', requireAuth, (req, res) => {
  const user = req.user;
  const videoId = req.query.videoId != 'undefined' ? Number(req.query.videoId) : 0;
  const lastVideoId = req.query.lastVideoId != 'undefined' ? Number(req.query.lastVideoId) : 0;

  async.parallel([
    (callback) => {
      pool.query('DELETE FROM vq_videos WHERE id = ? AND uploader = ?', [videoId, user.id], (err) => {
        callback(err);
      })
    },
    (callback) => {
      const query = [
        'SELECT a.id, a.title, a.description, a.videoCode, a.uploader AS uploaderId, b.username AS uploaderName ',
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
  const videoId = Number(req.query.videoId);
  let query = [
    'SELECT a.id AS videoId, a.title, a.description, a.videoCode, a.uploader AS uploaderId, b.username AS uploaderName ',
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
      const videoCode = rows[0].videoCode;
      const uploaderId = rows[0].uploaderId;
      const uploaderName = rows[0].uploaderName;
      async.parallel([
        (callback) => {
          pool.query('SELECT * FROM vq_questions WHERE videoId = ? AND isDraft = 0', videoId, (err, rows) => {
            let questions = [];
            if (rows) {
              questions = rows.map(row => {
                return {
                  title: row.title,
                  choices: [
                    row.choice1,
                    row.choice2,
                    row.choice3,
                    row.choice4,
                    row.choice5
                  ],
                  correctChoice: row.correctChoice
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
          videoCode,
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
  const videoId = Number(req.query.videoId);
  const query = [
    'SELECT a.id, a.userId, a.content, a.timeStamp, b.username ',
    'FROM vq_comments a JOIN users b ON a.userId = b.id ',
    'WHERE videoId = ? AND commentId IS NULL ORDER BY a.id DESC'
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
        userId,
        content: processedString(comment),
        timeStamp: Math.floor(Date.now()/1000),
        videoId
      }
      pool.query('INSERT INTO vq_comments SET ?', post, (err) => {
        callback(err)
      })
    },
    (callback) => {
      const query = [
        'SELECT a.id, a.userId, a.content, a.timeStamp, b.username ',
        'FROM vq_comments a JOIN users b ON a.userId = b.id ',
        'WHERE videoId = ? AND commentId IS NULL ORDER BY a.id DESC'
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
  pool.query('UPDATE vq_comments SET ? WHERE id = ? AND userId = ?', [{content}, commentId, userId], err => {
    if (err) {
      console.error(err);
      return res.status(500).send({error: err});
    }
    res.send({success: true})
  })
})

router.delete('/comments', requireAuth, (req, res) => {
  const user = req.user;
  const commentId = Number(req.query.commentId);
  pool.query('DELETE FROM vq_comments WHERE id = ? AND userId = ?', [commentId, user.id], err => {
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
      const query = 'SELECT * FROM vq_commentupvotes WHERE commentId = ? AND userId = ?';
      pool.query(query, [commentId, user.id], (err, rows) => {
        callback(err, user.id, rows);
      })
    },
    (userId, rows, callback) => {
      if (rows.length > 0) {
        let query = 'DELETE FROM vq_commentupvotes WHERE commentId = ? AND userId = ?';
        pool.query(query, [commentId, userId], err => {
          callback(err);
        })
      } else {
        let query = 'INSERT INTO vq_commentupvotes SET ?';
        pool.query(query, {commentId: commentId, userId: userId}, err => {
          callback(err);
        })
      }
    },
    (callback) => {
      let query = [
        'SELECT a.id, a.userId, b.username FROM ',
        'vq_commentupvotes a JOIN users b ON ',
        'a.userId = b.id WHERE ',
        'a.commentId = ?'
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
          userId: row.userId,
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
        userId: user.id,
        content: processedReply,
        timeStamp: Math.floor(Date.now()/1000),
        commentId,
        videoId
      }
      pool.query('INSERT INTO vq_comments SET ?', post, (err, result) => {
        callback(err, result.insertId)
      })
    },
    (replyId, callback) => {
      let query = [
        'SELECT a.id, a.content, a.timeStamp, a.userId, b.username FROM ',
        'vq_comments a JOIN users b ON a.userId = b.id WHERE ',
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
        timeStamp: rows[0].timeStamp,
        userId: rows[0].userId,
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

  pool.query('UPDATE vq_comments SET ? WHERE id = ? AND userId = ?', [{content}, replyId, user.id], err => {
    if (err) {
      console.error(err);
      return res.status(500).send({error: err});
    }
    res.send({success: true})
  })
})

router.delete('/replies', requireAuth, (req, res) => {
  const user = req.user;
  const replyId = Number(req.query.replyId) || 0;
  pool.query('DELETE FROM vq_comments WHERE id = ? AND userId = ?', [replyId, user.id], err => {
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
      const query = 'SELECT * FROM vq_commentupvotes WHERE commentId = ? AND userId = ?';
      pool.query(query, [replyId, user.id], (err, rows) => {
        callback(err, rows);
      })
    },
    (rows, callback) => {
      if (rows.length > 0) {
        let query = 'DELETE FROM vq_commentupvotes WHERE commentId = ? AND userId = ?';
        pool.query(query, [replyId, user.id], err => {
          callback(err);
        })
      } else {
        let query = 'INSERT INTO vq_commentupvotes SET ?';
        pool.query(query, {commentId: replyId, userId: user.id}, err => {
          callback(err);
        })
      }
    },
    (callback) => {
      let query = [
        'SELECT a.id, a.userId, b.username FROM ',
        'vq_commentupvotes a JOIN users b ON ',
        'a.userId = b.id WHERE ',
        'a.commentId = ?'
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
          userId: row.userId,
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
      pool.query('DELETE FROM vq_questions WHERE videoId = ? AND creator = ?', [videoId, userId], err => {
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

router.get('/search', (req, res) => {
  const searchQuery = req.query.query;
  if (stringIsEmpty(searchQuery) || searchQuery.length < 2) return res.send({result: []})
  async.waterfall([
    callback => {
      let query = 'SELECT id, title AS label FROM vq_videos WHERE title LIKE ? LIMIT 10';
      pool.query(query, '%' + searchQuery + '%', (err, result) => {
        callback(err, result)
      })
    }
  ], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({error: err});
    }
    res.send({result})
  })
})


module.exports = router;
