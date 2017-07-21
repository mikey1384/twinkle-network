const {poolQuery} = require('../helpers')
const {
  fetchedVideoCodeFromURL, processedURL,
  processedString, processedTitleString
} = require('./stringHelpers')

module.exports = {
  uploadContents({url, description, title, uploader, type}) {
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
    const post = Object.assign({}, {
      title: processedTitleString(title),
      description: processedString(description),
      uploader,
      timeStamp: Math.floor(Date.now() / 1000),
      content
    })
    return poolQuery(query, post).then(
      result => Promise.resolve({result, post})
    )
  }
}
