"use strict"

const pool = require('../siteConfig').pool;
const requireAuth = require('../auth').requireAuth;

const processedString = require('../helpers/StringHelper').processedString;
const processedTitleString = require('../helpers/StringHelper').processedTitleString;
const fetchPlaylists = require('../helpers/PlaylistHelper').fetchPlaylists;

const async = require('async');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
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
      res.status(500).send({error: err});
      return;
    }
    res.send({playlists});
  })
})

router.post('/', requireAuth, (req, res) => {
  const user = req.user;
  const rawDescription = (!req.body.description || req.body.description === '') ?
        "No description" : req.body.description;
  const title = processedTitleString(req.body.title);
  const description = processedString(rawDescription);
  const videos = req.body.videos;
  const taskArray = [];
  async.waterfall([
    (callback) => {
      const uploaderid = user.id;
      const uploadername = user.username;
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
      return res.status(500).send({error: err});
    }
    res.send({result});
  });
})

router.post('/edit/title', requireAuth, (req, res) => {
  const user = req.user;
  const title = req.body.title;
  const playlistId = req.body.playlistId;
  const newTitle = processedTitleString(title);
  const post = {
    title: newTitle
  };
  const userId = user.id;
  pool.query('UPDATE vq_playlists SET ? WHERE id = ? AND createdby = ?', [post, playlistId, userId], err => {
    if (err) {
      console.error(err);
      return res.status(500).send({error: err});
    }
    res.json({result: newTitle});
  })
})

router.post('/edit/videos', requireAuth, (req, res) => {
  const user = req.user;
  const playlistId = req.body.playlistId;
  const selectedVideos = req.body.selectedVideos;
  const taskArray = [];

  async.waterfall([
    (callback) => {
      const userId = user.id;
      pool.query('SELECT * FROM vq_playlists WHERE createdby = ? AND id = ?', [userId, playlistId], (err, rows) => {
        callback(err, rows);
      })
    },
    (rows, callback) => {
      if (!rows || rows.length === 0) return callback('User is not the owner of the playlist');
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

router.delete('/', requireAuth, (req, res) => {
  const user = req.user;
  const playlistId = typeof req.query.playlistId !== 'undefined' ? req.query.playlistId : 0;
  async.waterfall([
    (callback) => {
      const userId = user.id;
      pool.query('SELECT * FROM vq_playlists WHERE createdby = ? AND id = ?', [userId, playlistId], (err, rows) => {
        if (!rows || rows.length === 0) return callback('User is not the owner of the playlist');
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
      return res.status(500).send({error: err});
    }
    res.send({success: true});
  });
})

router.get('/pinned', (req, res) => {
  const query = [
    'SELECT a.id, a.title, a.createdby AS uploaderid, b.username AS uploader ',
    'FROM vq_playlists a JOIN vq_pinned_playlists c ON c.playlistId = a.id ',
    'JOIN users b ON a.createdby = b.id ORDER BY c.id DESC'
  ].join('');
  fetchPlaylists(query, (err, playlists) =>{
    if (err) {
      console.error(err);
      res.status(500).send({error: err});
      return;
    }
    res.send({playlists});
  })
})

router.post('/pinned', requireAuth, (req, res) => {
  const user = req.user;
  const selectedPlaylists = req.body.selectedPlaylists;

  if (selectedPlaylists.length > 3) {
    return res.status(500).send({error: 'Maximum playlist number exceeded'});
  }
  async.waterfall([
    (callback) => {
      const userType = user.usertype;
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
        callback(null);
      } else {
        let taskArray = [];
        for (let i = selectedPlaylists.length - 1; i >= 0; i--) {
          taskArray.push(callback => {
            pool.query('INSERT INTO vq_pinned_playlists SET ?', {playlistId: selectedPlaylists[i]}, err => {
              callback(err)
            })
          })
        }
        async.series(taskArray, (err) => {
          callback(err)
        })
      }
    },
    callback => {
      const query = [
        'SELECT a.id, a.title, a.createdby AS uploaderid, b.username AS uploader ',
        'FROM vq_playlists a JOIN vq_pinned_playlists c ON c.playlistId = a.id ',
        'JOIN users b ON a.createdby = b.id ORDER BY c.id DESC'
      ].join('');
      fetchPlaylists(query, (err, playlists) =>{
        callback(err, playlists)
      })
    }
  ], (err, playlists) => {
    if (err) {
      console.error(err);
      return res.status(500).send({error: err});
    }
    res.json({playlists});
  })
})

router.get('/list', (req, res) => {
  const playlistId = req.query.playlistId ? req.query.playlistId : 0;
  const where = playlistId !== 0 ? 'WHERE id < ' + playlistId + ' ' : '';
  const query = [
    'SELECT id, title FROM vq_playlists ',
    where,
    'ORDER BY id DESC LIMIT 11'
  ].join('');
  pool.query(query, (err, rows) => {
    if (!rows) {
      res.status(500).send({error: "No Playlist"});
      return;
    };
    res.send({result: rows});
  })
})

module.exports = router;
