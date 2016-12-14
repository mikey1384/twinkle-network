const pool = require('../pool');

const {requireAuth} = require('../auth');
const {
  processedString,
  processedTitleString,
  fetchedVideoCodeFromURL,
  stringIsEmpty
} = require('../helpers/stringHelpers');
const {returnComments, returnReplies} = require('../helpers/videoHelpers');

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
    'FROM vq_videos a LEFT JOIN users b ON a.uploader = b.id ',
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
  const {title, description, url, selectedCategory} = req.body;
  const rawDescription = !description ? "No description" : req.body.description;
  const uploaderName = user.username;
  const post = {
    title: processedTitleString(title),
    description: processedString(rawDescription),
    videoCode: fetchedVideoCodeFromURL(url),
    categoryId: selectedCategory,
    uploader: user.id,
    timeStamp: Math.floor(Date.now()/1000)
  }

  pool.query('INSERT INTO vq_videos SET ?', post, (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).send({error: err});
    }
    let result = Object.assign({}, post, {
      id: row.insertId,
      uploaderId: user.id,
      uploaderName: user.username,
      numLikes: 0
    });
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
        'FROM vq_videos a LEFT JOIN users b ON a.uploader = b.id ',
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
        'FROM vq_video_likes a LEFT JOIN users b ON a.userId = b.id ',
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
    'SELECT a.id AS videoId, a.title, a.description, a.videoCode, a.timeStamp, a.uploader AS uploaderId, b.username AS uploaderName, ',
    '(SELECT COUNT(*) FROM vq_video_views WHERE videoId = ?) AS videoViews ',
    'FROM vq_videos a LEFT JOIN users b ON a.uploader = b.id ',
    'WHERE a.id = ?'
  ].join('');
  pool.query(query, [videoId, videoId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).send({error: err});
    }
    if (rows[0]) {
      const videoId = rows[0].videoId;
      const title = rows[0].title;
      const description = rows[0].description;
      const videoCode = rows[0].videoCode;
      const uploaderId = rows[0].uploaderId;
      const uploaderName = rows[0].uploaderName;
      const timeStamp = rows[0].timeStamp;
      const videoViews = rows[0].videoViews;
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
            'FROM vq_video_likes a LEFT JOIN users b ON a.userId = b.id ',
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
          timeStamp,
          videoViews,
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
  const {videoId, lastCommentId} = req.query;
  const limit = 21;
  const where = !!lastCommentId && lastCommentId !== '0' ? 'AND a.id < ' + lastCommentId + ' ' : ''
  const query = [
    'SELECT a.id, a.userId, a.content, a.timeStamp, a.videoId, a.commentId, a.replyId, b.username, ',
    'c.title AS debateTopic ',
    'FROM vq_comments a LEFT JOIN users b ON a.userId = b.id ',
    'LEFT JOIN content_discussions c ON a.debateId = c.id ',
    'WHERE videoId = ? AND commentId IS NULL ', where,
    'ORDER BY a.id DESC LIMIT ' + limit
  ].join('');
  pool.query(query, videoId, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).send({error: err});
    }
    if (rows.length === 0) {
      return res.send({
        comments: [],
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
        'FROM vq_comments a LEFT JOIN users b ON a.userId = b.id ',
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
        'vq_commentupvotes a LEFT JOIN users b ON ',
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

router.delete('/debates', requireAuth, (req, res) => {
  const {user} = req;
  const {debateId} = req.query;
  const query  = 'DELETE FROM content_discussions WHERE id = ? AND userId = ?';
  pool.query(query, [debateId, user.id], err => {
    if (err) {
      console.error(err);
      return res.status(500).send(err)
    }
    res.send({success: true})
  })
})

router.get('/debates', (req, res) => {
  const {videoId, lastDebateId} = req.query;
  const limit = 4;
  const where = !!lastDebateId ? 'AND a.id < ' + lastDebateId + ' ' : '';
  const query = [
    'SELECT a.id, a.userId, a.title, a.description, a.timeStamp, b.username, ',
    '(SELECT COUNT(*) FROM vq_comments WHERE debateId = a.id) AS numComments ',
    'FROM content_discussions a LEFT JOIN users b ON a.userId = b.id ',
    'WHERE a.refContentType = \'video\' AND a.refContentId = ? ', where,
    'ORDER BY a.id DESC LIMIT ' + limit
  ].join('');
  pool.query(query, videoId, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).send({error: err});
    }
    res.send(rows.map(row => Object.assign({}, row, {
      comments: [],
      loadMoreDebateCommentsButton: false
    })));
  })
})

router.get('/debates/comments', (req, res) => {
  const {debateId, lastCommentId} = req.query;
  const limit = 4;
  const where = !!lastCommentId && lastCommentId !== '0' ? 'AND a.id < ' + lastCommentId + ' ' : '';
  const query = [
    'SELECT a.id, a.userId, a.content, a.timeStamp, b.username FROM ',
    'vq_comments a LEFT JOIN users b ON a.userId = b.id WHERE ',
    'a.debateId = ? AND a.commentId IS NULL ', where,
    'ORDER BY a.id DESC LIMIT ' + limit
  ].join('');
  pool.query(query, debateId, (err, rows) => {
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

router.post('/debates', requireAuth, (req, res) => {
  const {title, description, videoId} = req.body;
  const {user} = req;
  const query = 'INSERT INTO content_discussions SET ?';
  const post = {
    title: processedTitleString(title),
    description: !!description && description !== '' ? processedString(description) : null,
    userId: user.id,
    refContentType: 'video',
    refContentId: videoId,
    timeStamp: Math.floor(Date.now()/1000)
  }
  pool.query(query, post, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({error: err})
    }
    res.send(Object.assign({}, post, {
      id: result.insertId,
      username: user.username,
      comments: [],
      loadMoreDebateCommentsButton: false
    }))
  })
})

router.post('/debates/edit', requireAuth, (req, res) => {
  const {user} = req;
  const {debateId, editedTitle, editedDescription} = req.body;
  const post = {title: editedTitle, description: processedString(editedDescription)};
  const query = 'UPDATE content_discussions SET ? WHERE id = ? AND userId = ?';
  pool.query(query, [post, debateId, user.id], (err) => {
    if (err) {
      console.error(err)
      return res.status(500).send({error: err})
    }
    res.send(post)
  })
})

router.post('/debates/comments', requireAuth, (req, res) => {
  const {videoId, debateId, comment} = req.body;
  const {user} = req;
  const query = "INSERT INTO vq_comments SET ?";
  const post = {
    userId: user.id,
    content: processedString(comment),
    timeStamp: Math.floor(Date.now()/1000),
    videoId,
    debateId
  }
  pool.query(query, post, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({error: err})
    }
    res.send(Object.assign({}, post, {
      id: result.insertId,
      likes: [],
      replies: [],
      username: user.username
    }))
  })
})

router.get('/replies', (req, res) => {
  const {lastReplyId, commentId} = req.query;
  const where = !!lastReplyId && lastReplyId !== '0' ? 'AND a.id < ' + lastReplyId + ' ' : '';
  let loadMoreReplies = false;
  const query = [
    'SELECT a.id, a.userId, a.content, a.timeStamp, a.videoId, a.commentId, a.replyId, b.username, ',
    'c.userId AS targetUserId, d.username AS targetUserName FROM vq_comments a JOIN users b ON ',
    'a.userId = b.id LEFT JOIN vq_comments c ON a.replyId = c.id ',
    'LEFT JOIN users d ON c.userId = d.id WHERE a.commentId = ? ', where,
    'ORDER BY a.id DESC LIMIT 11'
  ].join('')
  pool.query(query, [commentId, lastReplyId], (err, rows) => {
    if (err) {
      console.error(err)
      return res.status(500).send({error: err})
    }
    if (rows.length > 10) {
      rows.pop();
      loadMoreReplies = true;
    }
    rows.sort(function(a, b) {return a.id - b.id})
    returnReplies(rows, (err, replies) => {
      if (err) {
        console.error(err)
        return res.status(500).send({error: err})
      }
      res.send({replies, loadMoreReplies})
    })
  })
})

router.post('/replies', requireAuth, (req, res) => {
  const user = req.user;
  const replyId = req.body.replyId ? req.body.replyId : null;
  const {addedFromPanel, reply, videoId, commentId} = req.body;
  const processedReply = processedString(reply);
  async.waterfall([
    callback => {
      pool.query('SELECT debateId FROM vq_comments WHERE id = ?', commentId, (err, rows) => {
        callback(err, rows[0].debateId)
      })
    },
    (debateId, callback) => {
      const post = {
        userId: user.id,
        content: processedReply,
        timeStamp: Math.floor(Date.now()/1000),
        replyId,
        commentId,
        videoId,
        debateId
      }
      pool.query('INSERT INTO vq_comments SET ?', post, (err, result) => {
        callback(err, result.insertId)
      })
    },
    (replyId, callback) => {
      let query = [
        'SELECT a.id, a.userId, a.content, a.timeStamp, a.commentId, a.replyId, b.username, ',
        'c.userId AS targetUserId, d.username AS targetUserName FROM vq_comments a LEFT JOIN users b ON ',
        'a.userId = b.id LEFT JOIN vq_comments c ON a.replyId = c.id ',
        'LEFT JOIN users d ON c.userId = d.id WHERE a.id = ?'
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
      result: Object.assign({}, rows[0], {
        newlyAdded: true,
        likes: [],
        addedFromPanel
      })
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
        'vq_commentupvotes a LEFT JOIN users b ON ',
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
      let query = 'SELECT id, title AS label FROM vq_videos WHERE title LIKE ? ORDER BY id DESC LIMIT 20';
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

router.post('/view', (req, res) => {
  const {videoId, userId} = req.body;
  const post = {videoId, userId, timeStamp: Math.floor(Date.now()/1000)};
  pool.query('INSERT INTO vq_video_views SET ?', post, err => {
    if (err) {
      console.error(err);
      return res.status(500).send({error: err});
    }
    res.send({success: true})
  })
})

module.exports = router;
