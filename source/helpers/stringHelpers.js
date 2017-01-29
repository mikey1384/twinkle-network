/* eslint-disable no-useless-escape */

export function cleanString(string) {
  return string ?
  string
  .replace(/<br\s*[\/]?>/gi, '\n')
  .replace(/&amp;/gi, '&')
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>') : ''
}

export function cleanStringWithURL(string) {
  return string ?
  string
  .replace(/&amp;/gi, '&')
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>')
  .replace(/<br\s*[\/]?>/gi, '\n')
  .replace(/<a[^>]*>|<\/a>/g, '') : ''
}

export function processedString(string) {
  return string ?
  string
  .replace(/<br\s*[\/]?>/gi, '\n')
  .replace(/&amp;/gi, '&')
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/\r?\n/g, '<br>') :
  null
}

export function processedStringWithURL(string) {
  if (!string) return null
  var regex = /(\b(((https?|ftp|file|):\/\/)|www[.])[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig
  var tempString = string
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/\r?\n/g, '<br>')
  .replace(regex, '<a href=\"$1\" target=\"_blank\">$1</a>')
  var newString = ''
  while (tempString.length > 0) {
    var position = tempString.indexOf('href=\"')
    if (position === -1) {
      newString += tempString
      break
    }
    newString += tempString.substring(0, position + 6)
    tempString = tempString.substring(position + 6, tempString.length)
    if (tempString.indexOf('://') > 8 || tempString.indexOf('://') === -1) {
      newString += 'http://'
    }
  }
  return newString
}

export function stringIsEmpty(string) {
  var checkedString = string ? string.replace(/\s/g, '').replace(/\r?\n/g, '') : ''
  return checkedString === ''
}

export function isValidUrl(url) {
  const regex = /(\b(((https?|ftp|file|):\/\/)|www[.])[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig
  return regex.test(url)
}

export function isValidYoutubeUrl(url) {
  let trimOne = url.split('v=')[1]
  let trimTwo = url.split('youtu.be/')[1]
  return typeof trimOne !== 'undefined' || typeof trimTwo !== 'undefined'
}

/* eslint-enable no-useless-escape */
