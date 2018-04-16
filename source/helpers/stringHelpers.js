import { charLimit } from 'constants/defaultValues'

/* eslint-disable no-useless-escape */

export function cleanString(string) {
  return string
    ? string
        .replace(/<br\s*[\/]?>/gi, '\n')
        .replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
    : ''
}

export function exceedsCharLimit({ inputType, contentType, text }) {
  const limit =
    contentType === 'comment'
      ? charLimit.comment
      : charLimit[contentType][inputType]
  return text.length > limit
    ? {
        color: 'red',
        borderColor: 'red'
      }
    : null
}

export function renderCharLimit({ inputType, contentType, text }) {
  const limit =
    contentType === 'comment'
      ? charLimit.comment
      : charLimit[contentType][inputType]
  return `${text.length}/${limit} Characters`
}

export function turnStringIntoQuestion(string) {
  const toDelete = ['?', ' ']
  while (toDelete.indexOf(string.charAt(string.length - 1)) !== -1) {
    string = string.slice(0, -1)
  }
  return string + '?'
}

export function limitBrs(string) {
  return string.replace(
    /(<br ?\/?>){11,}/gi,
    '<br><br><br><br><br><br><br><br><br><br>'
  )
}

export function addTwoLetterEmoji(string) {
  return string
    .replace(/(:\) )/g, '😊 ')
    .replace(/(;\) )/g, '😉 ')
    .replace(/(XD )/g, '😆 ')
    .replace(/(:D )/g, '😄 ')
    .replace(/(:P )/gi, '😛 ')
    .replace(/(:\( )/g, '🙁 ')
    .replace(/(:O )/gi, '😲 ')
    .replace(/(<3 )/g, '❤️ ')
}

export function addThreeLetterEmoji(string) {
  return string
    .replace(/(:-\) )/g, '😊 ')
    .replace(/(;-\) )/g, '😉 ')
    .replace(/(X-D )/g, '😆 ')
    .replace(/(:-D )/g, '😄 ')
    .replace(/(:-P )/gi, '😛 ')
    .replace(/(:-\( )/g, '🙁 ')
    .replace(/(:-O )/gi, '😲 ')
    .replace(/(O_O )/gi, '😳 ')
}

export function addAdvancedEmoji(string) {
  return string
    .replace(/(:\) )/g, '😊 ')
    .replace(/(;\) )/g, '😉 ')
    .replace(/(XD )/g, '😆 ')
    .replace(/(:D )/g, '😄 ')
    .replace(/(:P )/gi, '😛 ')
    .replace(/(:\( )/g, '🙁 ')
    .replace(/(:O )/gi, '😲 ')
    .replace(/(<3 )/g, '❤️ ')
    .replace(/(:-\) )/g, '😊 ')
    .replace(/(;-\) )/g, '😉 ')
    .replace(/(X-D )/g, '😆 ')
    .replace(/(:-D )/g, '😄 ')
    .replace(/(:-P )/gi, '😛 ')
    .replace(/(:-\( )/g, '🙁 ')
    .replace(/(:-O )/gi, '😲 ')
    .replace(/(O_O )/gi, '😳 ')
    .replace(/(\(heart\))/gi, '❤️')
    .replace(/(\(zzz\))/gi, '💤')
    .replace(/(\(thumbs\))/gi, '👍')
    .replace(/(\(sunglasses\))/gi, '😎')
    .replace(/(\(ok\))/gi, '👌')
    .replace(/(\(hi\))/gi, '👋')
    .replace(/(\(hello\))/gi, '👋')
    .replace(/(\(mad\))/gi, '😡')
    .replace(/(\(angry\))/gi, '😡')
    .replace(/(\(perfect\))/gi, '💯')
    .replace(/(\(bye\))/gi, '👋')
    .replace(/(\(wave\))/gi, '👋')
    .replace(/(\(fear\))/gi, '😱')
    .replace(/(\(curious\))/gi, '🤔')
    .replace(/(\(horror\))/gi, '😱')
    .replace(/(\(cry\))/gi, '😭')
    .replace(/(\(sad\))/gi, '😭')
    .replace(/(\(chicken\))/gi, '🐔')
    .replace(/(\(dog\))/gi, '🐶')
    .replace(/(\(ant\))/gi, '🐜')
    .replace(/(\(cat\))/gi, '🐱')
    .replace(/(\(bee\))/gi, '🐝')
    .replace(/(\(turtle\))/gi, '🐢')
    .replace(/(\(monkey\))/gi, '🐵')
    .replace(/(\(pig\))/gi, '🐷')
    .replace(/(\(elephant\))/gi, '🐘')
    .replace(/(\(moo\))/gi, '🐮')
    .replace(/(\(cow\))/gi, '🐮')
    .replace(/(\(horse\))/gi, '🐴')
    .replace(/(\(penguin\))/gi, '🐧')
    .replace(/(\(bunny\))/gi, '🐰')
    .replace(/(\(rabbit\))/gi, '🐰')
    .replace(/(\(devil\))/gi, '😈')
    .replace(/(\(angel\))/gi, '😇')
    .replace(/(\(lol\))/gi, '😂')
    .replace(/(\(diamond\))/gi, '💎')
    .replace(/(\(clap\))/gi, '👏')
    .replace(/(\(star\))/gi, '⭐')
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
  let emojifiedString = addAdvancedEmoji(string + ' ').replace(
    /((\s*\S+)*)\s*/,
    '$1'
  )
  return addEmoji(emojifiedString)
}

export function processedQueryString(string) {
  return string
    ? string
        .replace(/\r?\n/g, '<br>')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\r?\n/g, '<br>')
    : null
}

export function processedString(string) {
  return string
    ? string
        .replace(/~/g, '&tilde;')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
    : null
}

export function processedStringWithURL(string) {
  if (typeof string !== 'string') return string || null
  const maxChar = 100
  const trimmedString = string =>
    string.length > maxChar ? `${string.substring(0, maxChar)}...` : string
  const regex = /(\b(((https?|ftp|file|):\/\/)|www[.])[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi
  let tempString = string
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\r?\n/g, '<br>')
    .replace(regex, `<a href=\"$1\" target=\"_blank\">$1</a>`)
  let newString = ''
  while (tempString.length > 0) {
    let hrefPos = tempString.indexOf('href="')
    if (hrefPos === -1) {
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

    newString += tempString.substring(0, hrefPos + 6)
    tempString = tempString.substring(hrefPos + 6, tempString.length)
    if (tempString.indexOf('://') > 8 || tempString.indexOf('://') === -1) {
      newString += 'http://'
    }
  }
  return newString
}

export function processedURL(url) {
  if (url.indexOf('://') === -1) {
    url = 'http://' + url
  }
  return url
}

export function stringIsEmpty(string) {
  var checkedString = string
    ? string.replace(/\s/g, '').replace(/\r?\n/g, '')
    : ''
  return checkedString === ''
}

export function trimWhiteSpaces(text) {
  let newText = text
  while (
    newText !== '' &&
    (newText[0] === ' ' || newText[newText.length - 1] === ' ')
  ) {
    if (newText[0] === ' ') {
      newText = newText.substring(1)
    }
    if (newText[newText.length - 1] === ' ') {
      newText = newText.slice(0, -1)
    }
  }
  return newText
}

export function isValidUrl(url) {
  const regex = /(\b(((https?|ftp|file|):\/\/)|www[.])[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi
  return regex.test(url)
}

export function isValidYoutubeUrl(url) {
  const regex = /(\b(((https?|ftp|file|):\/\/)|www[.])[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi
  let trimOne = url.split('v=')[1]
  let trimTwo = url.split('youtu.be/')[1]
  return (
    regex.test(url) &&
    (typeof trimOne !== 'undefined' || typeof trimTwo !== 'undefined')
  )
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

export function queryStringForArray(array, originVar, destinationVar) {
  return `${array
    .map(elem => `${destinationVar}[]=${elem[originVar]}`)
    .join('&')}`
}

/* eslint-enable no-useless-escape */
