import { pool } from '../siteConfig';
import async from 'async';

const fetchPlaylistVideos = ({playlists, playlistArrayGroup, index}) => callback => {
  let query = [
    'SELECT a.id, a.videoid, b.title AS video_title, b.videocode, c.username AS video_uploader ',
    'FROM vq_playlistvideos a JOIN vq_videos b ON a.videoid = b.id JOIN users c ON b.uploader = c.id ',
    'WHERE a.playlistid = ?'
  ].join('');
  pool.query(query, playlists[index].id, (err, rows) => {
    playlistArrayGroup[index] = {
      playlist: rows,
      title: playlists[index].title,
      id: playlists[index].id,
      uploader: playlists[index].uploader,
      uploaderId: playlists[index].uploaderid
    }
    callback(null);
  })
}

export const fetchPlaylists = (query, callback) => {
  let playlistArrayGroup = [];
  let taskArray = [];
  pool.query(query, (err, playlists) => {
    if (!playlists) {
      callback("Load Error");
      return;
    }
    for (let index = 0; index < playlists.length; index++) {
      taskArray.push(fetchPlaylistVideos({playlists, playlistArrayGroup, index}));
    }
    async.parallel(taskArray, err => {
      callback(err, playlistArrayGroup)
    });
  })
}
