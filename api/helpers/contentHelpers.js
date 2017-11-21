const {poolQuery} = require('../helpers')
const {
  fetchedVideoCodeFromURL, processedURL
} = require('./stringHelpers')
const {embedKey, embedApiUrl} = require('../siteConfig')
const request = require('request-promise-native')

module.exports = {
  postContents({url, description, title, uploader, type}) {
    let content
    let query
    switch (type) {
      case 'video':
        query = 'INSERT INTO vq_videos SET ?'
        content = fetchedVideoCodeFromURL(url)
        break
      case 'url':
        query = 'INSERT INTO content_urls SET ?'
        content = processedURL(url)
        break
      default: return Promise.reject('Content type invalid')
    }
    const post = {
      title,
      description,
      uploader,
      timeStamp: Math.floor(Date.now() / 1000),
      content
    }
    return poolQuery(query, post).then(
      result => Promise.resolve({result, post})
    ).catch(
      error => Promise.reject(error)
    )
  },
  postQuestions(req) {
    const {user, body: {question}} = req
    const query = `INSERT INTO content_questions SET ?`
    const post = {
      userId: user.id,
      content: question,
      timeStamp: Math.floor(Date.now() / 1000)
    }
    return poolQuery(query, post).then(
      result => Promise.resolve({result, post})
    ).catch(
      error => Promise.reject(error)
    )
  },
  getThumbImageFromEmbedApi({url}) {
    return request({
      uri: embedApiUrl,
      qs: {url, key: embedKey}
    }).then(
      response => {
        const data = JSON.parse(response)
        const {images = [], title = '', description = '', site = ''} = data
        const image = images[0] || {url: ''}
        return Promise.resolve({image, title, description, site})
      }
    )
  }
}
