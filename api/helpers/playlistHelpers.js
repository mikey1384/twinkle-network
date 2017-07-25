const {poolQuery, promiseSeries} = require('../helpers')

module.exports = {
  fetchPlaylists(query) {
    return poolQuery(query).then(
      rows => {
        let playlistIds = rows.map(({playlistId}) => playlistId)
        const playlistQuery = `
          SELECT a.id, a.title, a.creator AS uploaderId, b.username AS uploader
          FROM vq_playlists a LEFT JOIN users b ON a.creator = b.id
          WHERE a.id = ?
        `
        const playlistVideosQuery = `
          SELECT
            a.id, a.videoId,
            b.title AS video_title, b.description AS video_description,
            b.content,
            c.id AS video_uploader_id,
            c.username AS video_uploader,
            COUNT(d.id) AS numLikes
          FROM
            vq_playlistvideos a
          JOIN
            vq_videos b ON a.videoId = b.id
          JOIN
            users c ON b.uploader = c.id
          LEFT JOIN
            content_likes d ON b.id = d.rootId AND d.rootType = 'video'
          WHERE a.playlistId = ? GROUP BY a.id ORDER BY a.id LIMIT 10
        `
        const playlistVideoNumberQuery = `
          SELECT COUNT(id) AS numVids FROM vq_playlistvideos WHERE playlistId = ?
        `
        return promiseSeries(playlistIds.map(playlistId => {
          return () => promiseSeries([
            () => poolQuery(playlistQuery, playlistId),
            () => poolQuery(playlistVideosQuery, playlistId),
            () => poolQuery(playlistVideoNumberQuery, playlistId)
          ])
        }))
      }
    ).then(
      results => {
        let playlists = []
        for (let i = 0; i < results.length; i++) {
          const [[playlistInfo], playlistVideos, [{numVids}]] = results[i]
          playlists[i] = Object.assign(
            {},
            playlistInfo,
            {playlist: playlistVideos},
            {showAllButton: numVids > 10}
          )
        }
        return Promise.resolve(playlists)
      }
    )
  }
}
