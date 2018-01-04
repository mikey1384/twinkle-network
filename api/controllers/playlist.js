const pool = require('../pool')
const { poolQuery, promiseSeries } = require('../helpers')
const { requireAuth } = require('../auth')
const { fetchPlaylists } = require('../helpers/playlistHelpers')
const async = require('async')
const express = require('express')
const router = express.Router()
const { stringIsEmpty } = require('../helpers/stringHelpers')

router.get('/', (req, res) => {
  const { shownPlaylists } = req.query
  const where = shownPlaylists
    ? 'WHERE ' + shownPlaylists.map(id => `id != ${id}`).join(' AND ')
    : ''
  const query = `
    SELECT id AS playlistId FROM vq_playlists ${where}
    ORDER BY timeStamp DESC, id DESC LIMIT 4
  `
  return fetchPlaylists(query)
    .then(playlists => res.send({ playlists }))
    .catch(error => {
      console.error(error)
      res.status(500).send({ error })
    })
})

router.get('/playlist', (req, res) => {
  const { playlistId, shownVideos, noLimit } = req.query
  const where = shownVideos
    ? 'AND ' + shownVideos.map(id => `a.videoId != ${id}`).join(' AND ')
    : ''
  const query = `
    SELECT a.videoId AS id, b.title, b.content, b.isStarred, b.uploader AS uploaderId,
    c.username AS uploaderName
    FROM vq_playlistvideos a JOIN vq_videos b ON a.videoId = b.id JOIN users c ON b.uploader = c.id
    WHERE a.playlistId = ? ${where}${noLimit ? '' : ' LIMIT 11'}
  `
  return poolQuery(query, playlistId)
    .then(videos => res.send(videos))
    .catch(error => {
      console.error(error)
      res.status(500).send({ error })
    })
})

router.get('/rightMenu', (req, res) => {
  const { videoId, playlistId } = req.query
  const titleQuery = `
    SELECT title FROM vq_playlists WHERE id = ?
  `
  const nextVideoQuery = `
    SELECT a.id, a.videoId, b.title, b.uploader, b.content, b.isStarred, c.username FROM vq_playlistvideos a
    JOIN vq_videos b ON a.videoId = b.id JOIN users c ON b.uploader = c.id
    WHERE a.playlistId = ?
    AND a.id > (SELECT id FROM vq_playlistvideos WHERE playlistId = ? AND videoId = ? LIMIT 1)
    LIMIT 1
  `
  const videosQuery = `
    SELECT a.id, a.videoId, b.title, b.uploader, b.content, b.isStarred, c.username FROM vq_playlistvideos a
    JOIN vq_videos b ON a.videoId = b.id JOIN users c ON b.uploader = c.id
    WHERE a.playlistId = ? AND a.videoId != ? LIMIT 11
  `
  return promiseSeries([
    () => poolQuery(titleQuery, playlistId),
    () => poolQuery(nextVideoQuery, [playlistId, playlistId, videoId]),
    () => poolQuery(videosQuery, [playlistId, videoId])
  ])
    .then(([[{ title: playlistTitle }], nextVideos, playlistVideos]) => {
      let playlistVideosLoadMoreShown = false
      if (playlistVideos.length > 10) {
        playlistVideosLoadMoreShown = true
        playlistVideos.pop()
      }
      res.send({
        playlistTitle,
        nextVideos,
        playlistVideos,
        playlistVideosLoadMoreShown
      })
    })
    .catch(error => {
      console.error(error)
      res.status(500).send({ error })
    })
})

router.post('/', requireAuth, (req, res) => {
  const user = req.user
  const title = req.body.title
  const description = req.body.description
  const videos = req.body.selectedVideos
  const taskArray = []
  const query = 'INSERT INTO vq_playlists SET ?'
  const post = {
    title,
    description,
    creator: user.id,
    timeStamp: Math.floor(Date.now() / 1000)
  }
  return poolQuery(query, post)
    .then(({ insertId: playlistId }) => {
      for (let i = 0; i < videos.length; i++) {
        let query = 'INSERT INTO vq_playlistvideos SET ?'
        taskArray.push(() =>
          poolQuery(query, { playlistId, videoId: videos[i] })
        )
      }
      return promiseSeries(taskArray).then(() => Promise.resolve(playlistId))
    })
    .then(playlistId => {
      const videosQuery = `
        SELECT a.id, a.videoId, b.title AS video_title, b.content, b.isStarred,
        c.username AS video_uploader, COUNT(d.id) AS numLikes
        FROM vq_playlistvideos a JOIN vq_videos b ON a.videoId = b.id LEFT JOIN users c ON b.uploader = c.id
        LEFT JOIN content_likes d ON b.id = d.rootId AND d.rootType = 'video'
        WHERE a.playlistId = ? GROUP BY a.id ORDER BY a.id LIMIT 10
      `
      const numberOfVideosQuery = `
        SELECT COUNT(id) AS numVids FROM vq_playlistvideos WHERE playlistId = ?
      `
      return promiseSeries([
        () => poolQuery(videosQuery, playlistId),
        () => poolQuery(numberOfVideosQuery, playlistId)
      ]).then(([playlist, [{ numVids }]]) =>
        Promise.resolve({ playlist, numVids, playlistId })
      )
    })
    .then(({ playlist, numVids, playlistId }) => {
      res.send({
        result: {
          playlist,
          showAllButton: numVids > 10,
          title,
          id: playlistId,
          uploader: user.username,
          uploaderId: user.id
        }
      })
    })
    .catch(error => {
      console.error(error)
      res.status(500).send({ error })
    })
})

router.post('/edit/title', requireAuth, (req, res) => {
  const title = req.body.title
  const playlistId = req.body.playlistId
  pool.query(
    'UPDATE vq_playlists SET ? WHERE id = ?',
    [{ title }, playlistId],
    err => {
      if (err) {
        console.error(err)
        return res.status(500).send({ error: err })
      }
      res.json({ result: title })
    }
  )
})

router.post('/edit/videos', requireAuth, (req, res) => {
  const playlistId = req.body.playlistId
  const selectedVideos = req.body.selectedVideos

  return poolQuery(
    'DELETE FROM vq_playlistvideos WHERE playlistId = ?',
    playlistId
  )
    .then(() => {
      let insertQuery = 'INSERT INTO vq_playlistvideos SET ?'
      return promiseSeries([
        () =>
          promiseSeries(
            selectedVideos.map(videoId => () =>
              poolQuery(insertQuery, { playlistId, videoId })
            )
          ),
        () =>
          poolQuery('UPDATE vq_playlists SET ? WHERE id = ?', [
            { timeStamp: Math.floor(Date.now() / 1000) },
            playlistId
          ])
      ])
    })
    .then(() => {
      let query = `
        SELECT a.id, a.videoId, b.title AS video_title, b.content, b.isStarred,
        c.username AS video_uploader, COUNT(d.id) AS numLikes
        FROM vq_playlistvideos a
          JOIN vq_videos b ON a.videoId = b.id
          LEFT JOIN users c ON b.uploader = c.id
          LEFT JOIN content_likes d ON b.id = d.rootId AND d.rootType = 'video'
        WHERE a.playlistId = ? GROUP BY a.id ORDER BY a.id
      `
      return poolQuery(query, playlistId)
    })
    .then(result => res.send({ result }))
    .catch(err => {
      console.error(err)
      res.status(500).send({ error: err })
    })
})

router.delete('/', requireAuth, (req, res) => {
  const playlistId =
    typeof req.query.playlistId !== 'undefined'
      ? Number(req.query.playlistId)
      : 0
  async.waterfall(
    [
      callback => {
        pool.query(
          'SELECT * FROM vq_playlists WHERE id = ?',
          playlistId,
          (err, rows) => {
            if (!rows || rows.length === 0) { return callback('User is not the owner of the playlist') }
            callback(err)
          }
        )
      },
      callback => {
        async.parallel(
          [
            callback => {
              pool.query(
                'DELETE FROM vq_playlists WHERE id = ?',
                playlistId,
                (err, result) => {
                  callback(err, result)
                }
              )
            },
            callback => {
              pool.query(
                'DELETE FROM vq_pinned_playlists WHERE playlistId = ?',
                playlistId,
                (err, result) => {
                  callback(err, result)
                }
              )
            },
            callback => {
              pool.query(
                'DELETE FROM vq_playlistvideos WHERE playlistId = ?',
                playlistId,
                (err, result) => {
                  callback(err, result)
                }
              )
            }
          ],
          (err, results) => {
            callback(err, results)
          }
        )
      }
    ],
    (err, result) => {
      if (err) {
        console.error(err)
        return res.status(500).send({ error: err })
      }
      res.send({ success: true })
    }
  )
})

router.get('/pinned', (req, res) => {
  const query = `SELECT playlistId FROM vq_pinned_playlists ORDER BY id DESC`
  return fetchPlaylists(query)
    .then(playlists => res.send({ playlists }))
    .catch(error => {
      console.error(error)
      res.status(500).send({ error })
    })
})

router.post('/pinned', requireAuth, (req, res) => {
  const user = req.user
  const selectedPlaylists = req.body.selectedPlaylists

  if (selectedPlaylists.length > 5) {
    return res.status(500).send({ error: 'Maximum playlist number exceeded' })
  }
  async.waterfall(
    [
      callback => {
        const userType = user.userType
        if (userType !== 'manager' && userType !== 'creator') {
          return callback('User is not authorized to perform this action')
        }
        pool.query('SELECT * FROM vq_pinned_playlists', (err, rows) => {
          if (rows) {
            pool.query('TRUNCATE vq_pinned_playlists', err => {
              if (err) {
                return callback(err)
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
          callback(null)
        } else {
          let taskArray = []
          for (let i = selectedPlaylists.length - 1; i >= 0; i--) {
            taskArray.push(callback => {
              pool.query(
                'INSERT INTO vq_pinned_playlists SET ?',
                { playlistId: selectedPlaylists[i] },
                err => {
                  callback(err)
                }
              )
            })
          }
          async.series(taskArray, err => {
            callback(err)
          })
        }
      },
      callback => {
        return fetchPlaylists(
          'SELECT playlistId FROM vq_pinned_playlists ORDER BY id DESC'
        ).then(playlists => callback(null, playlists))
      }
    ],
    (err, playlists) => {
      if (err) {
        console.error(err)
        return res.status(500).send({ error: err })
      }
      res.json({ playlists })
    }
  )
})

router.get('/search/video', (req, res) => {
  const searchQuery = req.query.query
  if (stringIsEmpty(searchQuery) || searchQuery.length < 2) return res.send([])
  const query = `
    SELECT a.id, a.title, a.content, a.isStarred, a.uploader AS uploaderId, b.username AS uploaderName
    FROM vq_videos a JOIN users b ON a.uploader = b.id WHERE a.title LIKE ?
    ORDER by a.id DESC LIMIT 18
  `
  return poolQuery(query, '%' + searchQuery + '%')
    .then(result => res.send(result))
    .catch(error => {
      console.error(error)
      return res.status(500).send({ error })
    })
})

router.get('/search/playlist', async(req, res) => {
  const searchQuery = req.query.query
  const query = `
    SELECT id AS playlistId FROM vq_playlists WHERE title LIKE '%${searchQuery}%' ORDER BY playlistId DESC LIMIT 5
  `
  try {
    const playlists = await fetchPlaylists(query)
    res.send(playlists)
  } catch (error) {
    console.error(error)
    res.status(500).send({ error })
  }
})

router.get('/list', (req, res) => {
  const playlistId = req.query.playlistId ? Number(req.query.playlistId) : 0
  const where = playlistId !== 0 ? 'WHERE id < ' + playlistId + ' ' : ''
  const query = [
    'SELECT id, title FROM vq_playlists ',
    where,
    'ORDER BY id DESC LIMIT 11'
  ].join('')
  pool.query(query, (err, rows) => {
    if (err) {
      console.error(err)
      return res.status(500).send({ error: err })
    }
    res.send({ result: rows })
  })
})

module.exports = router
