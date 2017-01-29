const async = require('async')
const pool = require('../pool')

const fetchPlaylistVideos = params => callback => {
  let playlists = params.playlists
  let playlistArrayGroup = params.playlistArrayGroup
  let index = params.index
  let query = [
    'SELECT a.id, a.videoId, b.title AS video_title, b.description AS video_description, ',
    'b.videoCode, c.id AS video_uploader_id, c.username AS video_uploader, COUNT(d.id) AS numLikes ',
    'FROM vq_playlistvideos a JOIN vq_videos b ON a.videoId = b.id JOIN users c ON b.uploader = c.id ',
    'LEFT JOIN vq_video_likes d ON b.id = d.videoId ',
    'WHERE a.playlistId = ? GROUP BY a.videoId ORDER BY a.id'
  ].join('')
  pool.query(query, playlists[index].id, (err, rows) => {
    playlistArrayGroup[index] = {
      playlist: rows,
      title: playlists[index].title,
      id: playlists[index].id,
      uploader: playlists[index].uploader,
      uploaderId: playlists[index].uploaderId
    }
    callback(err)
  })
}

module.exports = {
  fetchPlaylists(query, callback) {
    let playlistArrayGroup = []
    let taskArray = []
    pool.query(query, (err, playlists) => {
      if (err) {
        return callback({error: err})
      }
      for (let index = 0; index < playlists.length; index++) {
        taskArray.push(fetchPlaylistVideos({playlists, playlistArrayGroup, index}))
      }
      async.parallel(taskArray, err => {
        callback(err, playlistArrayGroup)
      })
    })
  }
}
