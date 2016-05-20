import express from 'express';
import bodyParser from 'body-parser';
import async from 'async';
import passwordHash from 'password-hash';
import crypto from 'crypto';
import { pool, siteSession } from '../siteConfig';
import { userExists, isFalseClaim } from './UserHelper';
import {
  fetchedVideoCodeFromURL,
  processedTitleString,
  processedString,
  capitalize,
  stringIsEmpty } from './StringHelper';
import { fetchPlaylists } from './PlaylistHelper';

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(siteSession());

app.get('/video', (req, res) => {
  const videoId = req.query.videoId || 0;
  const numberToLoad = parseInt(req.query.numberToLoad) + 1 || 13;
  const where = videoId === 0 ? '' : 'WHERE a.id < ? ';
  const query = [
    'SELECT a.id, a.title, a.description, a.videocode, a.uploader AS uploaderid, b.username AS uploadername ',
    'FROM vq_videos a JOIN users b ON a.uploader = b.id ',
    where,
    'ORDER BY a.id DESC LIMIT ' + numberToLoad
  ].join('');
  pool.query(query, videoId, (err, rows) => {
    if (!rows) {
      res.send({error: "No Videos"});
      return;
    }
    res.json(rows);
  });
});

app.post('/video', (req, res) => {
  const rawDescription = (!req.body.description || req.body.description === '') ?
  "No description" : req.body.description;
  const title = processedTitleString(req.body.title);
  const description = processedString(rawDescription);
  const videocode = fetchedVideoCodeFromURL(req.body.url);
  const session = req.session.sessioncode;

  async.waterfall([
    (callback) => {
      pool.query('SELECT id, username FROM users WHERE sessioncode = ?', session, (err, rows) => {
        if (!rows || rows.length === 0) return callback({invalidSession: true});
        callback(err, rows);
      })
    },
    (rows, callback) => {
      const uploaderid = rows[0].id;
      const uploadername = rows[0].username;
      const post = {title, description, videocode, uploader: uploaderid};
      pool.query('INSERT INTO vq_videos SET?', post, (err, res) => {
        const thumb = {id: res.insertId, title, description, videocode, uploaderid, uploadername};
        callback(err, thumb);
      })
    }
  ], (err, result) => {
    if (err) {
      console.error(err);
      return res.json({error: err});
    }
    res.json({result});
  });
});

app.delete('/video', (req, res) => {
  const videoId = typeof req.query.videoId !== 'undefined' ? req.query.videoId : 0;
  const lastVideoId = typeof req.query.lastVideoId !== 'undefined' ? req.query.lastVideoId : 0;
  const session = req.session.sessioncode;

  async.parallel([
    (callback) => {
      pool.query('SELECT id, username FROM users WHERE sessioncode = ?', session, (err, rows) => {
        if (!rows || rows.length === 0) return callback({invalidSession: true});
        const userId = rows[0].id;
        pool.query('DELETE FROM vq_videos WHERE id = ? AND uploader = ?', [videoId, userId], (err) => {
          callback(err);
        })
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
      return res.json({error: err});
    }
    res.json({result: results[1]});
  });
})

app.post('/video/edit/title', (req, res) => {
  const { title, videoId } = req.body;
  const newTitle = processedTitleString(title);
  const session = req.session.sessioncode;
  const post = { title: newTitle };

  async.waterfall([
    (callback) => {
      pool.query('SELECT id, username FROM users WHERE sessioncode = ?', session, (err, rows) => {
        if (!rows || rows.length === 0) return callback({invalidSession: true});
        callback(err, rows);
      })
    },
    (rows, callback) => {
      const userId = rows[0].id;
      pool.query('UPDATE vq_videos SET? WHERE id = ? AND uploader = ?', [post, videoId, userId], err => {
        callback(err, newTitle);
      })
    }
  ], (err, result) => {
    if (err) {
      console.error(err);
      return res.json({error: err});
    }
    res.json({result});
  });
})

app.post('/video/edit/page', (req, res) => {
  let { videoId, title, description } = req.body;
  if (stringIsEmpty(title)) {
    return res.send({error: "Title is empty"});
  }
  if (description === '') description = 'No description';
  const session = req.session.sessioncode;
  const post = {title, description: processedString(description)};
  async.waterfall([
    (callback) => {
      pool.query('SELECT id, username FROM users WHERE sessioncode = ?', session, (err, rows) => {
        if (!rows || rows.length === 0) return callback({invalidSession: true});
        callback(err, rows);
      })
    },
    (rows, callback) => {
      const userId = rows[0].id;
      pool.query('UPDATE vq_videos SET ? WHERE id = ? AND uploader = ?', [post, videoId, userId], err => {
        callback(err, true);
      })
    }
  ], (err, success) => {
    if (err) {
      console.error(err);
      return res.json({error: err});
    }
    res.json({success});
  });
})

app.get('/video/loadPage', (req, res) => {
  const {videoId} = req.query;
  let query = [
    'SELECT a.id AS videoId, a.title, a.description, a.videocode, a.uploader AS uploaderId, b.username AS uploaderName ',
    'FROM vq_videos a JOIN users b ON a.uploader = b.id ',
    'WHERE a.id = ?'
  ].join('');
  pool.query(query, videoId, (err, rows) => {
    if (err) {
      return res.send({error: err});
    }
    if (rows[0]) {
      const { videoId, title, description, videocode, uploaderId, uploaderName } = rows[0];
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
        res.json({
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
      res.json({error: 'Video doesn\'t exist'})
    }
  })
})

app.get('/video/comments', (req, res) => {
  const { videoId } = req.query;
  const query = [
    'SELECT a.id, a.userid, a.content, a.timeposted, b.username ',
    'FROM vq_comments a JOIN users b ON a.userid = b.id ',
    'WHERE videoid = ? ORDER BY a.id DESC'
  ].join('');
  pool.query(query, videoId, (err, rows) => {
    if (err) {
      return res.send({error: err});
    }
    if (rows.length === 0) {
      return res.send({
        noComments: true
      })
    }
    res.send({
      comments: rows.map(row => {
        return {
          id: row.id,
          posterId: row.userid,
          posterName: row.username,
          content: row.content,
          timeStamp: row.timeposted
        }
      }),
      noComments: false
    })
  })
})

app.post('/video/comments', (req, res) => {
  const { videoId, comment } = req.body;
  const session = req.session.sessioncode;
  async.waterfall([
    callback => {
      pool.query('SELECT id, username FROM users WHERE sessioncode = ?', session, (err, rows) => {
        if (!rows || rows.length === 0) return callback({invalidSession: true});
        callback(err, rows);
      })
    },
    (rows, callback) => {
      const userId = rows[0].id;
      const post = {
        userid: userId,
        content: processedString(comment),
        timeposted: Math.floor(Date.now()/1000),
        videoid: videoId
      }
      pool.query('INSERT INTO vq_comments SET ?', post, (err) => {
        callback(err)
      })
    }
  ], (err) => {
    if (err) {
      console.error(err);
      return res.json({error: err});
    }
    const query = [
      'SELECT a.id, a.userid, a.content, a.timeposted, b.username ',
      'FROM vq_comments a JOIN users b ON a.userid = b.id ',
      'WHERE videoid = ? ORDER BY a.id DESC'
    ].join('');
    pool.query(query, videoId, (err, rows) => {
      if (err) {
        return res.send({error: err});
      }
      res.send({
        result: rows.map(row => {
          return {
            id: row.id,
            posterId: row.userid,
            posterName: row.username,
            content: row.content,
            timeStamp: row.timeposted
          }
        })
      })
    })
  })
})

app.post('/video/comments/edit', (req, res) => {
  const content = processedString(req.body.editedComment);
  const commentId = req.body.commentId;
  const session = req.session.sessioncode;
  async.waterfall([
    callback => {
      pool.query('SELECT id, username FROM users WHERE sessioncode = ?', session, (err, rows) => {
        if (!rows || rows.length === 0) return callback({invalidSession: true});
        callback(err, rows);
      })
    },
    (rows, callback) => {
      const userId = rows[0].id;
      pool.query('UPDATE vq_comments SET ? WHERE id = ? AND userid = ?', [{content}, commentId, userId], err => {
        callback(err, true)
      })
    }
  ], (err, success) => {
    if (err) {
      console.error(err);
      return res.send({error: err});
    }
    res.send({success})
  })
})

app.post('/video/questions', (req, res) => {
  const { videoId, questions } = req.body;
  const session = req.session.sessioncode;
  async.waterfall([
    (callback) => {
      pool.query('SELECT id, username FROM users WHERE sessioncode = ?', session, (err, rows) => {
        if (!rows || rows.length === 0) return callback({invalidSession: true});
        callback(err, rows);
      })
    },
    (rows, callback) => {
      const userId = rows[0].id;
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
      return res.json({error: err});
    }
    res.json({success});
  });
})

app.post('/video/like', (req, res) => {
  const { videoId } = req.body;
  const session = req.session.sessioncode;
  async.waterfall([
    (callback) => {
      pool.query('SELECT id, username FROM users WHERE sessioncode = ?', session, (err, rows) => {
        if (!rows || rows.length === 0) return callback({invalidSession: true});
        callback(err, rows);
      })
    },
    (rows, callback) => {
      const userId = rows[0].id;
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
    }
  ], (err) => {
    if (err) {
      console.error(err);
      return res.json({error: err});
    }
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
      res.json({likes})
    })
  });
})

app.get('/playlist', (req, res) => {
  const playlistId = typeof req.query.playlistId !== 'undefined' ? req.query.playlistId : null;
  const where = playlistId !== null ? 'WHERE a.id < ' + playlistId + ' ' : '';
  const query = [
    'SELECT a.id, a.title, a.createdby AS uploaderid, b.username AS uploader ',
    'FROM vq_playlists a JOIN users b ON a.createdby = b.id ',
    where,
    'ORDER BY a.id DESC LIMIT 4'
  ].join('');
  fetchPlaylists(query, (err, playlists) =>{
    if (err) {
      console.error(err);
      res.send({error: err});
      return;
    }
    res.json({playlists});
  })
})

app.get('/playlist/pinned', (req, res) => {
  const query = [
    'SELECT a.id, a.title, a.createdby AS uploaderid, b.username AS uploader ',
    'FROM vq_playlists a JOIN vq_pinned_playlists c ON c.playlistId = a.id ',
    'JOIN users b ON a.createdby = b.id ORDER BY c.id DESC'
  ].join('');
  fetchPlaylists(query, (err, playlists) =>{
    if (err) {
      console.error(err);
      res.send({error: err});
      return;
    }
    res.json({playlists});
  })
})

app.get('/playlist/list', (req, res) => {
  const playlistId = req.query.playlistId ? req.query.playlistId : 0;
  const where = playlistId !== 0 ? 'WHERE id < ' + playlistId + ' ' : '';
  const query = [
    'SELECT id, title FROM vq_playlists ',
    where,
    'ORDER BY id DESC LIMIT 11'
  ].join('');
  pool.query(query, (err, rows) => {
    if (!rows) {
      res.send({error: "No Playlist"});
      return;
    };
    res.send({result: rows});
  })
})

app.post('/playlist', (req, res) => {
  const rawDescription = (!req.body.description || req.body.description === '') ?
        "No description" : req.body.description;
  const title = processedTitleString(req.body.title);
  const description = processedString(rawDescription);
  const videos = req.body.videos;
  const taskArray = [];
  const session = req.session.sessioncode;
  async.waterfall([
    (callback) => {
      pool.query('SELECT id, username FROM users WHERE sessioncode = ?', session, (err, rows) => {
        if (!rows || rows.length === 0) return callback({invalidSession: true});
        callback(err, rows);
      })
    },
    (rows, callback) => {
      const uploaderid = rows[0].id;
      const uploadername = rows[0].username;
      const post = {title, description, createdby: uploaderid};
      pool.query('INSERT INTO vq_playlists SET ?', post, (err, res) => {
        const playlistId = res.insertId;
        callback(err, playlistId, uploadername, uploaderid);
      })
    },
    (playlistId, uploadername, uploaderid, callback) => {
      for (let i = 0; i < videos.length; i ++) {
        taskArray.push(callback => {
          let playlistVideo = {playlistid: playlistId, videoid: videos[i]};
          pool.query("INSERT INTO vq_playlistvideos SET ?", playlistVideo, function (err) {
            callback(err);
          })
        });
      }
      async.series(taskArray, function (err) {
        const query = [
          'SELECT a.id, a.videoid, b.title AS video_title, b.videocode, c.username AS video_uploader ',
          'FROM vq_playlistvideos a JOIN vq_videos b ON a.videoid = b.id JOIN users c ON b.uploader = c.id ',
          'WHERE a.playlistid = ? ORDER BY a.id'
        ].join('');
        pool.query(query, playlistId, (err, rows) => {
          callback(err, {
            playlist: rows,
            title: title,
            id: playlistId,
            uploader: uploadername,
            uploaderId: uploaderid
          })
        })
      })
    }
  ], (err, result) => {
    if (err) {
      console.error(err);
      return res.json({error: err});
    }
    res.json({result});
  });
})

app.post('/playlist/pinned', (req, res) => {
  const { selectedPlaylists } = req.body;
  const session = req.session.sessioncode;
  if (selectedPlaylists.length > 3) {
    res.send({error: 'Maximum playlist number exceeded'});
    return;
  }
  async.waterfall([
    callback => {
      pool.query('SELECT usertype FROM users WHERE sessioncode = ?', session, (err, rows) => {
        if (!rows || rows.length === 0) return callback({invalidSession: true});
        callback(err, rows);
      })
    },
    (rows, callback) => {
      const userType = rows[0].usertype;
      if (userType !== 'master') {
        return callback('User is not authorized to perform this action');
      }
      pool.query('SELECT * FROM vq_pinned_playlists', (err, rows) => {
        if (rows) {
          pool.query('TRUNCATE vq_pinned_playlists', err => {
            if (err) {
              return callback(err);
            }
            callback(err)
          })
        } else {
          callback(err)
        }
      })
    },
    callback => {
      if (selectedPlaylists.length === 0) {
        callback(null, true);
      } else {
        let taskArray = [];
        for (let i = selectedPlaylists.length - 1; i >= 0; i--) {
          taskArray.push(callback => {
            pool.query('INSERT INTO vq_pinned_playlists SET ?', {playlistId: selectedPlaylists[i]}, err => {
              callback(err)
            })
          })
        }
        async.series(taskArray, (err, results) => {
          callback(null, true)
        })
      }
    }
  ], (err, success) => {
    if (err) {
      res.send({error: err});
      return;
    }
    if (success) {
      const query = [
        'SELECT a.id, a.title, a.createdby AS uploaderid, b.username AS uploader ',
        'FROM vq_playlists a JOIN vq_pinned_playlists c ON c.playlistId = a.id ',
        'JOIN users b ON a.createdby = b.id ORDER BY c.id DESC'
      ].join('');
      fetchPlaylists(query, (err, playlists) =>{
        if (err) {
          console.error(err);
          return res.send({error: err});
        }
        res.json({playlists});
      })
    }
  })
})

app.delete('/playlist', (req, res) => {
  const playlistId = typeof req.query.playlistId !== 'undefined' ? req.query.playlistId : 0;
  const session = req.session.sessioncode;
  async.waterfall([
    (callback) => {
      pool.query('SELECT id, username FROM users WHERE sessioncode = ?', session, (err, rows) => {
        if (!rows || rows.length === 0) return callback({invalidSession: true});
        callback(err, rows);
      })
    },
    (rows, callback) => {
      const userId = rows[0].id;
      pool.query('SELECT * FROM vq_playlists WHERE createdby = ? AND id = ?', [userId, playlistId], (err, rows) => {
        if (!rows) return;
        callback(err, userId);
      })
    },
    (userId, callback) => {
      async.parallel([
        (callback) => {
          pool.query('DELETE FROM vq_playlists WHERE createdby = ? AND id = ?', [userId, playlistId], (err, result) => {
            callback(err, result);
          })
        },
        (callback) => {
          pool.query('DELETE FROM vq_pinned_playlists WHERE playlistId = ?', playlistId, (err, result) => {
            callback(err, result);
          })
        },
        (callback) => {
          pool.query('DELETE FROM vq_playlistvideos WHERE playlistId = ?', playlistId, (err, result) => {
            callback(err, result);
          })
        }
      ], (err, results) => {
        callback(err, results);
      });
    }
  ], (err, result) => {
    if (err) {
      console.error(err);
      return res.json({error: err});
    }
    res.json({success: true});
  });
})

app.post('/playlist/edit/title', (req, res) => {
  const { title, playlistId } = req.body;
  const newTitle = processedTitleString(title);
  const session = req.session.sessioncode;
  const post = {
    title: newTitle
  };

  async.waterfall([
    (callback) => {
      pool.query('SELECT id, username FROM users WHERE sessioncode = ?', session, (err, rows) => {
        if (!rows || rows.length === 0) return callback({invalidSession: true});
        callback(err, rows);
      })
    },
    (rows, callback) => {
      const userId = rows[0].id;
      pool.query('UPDATE vq_playlists SET ? WHERE id = ? AND createdby = ?', [post, playlistId, userId], err => {
        callback(err, newTitle);
      })
    }
  ], (err, result) => {
    if (err) {
      console.error(err);
      return res.json({error: err});
    }
    res.json({result});
  });
})

app.post('/playlist/change/videos', (req, res) => {
  const {playlistId, selectedVideos} = req.body;
  const session = req.session.sessioncode;
  const taskArray = [];

  async.waterfall([
    (callback) => {
      pool.query('SELECT id, username FROM users WHERE sessioncode = ?', session, (err, rows) => {
        if (!rows || rows.length === 0) return callback({invalidSession: true});
        callback(err, rows);
      })
    },
    (rows, callback) => {
      const userId = rows[0].id;
      pool.query('SELECT * FROM vq_playlists WHERE createdby = ? AND id = ?', [playlistId, userId], (err, rows) => {
        callback(err, rows);
      })
    },
    (rows, callback) => {
      if (!rows) return;
      pool.query('DELETE FROM vq_playlistvideos WHERE playlistid = ?', playlistId, err => {
        callback(err)
      })
    },
    (callback) => {
      for (let i = 0; i < selectedVideos.length; i ++) {
        taskArray.push(callback => {
          let playlistVideo = {playlistid: playlistId, videoid: selectedVideos[i]};
          pool.query("INSERT INTO vq_playlistvideos SET ?", playlistVideo, function (err) {
            callback(err);
          })
        });
      }
      async.series(taskArray, (err) => {
        const query = [
          'SELECT a.id, a.videoid, b.title AS video_title, b.videocode, c.username AS video_uploader ',
          'FROM vq_playlistvideos a JOIN vq_videos b ON a.videoid = b.id JOIN users c ON b.uploader = c.id ',
          'WHERE a.playlistid = ? ORDER BY a.id'
        ].join('');
        pool.query(query, playlistId, (err, rows) => {
          callback(err, rows)
        })
      })
    }
  ], (err, result) => {
    if (err) {
      console.error(err);
      return res.json({error: err});
    }
    res.json({result});
  });
})

app.get('/user/session', function (req, res) {
  const session = req.session.sessioncode;
  if (typeof session !== 'undefined') {
    pool.query("SELECT * FROM users WHERE sessioncode = ?", session, (err, rows) => {
      if (!rows) return;
      if (rows.length > 0) {
        res.json({
          loggedIn: true,
          userId: rows[0].id,
          usertype: rows[0].usertype,
          username: rows[0].username
        })
      } else {
        res.json({loggedIn: false})
      }
    })
  } else {
    res.json({loggedIn: false})
  }
})

app.post('/user/session', function (req, res) {
  const session = req.body.session.sessioncode;
  if (typeof session !== 'undefined') {
    pool.query("SELECT * FROM users WHERE sessioncode = ?", session, (err, rows) => {
      if (!rows) {
        res.json({loggedIn: false});
        return;
      };
      if (rows.length > 0) {
        res.json({
          loggedIn: true,
          userId: rows[0].id,
          usertype: rows[0].usertype,
          username: rows[0].username
        })
      } else {
        res.json({loggedIn: false})
      }
    })
  } else {
    res.json({loggedIn: false})
  }
})

app.get('/user/logout', function (req, res) {
  req.session.reset();
  res.json({result: "success"});
})

app.post('/user/login', function (req, res) {
  const { username, password } = req.body;
  const usernameLowered = username.toLowerCase();
  pool.query('SELECT * FROM users WHERE username = ?', usernameLowered, function (err, rows) {
    if (!err) {
      if (userExists(rows)) {
        var hashedPass = rows[0].password;
        if (passwordHash.verify(password, hashedPass)){
          req.session.sessioncode = rows[0].sessioncode;
          res.json({
            result: "success",
            username: usernameLowered,
            usertype: rows[0].usertype,
            userId: rows[0].id
          });
        } else {
          res.json({result: "Incorrect username/password combination"});
        }
      } else {
        res.json({result: "Incorrect username/password combination"});
      }
    } else {
      console.log(err);
      res.json({result: err});
    }
  });
})

app.post('/user/signup', function (req, res) {
  const { isTeacher, username, firstname, lastname, email, password } = req.body;
  const realname = capitalize(firstname) + ' ' + capitalize(lastname);
  pool.query('SELECT * FROM users WHERE username = ?', username, (err, rows) => {
    if (!err) {
      if (userExists(rows)) {
        res.json({
          result: "That username already exists"
        });
      } else {
        if (isFalseClaim(email, isTeacher)) {
          res.json({
            result: "That email is not registered as a teacher's email in our database"
          });
        } else {
          saveUserData();
        }
      }
    } else {
      console.log(err);
      res.json({
        result: err
      });
    }
  });

  function saveUserData() {
    const hashedPass = passwordHash.generate(password);
    const sessioncode = crypto.randomBytes(64).toString('hex');
    const usertype = isTeacher ? "teacher" : "user";
    const usernameLowered = username.toLowerCase();
    const post = {
      username: usernameLowered,
      realname,
      email,
      password: hashedPass,
      usertype,
      joindate: Math.floor(Date.now()/1000),
      sessioncode
    }
    pool.query('INSERT INTO users SET?', post, function (err, result) {
      if (!err) {
        req.session.sessioncode = sessioncode;
        res.json({
          result: "success",
          username: usernameLowered,
          usertype,
          userId: result.insertId
        });
      } else {
        console.log(err);
        res.json({
          result: err
        });
      }
    });
  }
});

module.exports = app;
