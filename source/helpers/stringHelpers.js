/* eslint-disable no-useless-escape */

export function cleanString(string) {
  return string ? string
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>') : ''
}

export function cleanStringWithURL(string) {
  return string ? string
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<a[^>]*>|<\/a>/g, '') : ''
}

export function limitBrs(string) {
  return string.replace(/(<br ?\/?>){4,}/gi, '<br><br><br>')
}

export function addTwoLetterEmoji(string) {
  return string
    .replace(/(:\))/g, '😊 ')
    .replace(/(;\))/g, '😉 ')
    .replace(/(XD)/g, '😆 ')
    .replace(/(:D)/g, '😄 ')
    .replace(/(:P)/gi, '😛 ')
    .replace(/(:\()/g, '🙁 ')
    .replace(/(:O)/gi, '😲 ')
    .replace(/(<3)/g, '❤️ ')
}

export function addThreeLetterEmoji(string) {
  return string
    .replace(/(:-\))/g, '😊 ')
    .replace(/(;-\))/g, '😉 ')
    .replace(/(X-D)/g, '😆 ')
    .replace(/(:-D)/g, '😄 ')
    .replace(/(:-P)/gi, '😛 ')
    .replace(/(:-\()/g, '🙁 ')
    .replace(/(:-O)/gi, '😲 ')
    .replace(/(O_O)/gi, '😳 ')
}

export function addAdvancedEmoji(string) {
  return string
    .replace(/(:\) )/g, '😊  ')
    .replace(/(;\) )/g, '😉  ')
    .replace(/(XD )/g, '😆  ')
    .replace(/(:D )/g, '😄  ')
    .replace(/(:P )/gi, '😛  ')
    .replace(/(:\( )/g, '🙁  ')
    .replace(/(:O )/gi, '😲  ')
    .replace(/(<3 )/g, '❤️  ')
    .replace(/(:-\) )/g, '😊  ')
    .replace(/(;-\) )/g, '😉  ')
    .replace(/(X-D )/g, '😆  ')
    .replace(/(:-D )/g, '😄  ')
    .replace(/(:-P )/gi, '😛  ')
    .replace(/(:-\( )/g, '🙁  ')
    .replace(/(:-O )/gi, '😲  ')
    .replace(/(O_O )/gi, '😳  ')
    .replace(/(\(heart\))/gi, '❤️ ')
    .replace(/(\(zzz\))/gi, '💤 ')
    .replace(/(\(thumbs\))/gi, '👍 ')
    .replace(/(\(sunglasses\))/gi, '😎 ')
    .replace(/(\(ok\))/gi, '👌 ')
    .replace(/(\(hi\))/gi, '👋 ')
    .replace(/(\(hello\))/gi, '👋 ')
    .replace(/(\(mad\))/gi, '😡 ')
    .replace(/(\(angry\))/gi, '😡 ')
    .replace(/(\(perfect\))/gi, '💯 ')
    .replace(/(\(bye\))/gi, '👋 ')
    .replace(/(\(wave\))/gi, '👋 ')
    .replace(/(\(fear\))/gi, '😱 ')
    .replace(/(\(horror\))/gi, '😱 ')
    .replace(/(\(cry\))/gi, '😭 ')
    .replace(/(\(sad\))/gi, '😭 ')
    .replace(/(\(chicken\))/gi, '🐔 ')
    .replace(/(\(dog\))/gi, '🐶 ')
    .replace(/(\(ant\))/gi, '🐜 ')
    .replace(/(\(cat\))/gi, '🐱 ')
    .replace(/(\(bee\))/gi, '🐝 ')
    .replace(/(\(turtle\))/gi, '🐢 ')
    .replace(/(\(monkey\))/gi, '🐵 ')
    .replace(/(\(pig\))/gi, '🐷 ')
    .replace(/(\(elephant\))/gi, '🐘 ')
    .replace(/(\(moo\))/gi, '🐮 ')
    .replace(/(\(cow\))/gi, '🐮 ')
    .replace(/(\(horse\))/gi, '🐴 ')
    .replace(/(\(penguin\))/gi, '🐧 ')
    .replace(/(\(bunny\))/gi, '🐰 ')
    .replace(/(\(rabbit\))/gi, '🐰 ')
    .replace(/(\(devil\))/gi, '😈 ')
    .replace(/(\(angel\))/gi, '😇 ')
    .replace(/(\(lol\))/gi, '😂 ')
    .replace(/(\(diamond\))/gi, '💎 ')
}

export function addEmoji(string) {
  let firstPart = string.substring(0, string.length - 3)
  let lastPart = addTwoLetterEmoji(string.slice(-3))
  let firstResult = `${firstPart}${lastPart}`

  firstPart = firstResult.substring(0, firstResult.length - 4)
  lastPart = addThreeLetterEmoji(firstResult.slice(-4))
  return `${firstPart}${lastPart}`
}

export function finalizeEmoji(string) {
  let emojifiedString = addAdvancedEmoji(string)
  return addEmoji(emojifiedString)
}

export function processedString(string) {
  return string ? string
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
  if (typeof string !== 'string') return string || null
  const maxChar = 100
  const trimmedString = string => string.length > maxChar ? `${string.substring(0, maxChar)}...` : string
  var regex = /(\b(((https?|ftp|file|):\/\/)|www[.])[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig
  var tempString = string
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\r?\n/g, '<br>')
    .replace(regex, `<a href=\"$1\" target=\"_blank\">$1</a>`)
  var newString = ''
  while (tempString.length > 0) {
    var position = tempString.indexOf('href=\"')
    if (position === -1) {
      let headPos = tempString.indexOf('target="_blank">')
      let tailPos = tempString.indexOf('</a>')
      if (headPos !== -1) {
        let wrapperHead = tempString.substring(0, headPos + 16)
        let url = tempString.substring(headPos + 16, tailPos)
        let wrapperTail = tempString.substring(tailPos, tempString.length)
        newString += `${wrapperHead}${trimmedString(url)}${wrapperTail}`
      } else {
        newString += tempString
      }
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

export function fetchedVideoCodeFromURL(url) {
  let videoCode = ''
  if (typeof url.split('v=')[1] !== 'undefined') {
    let trimmedUrl = url.split('v=')[1].split('#')[0]
    videoCode = trimmedUrl.split('&')[0]
  } else {
    let trimmedUrl = url.split('youtu.be/')[1].split('#')[0]
    videoCode = trimmedUrl.split('&')[0].split('?')[0]
  }
  return videoCode
}

/* eslint-enable no-useless-escape */
