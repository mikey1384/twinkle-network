const express = require('express')
const router = express.Router()
const {poolQuery} = require('../helpers')
const {stringIsEmpty} = require('../helpers/stringHelpers')
const {getThumbImageFromEmbedApi} = require('../helpers/contentHelpers')
const {googleKey} = require('../siteConfig')
const request = require('request-promise-native')

router.get('/search', (req, res) => {
  const searchQuery = req.query.query
  if (stringIsEmpty(searchQuery) || searchQuery.length < 2) return res.send({result: []})
  const query = `
    SELECT id, type, title AS label FROM (
      SELECT id, 'video' AS type, title FROM vq_videos
      UNION
      SELECT id, 'link' AS type, title FROM content_urls
    ) AS u WHERE u.title LIKE ? ORDER BY u.id DESC LIMIT 20
  `
  return poolQuery(query, '%' + searchQuery + '%').then(
    result => res.send({result})
  ).catch(
    err => {
      console.error(err)
      return res.status(500).send({error: err})
    }
  )
})

router.put('/embed', (req, res) => {
  const {linkId, url} = req.body
  return getThumbImageFromEmbedApi({url}).then(
    (response) => {
      const {image = {url: ''}, title = '', description = '', site = url} = response
      const post = {thumbUrl: image.url, actualTitle: title, actualDescription: description, siteUrl: site}
      poolQuery(`UPDATE content_urls SET ? WHERE id = ?`, [post, linkId])
      res.send(response)
    }
  ).catch(
    error => {
      res.status(500).send({error})
    }
  )
})

router.get('/videoThumb', (req, res) => {
  const {videoCode} = req.query
  request({
    uri: `https://www.googleapis.com/youtube/v3/videos`,
    qs: {part: 'snippet', id: videoCode, key: googleKey}
  })
    .then(
      response => {
        const {items: [{snippet: {thumbnails}}]} = JSON.parse(response)
        const payload = thumbnails.maxres ? thumbnails.maxres.url : null
        res.send({payload})
      }
    ).catch(
      error => {
        res.status(500).send({error})
      }
    )
})

module.exports = router
