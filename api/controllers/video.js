const pool = require('../pool')
const {poolQuery, promiseSeries} = require('../helpers')

const {requireAuth} = require('../auth')
const {
  processedTitleString,
  fetchedVideoCodeFromURL,
  stringIsEmpty
} = require('../helpers/stringHelpers')
const {
  deleteComments,
  editComments,
  likeComments,
  postComments,
  fetchComments,
  returnComments,
  fetchReplies,
  postReplies
} = require('../helpers/commentHelpers')

const async = require('async')
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  const videoId = Number(req.query.videoId) || 0
  const numberToLoad = Number(req.query.numberToLoad) + 1 || 13
  const where = videoId === 0 ? '' : 'WHERE id < ? '
  const idQuery = `
    SELECT id FROM vq_videos ${where} ORDER BY id DESC LIMIT ${numberToLoad}
  `
  const videoQuery = `
    SELECT a.id, a.title, a.description, a.content, a.uploader AS uploaderId,
    b.username AS uploaderName, isStarred, COUNT(c.id) AS numLikes
    FROM vq_videos a LEFT JOIN users b ON a.uploader = b.id
    LEFT JOIN content_likes c ON a.id = c.rootId AND c.rootType = 'video'
    WHERE a.id = ?
  `
  return poolQuery(idQuery, videoId).then(
    videoIds => promiseSeries(videoIds.map(({id}) => {
      return () => poolQuery(videoQuery, id)
    }))
  ).then(
    rows => {
      let videos = rows.map(([video]) => video)
      res.send(videos)
    }
  ).catch(
    error => {
      console.error(error)
      res.status(500).send({error})
    }
  )
})

router.post('/', requireAuth, (req, res) => {
  const user = req.user
  const {title, description, url} = req.body
  const post = {
    title: processedTitleString(title),
    description: description,
    content: fetchedVideoCodeFromURL(url),
    uploader: user.id,
    timeStamp: Math.floor(Date.now()/1000)
  }

  pool.query('INSERT INTO vq_videos SET ?', post, (err, row) => {
    if (err) {
      console.error(err)
      return res.status(500).send({error: err})
    }
    let result = Object.assign({}, post, {
      id: row.insertId,
      uploaderId: user.id,
      uploaderName: user.username,
      numLikes: 0
    })
    res.json({result})
  })
})

router.delete('/', requireAuth, (req, res) => {
  const user = req.user
  const videoId = req.query.videoId !== 'undefined' ? Number(req.query.videoId) : 0
  const lastVideoId = req.query.lastVideoId !== 'undefined' ? Number(req.query.lastVideoId) : 0

  async.parallel([
    (callback) => {
      pool.query('DELETE FROM vq_videos WHERE id = ? AND uploader = ?', [videoId, user.id], (err) => {
        callback(err)
      })
    },
    (callback) => {
      const query = [
        'SELECT a.id, a.title, a.description, a.content, a.uploader AS uploaderId, b.username AS uploaderName ',
        'FROM vq_videos a LEFT JOIN users b ON a.uploader = b.id ',
        'WHERE a.id < ? ',
        'ORDER BY a.id DESC LIMIT 1'
      ].join('')
      pool.query(query, lastVideoId, (err, rows) => {
        callback(err, rows)
      })
    }
  ], (err, results) => {
    if (err) {
      console.error(err)
      return res.status(500).send({error: err})
    }
    res.json({result: results[1]})
  })
})

router.post('/edit/title', requireAuth, (req, res) => {
  const user = req.user
  const title = req.body.title
  const videoId = req.body.videoId
  const newTitle = processedTitleString(title)
  const post = { title: newTitle }

  const userId = user.id
  pool.query('UPDATE vq_videos SET ? WHERE id = ? AND uploader = ?', [post, videoId, userId], err => {
    if (err) {
      console.error(err)
      return res.status(500).send({error: err})
    }
    res.send({result: newTitle})
  })
})

router.post('/like', requireAuth, (req, res) => {
  const {user, body: {contentId: videoId}} = req
  let query = `
    SELECT * FROM content_likes WHERE rootType = 'video' AND rootId = ? AND userId = ?
  `
  return poolQuery(query, [videoId, user.id]).then(
    rows => {
      if (rows.length > 0) {
        let query = `DELETE FROM content_likes WHERE rootType = 'video' AND rootId = ? AND userId = ?`
        return poolQuery(query, [videoId, user.id])
      } else {
        return poolQuery('INSERT INTO content_likes SET ?', {
          rootType: 'video',
          rootId: videoId,
          userId: user.id,
          timeStamp: Math.floor(Date.now() / 1000)
        })
      }
    }
  ).then(
    () => {
      const query = `
        SELECT a.userId, b.username
        FROM content_likes a LEFT JOIN users b ON a.userId = b.id
        WHERE a.rootType = 'video' AND a.rootId = ?
      `
      return poolQuery(query, videoId)
    }
  ).then(
    rows => res.send({likes: rows})
  ).catch(
    error => {
      console.error(error)
      res.status(500).send({error})
    }
  )
})

router.post('/edit/page', requireAuth, (req, res) => {
  const user = req.user
  const {videoId, title, description, url} = req.body
  if (stringIsEmpty(title)) return res.status(500).send({error: 'Title is empty'})
  const post = {
    title,
    description: description,
    content: fetchedVideoCodeFromURL(url),
    hasHqThumb: null
  }
  const userId = user.id
  return poolQuery('UPDATE vq_videos SET ? WHERE id = ? AND uploader = ?', [post, videoId, userId]).then(
    () => res.json({success: true})
  ).catch(
    error => {
      console.error(error)
      res.status(500).send({error})
    }
  )
})

router.get('/more/playlistVideos', (req, res) => {
  const {videoId, playlistId, shownVideos} = req.query
  const query = `
    SELECT a.id, a.videoId, b.title, b.uploader, b.content, c.username FROM vq_playlistvideos a
    JOIN vq_videos b ON a.videoId = b.id JOIN users c ON b.uploader = c.id
    WHERE a.playlistId = ? AND a.videoId != ?
    AND ${shownVideos.map(id => `a.videoId != ${id}`).join(' AND ')} LIMIT 11
  `
  return poolQuery(query, [playlistId, videoId]).then(
    playlistVideos => {
      let playlistVideosLoadMoreShown = false
      if (playlistVideos.length > 10) {
        playlistVideos.pop()
        playlistVideosLoadMoreShown = true
      }
      res.send({
        playlistVideos,
        playlistVideosLoadMoreShown
      })
    }
  ).catch(
    error => {
      console.error(error)
      res.status(500).send({error})
    }
  )
})

router.get('/page', (req, res) => {
  const {videoId} = req.query
  let query = `
    SELECT a.id AS videoId, a.title, a.description, a.content, a.hasHqThumb, a.isStarred, a.timeStamp,
    a.uploader AS uploaderId, b.username AS uploaderName,
    (SELECT COUNT(id) FROM vq_video_views WHERE videoId = ?) AS videoViews
    FROM vq_videos a LEFT JOIN users b ON a.uploader = b.id
    WHERE a.id = ?
  `
  let finalResults

  return poolQuery(query, [videoId, videoId]).then(
    (rows) => {
      if (rows.length === 0) return Promise.reject('Video Not Found')
      finalResults = rows[0]
      const {videoId} = finalResults
      const questionQuery = 'SELECT * FROM vq_questions WHERE videoId = ?'
      const likeQuery = `
        SELECT a.userId, b.username
        FROM content_likes a LEFT JOIN users b ON a.userId = b.id
        WHERE a.rootType = 'video' AND a.rootId = ?
      `
      return promiseSeries([
        () => poolQuery(questionQuery, videoId).then(
          rows => {
            let questions = rows.map(row => ({
              title: row.title,
              choices: [
                row.choice1,
                row.choice2,
                row.choice3,
                row.choice4,
                row.choice5
              ],
              correctChoice: row.correctChoice
            }))
            return Promise.resolve(questions)
          }
        ),
        () => poolQuery(likeQuery, videoId).then(
          rows => Promise.resolve(rows)
        )
      ])
    }
  ).then(
    results => res.send(Object.assign({}, finalResults, {
      questions: results[0],
      likes: results[1]
    }))
  ).catch(
    error => {
      console.error(error)
      return res.status(500).send({error})
    }
  )
})

router.get('/rightMenu', (req, res) => {
  const {videoId} = req.query
  const playlistQuery = limit => `
    SELECT id, playlistId FROM vq_playlistvideos WHERE videoId = ? ORDER BY id DESC LIMIT ${limit}
  `
  const nextVideoQuery = `
    SELECT a.id, a.videoId, b.title, b.uploader, b.content, c.username FROM vq_playlistvideos a
    JOIN vq_videos b ON a.videoId = b.id JOIN users c ON b.uploader = c.id
    WHERE a.playlistId = ? AND a.id > ? AND a.videoId != ? LIMIT 1
  `
  const relatedVideosQuery = limit => `
    SELECT a.id, a.videoId, b.title, b.uploader, b.content, c.username FROM vq_playlistvideos a
    JOIN vq_videos b ON a.videoId = b.id JOIN users c ON b.uploader = c.id
    WHERE a.playlistId = ? AND a.videoId != ? LIMIT ${limit}
  `
  const otherVideosQuery = `
    SELECT a.id, a.id AS videoId, a.title, a.content, a.uploader, b.username
    FROM vq_videos a JOIN users b ON a.uploader = b.id WHERE a.id != ?
    ORDER BY a.id DESC LIMIT 21
  `
  const removeDuplicates = (array, defaults) => {
    let seen = defaults || {}
    let result = []
    for (let i = 0; i < array.length; i++) {
      let {videoId} = array[i]
      if (seen[videoId] !== 1) {
        seen[videoId] = 1
        result.push(array[i])
      }
    }
    return result
  }

  return promiseSeries([
    () => poolQuery(playlistQuery(11), videoId).then(
      rows => {
        return promiseSeries(rows.map(({playlistId, id}) => {
          return () => poolQuery(nextVideoQuery, [playlistId, id, videoId])
        })).then(
          results => {
            let videos = []
            for (let i = 0; i < results.length; i++) {
              for (let j = 0; j < results[i].length; j++) {
                videos.push(results[i][j])
              }
            }
            return Promise.resolve(removeDuplicates(videos))
          }
        )
      }
    ),
    () => poolQuery(playlistQuery(6), videoId).then(
      rows => {
        return promiseSeries(rows.map(({playlistId, id}) => {
          return () => poolQuery(relatedVideosQuery(11), [playlistId, videoId])
        })).then(
          results => {
            let videos = []
            for (let i = 0; i < results.length; i++) {
              for (let j = 0; j < results[i].length; j++) {
                videos.push(results[i][j])
              }
            }
            return Promise.resolve(removeDuplicates(videos))
          }
        )
      }
    ),
    () => poolQuery(otherVideosQuery, videoId).then(
      rows => Promise.resolve(rows)
    )
  ]).then(
    results => {
      let nextVideos = results[0]
      let defaults = {}
      for (let i = 0; i < nextVideos.length; i++) {
        defaults[nextVideos[i].videoId] = 1
      }
      let relatedVideos = removeDuplicates(results[1], defaults)
      let otherVideos = results[2]
      res.send({nextVideos, relatedVideos, otherVideos})
    }
  ).catch(
    error => {
      console.error(error)
      res.status(500).send({error})
    }
  )
})

router.get('/comments', fetchComments)

router.post('/comments', requireAuth, postComments)

router.put('/comments', requireAuth, editComments)

router.delete('/comments', requireAuth, deleteComments)

router.post('/comments/like', requireAuth, likeComments)

router.get('/replies', fetchReplies)

router.post('/replies', requireAuth, postReplies)

router.delete('/discussions', requireAuth, (req, res) => {
  const {user} = req
  const {discussionId} = req.query
  const query = 'DELETE FROM content_discussions WHERE id = ? AND userId = ?'
  pool.query(query, [discussionId, user.id], err => {
    if (err) {
      console.error(err)
      return res.status(500).send(err)
    }
    res.send({success: true})
  })
})

router.get('/discussions', (req, res) => {
  const {videoId, lastDiscussionId} = req.query
  const limit = 4
  const where = lastDiscussionId ? 'AND a.id < ' + lastDiscussionId + ' ' : ''
  const query = [
    'SELECT a.id, a.userId, a.title, a.description, a.timeStamp, b.username, ',
    '(SELECT COUNT(id) FROM content_comments WHERE discussionId = a.id) AS numComments ',
    'FROM content_discussions a LEFT JOIN users b ON a.userId = b.id ',
    'WHERE a.rootType = \'video\' AND a.rootId = ? ', where,
    'ORDER BY a.id DESC LIMIT ' + limit
  ].join('')
  pool.query(query, videoId, (err, rows) => {
    if (err) {
      console.error(err)
      return res.status(500).send({error: err})
    }
    res.send(rows.map(row => Object.assign({}, row, {
      comments: [],
      loadMoreDiscussionCommentsButton: false
    })))
  })
})

router.get('/discussions/comments', (req, res) => {
  const {discussionId, lastCommentId} = req.query
  const limit = 4
  const where = !!lastCommentId && lastCommentId !== '0' ? 'AND a.id < ' + lastCommentId + ' ' : ''
  const query = `
    SELECT a.id, a.userId, a.content, a.timeStamp, b.username, c.id AS profilePicId
    FROM content_comments a LEFT JOIN users b ON a.userId = b.id LEFT JOIN users_photos c ON
    a.userId = c.userId AND c.isProfilePic = '1'
    WHERE a.discussionId = ? AND a.commentId IS NULL ${where}
    ORDER BY a.id DESC LIMIT ${limit}
  `
  pool.query(query, discussionId, (err, rows) => {
    if (err) {
      console.error(err)
      return res.status(500).send({error: err})
    }
    if (rows.length === 0) {
      return res.send([])
    }
    returnComments(rows, 'video').then(
      commentsArray => res.send(commentsArray)
    ).catch(
      err => {
        console.error(err)
        return res.status(500).send({error: err})
      }
    )
  })
})

router.post('/discussions', requireAuth, (req, res) => {
  const {title, description, videoId} = req.body
  const {user} = req
  const query = 'INSERT INTO content_discussions SET ?'
  const post = {
    title: processedTitleString(title),
    description: !!description && description !== '' ? description : null,
    userId: user.id,
    rootType: 'video',
    rootId: videoId,
    timeStamp: Math.floor(Date.now()/1000)
  }
  pool.query(query, post, (err, result) => {
    if (err) {
      console.error(err)
      return res.status(500).send({error: err})
    }
    res.send(Object.assign({}, post, {
      id: result.insertId,
      username: user.username,
      comments: [],
      loadMoreDiscussionCommentsButton: false
    }))
  })
})

router.post('/discussions/edit', requireAuth, (req, res) => {
  const {user} = req
  const {discussionId, editedTitle, editedDescription} = req.body
  const post = {title: editedTitle, description: editedDescription}
  const query = 'UPDATE content_discussions SET ? WHERE id = ? AND userId = ?'
  pool.query(query, [post, discussionId, user.id], (err) => {
    if (err) {
      console.error(err)
      return res.status(500).send({error: err})
    }
    res.send(post)
  })
})

router.post('/discussions/comments', requireAuth, (req, res) => {
  const {rootId, rootType, discussionId, content} = req.body
  const {user} = req
  const query = 'INSERT INTO content_comments SET ?'
  const post = {
    userId: user.id,
    content,
    timeStamp: Math.floor(Date.now()/1000),
    rootId,
    rootType,
    discussionId
  }
  pool.query(query, post, (err, result) => {
    if (err) {
      console.error(err)
      return res.status(500).send({error: err})
    }
    res.send(Object.assign({}, post, {
      id: result.insertId,
      likes: [],
      replies: [],
      profilePicId: user.profilePicId,
      username: user.username
    }))
  })
})

router.put('/duration', requireAuth, (req, res) => {
  const {user, body: {videoId, seconds}} = req
  console.log(user.id, videoId, seconds)
  res.send({success: true})
})

router.post('/replies/edit', requireAuth, (req, res) => {
  const user = req.user
  const content = req.body.editedReply
  const replyId = req.body.replyId

  pool.query('UPDATE content_comments SET ? WHERE id = ? AND userId = ?', [{content}, replyId, user.id], err => {
    if (err) {
      console.error(err)
      return res.status(500).send({error: err})
    }
    res.send({success: true})
  })
})

router.post('/questions', requireAuth, (req, res) => {
  const user = req.user
  const videoId = req.body.videoId
  const questions = req.body.questions
  async.waterfall([
    (callback) => {
      const userId = user.id
      pool.query('DELETE FROM vq_questions WHERE videoId = ? AND creator = ?', [videoId, userId], err => {
        callback(err, userId)
      })
    },
    (userId, callback) => {
      let taskArray = []
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
      console.error(err)
      return res.status(500).json({error: err})
    }
    res.json({success})
  })
})

router.put('/star', requireAuth, async(req, res) => {
  const {user, body: {videoId}} = req
  try {
    if (user.userType !== 'creator') return res.status(403).send({error: 'Not authorized to perform that action'})
    const [{isStarred}] = await poolQuery(`SELECT isStarred FROM vq_videos WHERE id = ?`, videoId)
    await poolQuery(`UPDATE vq_videos SET ? WHERE id = ?`, [{isStarred: !isStarred}, videoId])
    res.send(!isStarred)
  } catch (error) {
    console.error(error)
    return res.status(500).json({error})
  }
})

router.post('/view', (req, res) => {
  const {videoId, userId} = req.body
  const post = {videoId, userId, timeStamp: Math.floor(Date.now()/1000)}
  pool.query('INSERT INTO vq_video_views SET ?', post, err => {
    if (err) {
      console.error(err)
      return res.status(500).send({error: err})
    }
    res.send({success: true})
  })
})

module.exports = router
