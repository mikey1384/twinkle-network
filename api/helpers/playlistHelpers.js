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
          SELECT a.id, a.videoId FROM vq_playlistvideos a JOIN vq_videos b
          ON a.videoId = b.id
          WHERE a.playlistId = ? ORDER BY a.id LIMIT 10
        `
        const videoDetailsQuery = `
          SELECT a.title AS video_title, a.description AS video_description, a.content, a.isStarred,
          b.id AS video_uploader_id, b.username AS video_uploader, COUNT(c.id) AS numLikes

          FROM vq_videos a JOIN users b ON a.uploader = b.id
          LEFT JOIN content_likes c ON a.id = c.rootId AND c.rootType = 'video'
          WHERE a.id = ?
        `
        const playlistVideoNumberQuery = `
          SELECT COUNT(id) AS numVids FROM vq_playlistvideos WHERE playlistId = ?
        `
        return promiseSeries(playlistIds.map(playlistId => {
          return () => promiseSeries([
            () => poolQuery(playlistQuery, playlistId),
            () => poolQuery(playlistVideosQuery, playlistId).then(
              rows => promiseSeries(rows.map(({id, videoId}) => {
                return () => poolQuery(videoDetailsQuery, videoId).then(rows => Promise.resolve(rows.map(
                  row => Object.assign({}, row, {id, videoId})
                )))
              }))
            ),
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
            {playlist: playlistVideos.map(([video]) => video)},
            {showAllButton: numVids > 10}
          )
        }
        return Promise.resolve(playlists)
      }
    )
  }
}
