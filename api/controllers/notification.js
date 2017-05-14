const express = require('express')
const router = express.Router()
const {requireAuth} = require('../auth')
const {poolQuery} = require('../helpers')
const currentVersion = 0.10

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
        a.rootType = 'comment',
        (SELECT rootType FROM content_comments WHERE id = a.rootId),
        NULL
      ) AS rootRootType,
      IF(
        a.rootType = 'comment',
        (SELECT rootId FROM content_comments WHERE id = a.rootId),
        NULL
      ) AS rootRootId,
      IF(
        a.rootType = 'video',
        (SELECT title FROM vq_videos WHERE id = a.rootId),
        (IF(
          a.rootType = 'comment',
          (SELECT content FROM content_comments WHERE id = a.rootId),
          (SELECT title FROM content_urls WHERE id = a.rootId))
        )
      ) AS rootTitle,
      IF(
        a.rootCommentId IS NOT NULL,
        (SELECT content FROM content_comments WHERE id = a.contentId),
        NULL
      ) AS commentContent,
      IF(
        a.rootCommentId IS NOT NULL,
        (SELECT userId FROM content_comments WHERE id = a.contentId),
        NULL
      ) AS rootCommentUploader
    FROM noti_feeds a
      JOIN users b ON a.uploaderId = b.id
    WHERE
      (
        IF(
          a.rootType = 'video',
          (SELECT uploader FROM vq_videos WHERE id = a.rootId),
          (IF(
            a.rootType = 'comment',
            (SELECT userId FROM content_comments WHERE id = a.rootId),
            (SELECT uploader FROM content_urls WHERE id = a.rootId))
          )
        ) = ?
        OR
          (SELECT userId FROM content_comments WHERE id = a.rootCommentId) = ?
      )
      AND uploaderId != ? ORDER BY id DESC LIMIT 20
  `
  return poolQuery(query, [userId, userId, userId]).then(
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
