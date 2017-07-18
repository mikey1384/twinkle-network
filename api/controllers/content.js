const express = require('express')
const router = express.Router()
const {poolQuery} = require('../helpers')
const {stringIsEmpty} = require('../helpers/stringHelpers')
const {embedKey, embedApiUrl} = require('../siteConfig')
const request = require('request-promise')

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

router.get('/embed', (req, res) => {
  const {url} = req.query
  request({
    uri: embedApiUrl,
    qs: {url, key: embedKey}
  })
    .then(
      body => {
        const data = JSON.parse(body)
        res.send(Object.assign({}, data, {images: data.images || []}))
      }
    ).catch(
      error => {
        res.status(500).send({error})
      }
    )
})

module.exports = router
