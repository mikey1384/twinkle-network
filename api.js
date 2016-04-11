import express from 'express';
import bodyParser from 'body-parser';
import async from 'async';
import passwordHash from 'password-hash';
import crypto from 'crypto';
import * as UserDataHelper from './helpers/UserData';
import { pool, siteSession } from './siteConfig';

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
    res.json(rows);
  });
});

app.post('/video', (req, res) => {
  const rawDescription = (!req.body.description || req.body.description === '') ? "No description" : req.body.description,
        title = processedTitleString(req.body.title),
        description = processedString(rawDescription),
        videocode = fetchedVideoCodeFromURL(req.body.url),
        session = req.session.sessioncode;
  async.waterfall([
    (callback) => {
      pool.query('SELECT id, username FROM users WHERE sessioncode = ?', session, (err, rows) => {
        if (!rows) return;
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
      res.json({error: err});
      return;
    }
    res.json({result});
  });

  function fetchedVideoCodeFromURL (url) {
		var trimmedUrl = url.split("v=")[1].split("#")[0];
		var videoCode = trimmedUrl.split("&")[0];
		return videoCode;
	}
  function processedTitleString (string) {
  	var processedString = string
  	.replace(/&/g, '&amp;')
  	.replace(/</g, '&lt;')
  	.replace(/>/g, '&gt;')
  	.replace(/\\/g, '\\\\');
  	return processedString;
  }
  function processedString (string) {
  	var regex = /(\b(((https?|ftp|file|):\/\/)|www[.])[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  	var tempString = string
  	.replace(/&/g, '&amp;')
  	.replace(/</g, '&lt;')
  	.replace(/>/g, '&gt;')
  	.replace(/\\/g, '\\\\')
  	.replace(/\r?\n/g, '<br>')
  	.replace(regex,"<a href=\"$1\" target=\"_blank\">$1</a>");
  	var newString = "";
  	while(tempString.length > 0){
  		var position = tempString.indexOf("href=\"");
  		if(position === -1){
  			newString += tempString;
  			break;
  		}
  		newString += tempString.substring(0, position + 6);
  		tempString = tempString.substring(position + 6, tempString.length);
  		if (tempString.indexOf("://") > 8 || tempString.indexOf("://") === -1) {
  			newString += "http://";
  		}
  	}
  	return newString;
  }
});

app.delete('/video', (req, res) => {
  const videoId = typeof req.query.videoId !== 'undefined' ? req.query.videoId : 0,
        lastVideoId = typeof req.query.lastVideoId !== 'undefined' ? req.query.lastVideoId : 0,
        session = req.session.sessioncode;

  async.parallel([
    (callback) => {
      pool.query('SELECT id, username FROM users WHERE sessioncode = ?', session, (err, rows) => {
        if (err) {
          callback(err);
        } else {
          if (!rows) return;
          const userId = rows[0].id;
          pool.query('DELETE FROM vq_videos WHERE id = ? AND uploader = ?', [videoId, userId], (err) => {
            callback(err);
          })
        }
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
      res.json({error: err});
      return;
    }
    res.json({result: results[1]});
  });
})

app.post('/video/edit/title', (req, res) => {
  const { editedTitle, videoId } = req.body,
        newTitle = processedTitleString(editedTitle),
        session = req.session.sessioncode,
        post = {
          title: newTitle
        };

  async.waterfall([
    (callback) => {
      pool.query('SELECT id, username FROM users WHERE sessioncode = ?', session, (err, rows) => {
        if (!rows) return;
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
      res.json({error: err});
      return;
    }
    res.json({result});
  });

  function processedTitleString (string) {
  	var processedString = string
  	.replace(/&/g, '&amp;')
  	.replace(/</g, '&lt;')
  	.replace(/>/g, '&gt;')
  	.replace(/\\/g, '\\\\');
  	return processedString;
  }
})

app.get('/playlist', (req, res) => {
  var pinnedOnly = typeof req.query.pinned !== 'undefined' ? true : false;
  var playlistId = typeof req.query.playlistId !== 'undefined' ? req.query.playlistId : null;
  var where = playlistId !== null || pinnedOnly ? 'WHERE' : '';
  if (playlistId !== null) {
    where += ' a.id < ? ';
  }
  if (playlistId === null && pinnedOnly) {
    where += ' a.pinned = 1 ';
  }
  if (playlistId !== null && pinnedOnly) {
    where += 'AND a.pinned = 1 ';
  }
  var taskArray = [];
  var playlistArrayGroup = [];
  var query = [
    'SELECT a.id, a.title, a.createdby AS uploaderid, b.username AS uploader ',
    'FROM vq_playlists a JOIN users b ON a.createdby = b.id ',
    where,
    'ORDER BY a.id DESC LIMIT 4'
  ].join('');
  pool.query(query, playlistId, function (err, rows) {
    if (!rows) return;
    for (let i = 0; i < rows.length; i++) {
      var TaskFactory = function (playlistRowNumber, playlistId, playlistTitle, uploader, uploaderId) {
        this.task = function (callback) {
          createPlaylistArrays(playlistRowNumber, playlistId, playlistTitle, uploader, uploaderId, callback);
        }
      }
      var taskFactory = new TaskFactory(i, rows[i].id, rows[i].title, rows[i].uploader, rows[i].uploaderid);
      taskArray.push(taskFactory.task);
    }
    async.parallel(taskArray, err => {
      if (err) {
        console.error(err);
        return;
      }
      res.json({
        playlists: playlistArrayGroup
      });
    });
  })

  function createPlaylistArrays (playlistRowNumber, playlistId, playlistTitle, uploader, uploaderId, callback) {
    var query = [
      'SELECT a.id, a.videoid, b.title AS video_title, b.videocode, c.username AS video_uploader ',
      'FROM vq_playlistvideos a JOIN vq_videos b ON a.videoid = b.id JOIN users c ON b.uploader = c.id ',
      'WHERE a.playlistid = ?'
    ].join('');
    pool.query(query, playlistId, (err, rows) => {
      playlistArrayGroup[playlistRowNumber] = {
        playlist: rows,
        title: playlistTitle,
        id: playlistId,
        uploader: uploader,
        uploaderId: uploaderId
      }
      callback(null);
    })
  }
})

app.post('/playlist', (req, res) => {
  const rawDescription = (!req.body.description || req.body.description === '') ? "No description" : req.body.description,
        title = processedTitleString(req.body.title),
        description = processedString(rawDescription),
        videos = req.body.videos,
        taskArray = [],
        session = req.session.sessioncode;
  async.waterfall([
    (callback) => {
      pool.query('SELECT id, username FROM users WHERE sessioncode = ?', session, (err, rows) => {
        if (!rows) return;
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
        var TaskFactory = function (playlistId, videoId) {
          this.task = function (callback) {
            insertVideoIntoPlaylist(playlistId, videoId, callback);
          }
        }
        var factory = new TaskFactory(playlistId, videos[i]);
        taskArray.push(factory.task);
      }
      async.series(taskArray, function (err) {
        const query = [
          'SELECT a.id, a.videoid, b.title AS video_title, b.videocode, c.username AS video_uploader ',
          'FROM vq_playlistvideos a JOIN vq_videos b ON a.videoid = b.id JOIN users c ON b.uploader = c.id ',
          'WHERE a.playlistid = ?'
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
      res.json({error: err});
      return;
    }
    res.json({result});
  });

  function insertVideoIntoPlaylist (playlistId, videoId, callback) {
    var playlistVideo = {playlistid: playlistId, videoid: videoId};
    pool.query("INSERT INTO vq_playlistvideos SET ?", playlistVideo, function (err) {
      callback(err);
    })
  }

  function processedTitleString (string) {
  	var processedString = string
  	.replace(/&/g, '&amp;')
  	.replace(/</g, '&lt;')
  	.replace(/>/g, '&gt;')
  	.replace(/\\/g, '\\\\');
  	return processedString;
  }
  function processedString (string) {
  	var regex = /(\b(((https?|ftp|file|):\/\/)|www[.])[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  	var tempString = string
  	.replace(/&/g, '&amp;')
  	.replace(/</g, '&lt;')
  	.replace(/>/g, '&gt;')
  	.replace(/\\/g, '\\\\')
  	.replace(/\r?\n/g, '<br>')
  	.replace(regex,"<a href=\"$1\" target=\"_blank\">$1</a>");
  	var newString = "";
  	while(tempString.length > 0){
  		var position = tempString.indexOf("href=\"");
  		if(position === -1){
  			newString += tempString;
  			break;
  		}
  		newString += tempString.substring(0, position + 6);
  		tempString = tempString.substring(position + 6, tempString.length);
  		if (tempString.indexOf("://") > 8 || tempString.indexOf("://") === -1) {
  			newString += "http://";
  		}
  	}
  	return newString;
  }
})

app.post('/playlist/edit/title', (req, res) => {
  const { editedTitle, playlistId } = req.body,
        newTitle = processedTitleString(editedTitle),
        session = req.session.sessioncode,
        post = {
          title: newTitle
        };

  async.waterfall([
    (callback) => {
      pool.query('SELECT id, username FROM users WHERE sessioncode = ?', session, (err, rows) => {
        if (!rows) return;
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
      res.json({error: err});
      return;
    }
    res.json({result});
  });

  function processedTitleString (string) {
  	var processedString = string
  	.replace(/&/g, '&amp;')
  	.replace(/</g, '&lt;')
  	.replace(/>/g, '&gt;')
  	.replace(/\\/g, '\\\\');
  	return processedString;
  }
})

app.post('/playlist/change/videos', (req, res) => {
  const {playlistId, selectedVideos} = req.body,
        session = req.session.sessioncode,
        taskArray = [];
  async.waterfall([
    (callback) => {
      pool.query('SELECT id, username FROM users WHERE sessioncode = ?', session, (err, rows) => {
        if (!rows) return;
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
        callback(err, null)
      })
    },
    (res, callback) => {
      for (let i = 0; i < selectedVideos.length; i ++) {
        var TaskFactory = function (playlistId, videoId) {
          this.task = function (callback) {
            insertVideoIntoPlaylist(playlistId, videoId, callback);
          }
        }
        var factory = new TaskFactory(playlistId, selectedVideos[i]);
        taskArray.push(factory.task);
      }
      async.series(taskArray, (err) => {
        const query = [
          'SELECT a.id, a.videoid, b.title AS video_title, b.videocode, c.username AS video_uploader ',
          'FROM vq_playlistvideos a JOIN vq_videos b ON a.videoid = b.id JOIN users c ON b.uploader = c.id ',
          'WHERE a.playlistid = ?'
        ].join('');
        pool.query(query, playlistId, (err, rows) => {
          callback(err, rows)
        })
      })
    }
  ], (err, result) => {
    if (err) {
      console.error(err);
      res.json({error: err});
      return;
    }
    res.json({result});
  });

  function insertVideoIntoPlaylist (playlistId, videoId, callback) {
    var playlistVideo = {playlistid: playlistId, videoid: videoId};
    pool.query("INSERT INTO vq_playlistvideos SET ?", playlistVideo, function (err) {
      callback(err);
    })
  }
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

app.get('/user/logout', function (req, res) {
  req.session.reset();
  res.json({result: "success"});
})

app.post('/user/login', function (req, res) {
  const { username, password } = req.body;
  const usernameCapped = username.toUpperCase();
  const { userExists } = UserDataHelper;
  pool.query('SELECT * FROM users WHERE username = ?', usernameCapped, function (err, rows) {
    if (!err) {
      if (userExists(rows)) {
        var hashedPass = rows[0].password;
        if (passwordHash.verify(password, hashedPass)){
          req.session.sessioncode = rows[0].sessioncode;
          res.json({
            result: "success",
            username: usernameCapped,
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
  const { userExists, isFalseClaim } = UserDataHelper;
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

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function saveUserData() {
    const hashedPass = passwordHash.generate(password);
    const sessioncode = crypto.randomBytes(64).toString('hex');
    const usertype = isTeacher ? "teacher" : "user";
    const usernameCapped = username.toUpperCase();
    const post = {
      username: usernameCapped,
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
          username: usernameCapped,
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
