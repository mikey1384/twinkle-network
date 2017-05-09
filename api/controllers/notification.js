const express = require('express')
const router = express.Router()
const {requireAuth} = require('../auth')
const {poolQuery} = require('../helpers')
const currentVersion = 0.05

router.get('/', requireAuth, (req, res) => {
  const {id: userId} = req.user
  const query = `
    SELECT
      a.id,
      a.type,
      a.uploaderId AS userId,
      b.username,
      a.timeStamp,
      a.rootType,
      a.rootId,
      IF(
        a.rootType = 'video',
        (SELECT title FROM vq_videos WHERE id = a.rootId),
        (SELECT title FROM content_urls WHERE id = a.rootId)
      ) AS rootTitle,
      IF(
        a.rootType = 'video',
        (SELECT uploader FROM vq_videos WHERE id = a.rootId),
        (SELECT uploader FROM content_urls WHERE id = a.rootId)
      ) AS rootUploader
      FROM noti_feeds a
      JOIN users b ON a.uploaderId = b.id
      WHERE
      IF(
        a.rootType = 'video',
        (SELECT uploader FROM vq_videos WHERE id = a.rootId),
        (SELECT uploader FROM content_urls WHERE id = a.rootId)
      ) = ?
      AND uploaderId != ? ORDER BY id DESC LIMIT 20
  `
  return poolQuery(query, [userId, userId]).then(
    rows => res.send(rows)
  ).catch(
    error => {
      console.error(error)
      res.status(500).send({error})
    }
  )
})

router.get('/version', (req, res) => {
  const {version} = req.query
  res.send({match: Number(version) === currentVersion})
})

module.exports = router
