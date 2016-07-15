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

var async = require('async');

const fetchPlaylistVideos = params => callback => {
  let playlists = params.playlists;
  let playlistArrayGroup = params.playlistArrayGroup;
  let index = params.index;
  let query = [
    'SELECT a.id, a.videoid, b.title AS video_title, b.description AS video_description, ',
    'b.videocode, c.id AS video_uploader_id, c.username AS video_uploader, COUNT(d.id) AS numLikes ',
    'FROM vq_playlistvideos a JOIN vq_videos b ON a.videoid = b.id JOIN users c ON b.uploader = c.id ',
    'LEFT JOIN vq_video_likes d ON b.id = d.videoId ',
    'WHERE a.playlistid = ? GROUP BY a.videoid ORDER BY a.id'
  ].join('');
  pool.query(query, playlists[index].id, (err, rows) => {
    playlistArrayGroup[index] = {
      playlist: rows,
      title: playlists[index].title,
      id: playlists[index].id,
      uploader: playlists[index].uploader,
      uploaderId: playlists[index].uploaderid
    }
    callback(err);
  })
}

module.exports = {
  fetchPlaylists(query, callback) {
    let playlistArrayGroup = [];
    let taskArray = [];
    pool.query(query, (err, playlists) => {
      if (!playlists) {
        return callback("Load Error");
      }
      for (let index = 0; index < playlists.length; index++) {
        taskArray.push(fetchPlaylistVideos({playlists, playlistArrayGroup, index}));
      }
      async.parallel(taskArray, err => {
        callback(err, playlistArrayGroup)
      });
    })
  }
}
