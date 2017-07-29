const express = require('express')
const router = express.Router()
const {requireAuth} = require('../auth')
const {poolQuery} = require('../helpers')
const currentVersion = 0.054

router.get('/', requireAuth, (req, res) => {
  const {id: userId} = req.user
  const notiQuery = `
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
        (SELECT userId FROM content_comments WHERE id = a.rootCommentId),
        NULL
      ) AS rootCommentUploader,
      c.title AS discussionTitle,
      c.userId AS discussionUploader
    FROM noti_feeds a
      JOIN users b ON a.uploaderId = b.id
      LEFT JOIN content_discussions c ON c.id = a.discussionId
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
        OR
          (SELECT userId FROM content_discussions WHERE id = a.discussionId) = ?
      )
      AND uploaderId != ? ORDER BY id DESC LIMIT 20
  `
  const chatSubjectQuery = `
    SELECT a.userId, b.username, a.content, a.timeStamp, a.reloadedBy,
    c.username AS reloaderName, a.reloadTimeStamp
    FROM content_chat_subjects a
    JOIN users b ON a.userId = b.id
    LEFT JOIN users c ON a.reloadedBy = c.id
    WHERE a.id = (SELECT currentSubjectId FROM msg_channels WHERE id = 2 LIMIT 1)
  `
  return Promise.all([
    poolQuery(notiQuery, [userId, userId, userId, userId]),
    poolQuery(chatSubjectQuery)
  ]).then(
    ([notifications, [currentChatSubject]]) => res.send({
      notifications,
      currentChatSubject: Object.assign({}, currentChatSubject, {loaded: true})
    })
  ).catch(
    error => {
      console.error(error)
      res.status(500).send({error})
    }
  )
})

router.get('/chatSubject', (req, res) => {
  const query = `
    SELECT a.userId, b.username, a.content, a.timeStamp, a.reloadedBy,
    c.username AS reloaderName, a.reloadTimeStamp
    FROM content_chat_subjects a
    JOIN users b ON a.userId = b.id
    LEFT JOIN users c ON a.reloadedBy = c.id
    WHERE a.id = (SELECT currentSubjectId FROM msg_channels WHERE id = 2 LIMIT 1)
  `
  return poolQuery(query).then(
    ([result]) => res.send(Object.assign({}, result, {loaded: true}))
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
