/* eslint-disable no-useless-escape */

module.exports = {
  isValidUsername(username) {
    var pattern = new RegExp(/^[a-zA-Z0-9]+$/)
    return username.length < 30 && pattern.test(username)
  },

  fetchedVideoCodeFromURL(url) {
    let videoCode = ''
    if (typeof url.split('v=')[1] !== 'undefined') {
      let trimmedUrl = url.split('v=')[1].split('#')[0]
      videoCode = trimmedUrl.split('&')[0]
    } else {
      let trimmedUrl = url.split('youtu.be/')[1].split('#')[0]
      videoCode = trimmedUrl.split('&')[0].split('?')[0]
    }
    return videoCode
  },

  processedTitleString(string) {
    return string
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  },

  processedURL(url) {
    if (url.indexOf('://') === -1) {
      url = 'http://' + url
    }
    return url
  },

  trimWhiteSpaces(text) {
    let newText = text
    while (
      newText !== '' && (newText[0] === ' ' || newText[newText.length - 1] === ' ')
    ) {
      if (newText[0] === ' ') {
        newText = newText.substring(1)
      }
      if (newText[newText.length - 1] === ' ') {
        newText = newText.slice(0, -1)
      }
    }
    return newText
  },

  cleanString(string) {
    var regexBr = /<br\s*[\/]?>/gi
    var regexAnchor = /<a[^>]*>|<\/a>/g
    var cleanedString = string.replace(regexBr, '\n').replace(regexAnchor, '')
    return cleanedString
  },

  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  },

  stringIsEmpty(string) {
    var checkedString = string.replace(/\s/g, '').replace(/\r?\n/g, '')
    return checkedString === ''
  }
}

/* eslint-enable no-useless-escape */
