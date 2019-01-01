import { charLimit } from 'constants/defaultValues';
/* eslint-disable no-useless-escape */

export function addCommasToNumber(number) {
  const numArray = `${number}`.split('');
  let result = '';
  numArray.reverse();
  for (let i = 0; i < numArray.length; i++) {
    if (i % 3 === 0 && i !== 0) {
      result = numArray[i] + ',' + result;
    } else {
      result = numArray[i] + result;
    }
  }
  return result;
}

export function capitalize(string = '') {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function cleanString(string) {
  return string
    ? string
        .replace(/<br\s*[\/]?>/gi, '\n')
        .replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
    : '';
}

export function exceedsCharLimit({ inputType, contentType, text }) {
  const limit =
    contentType === 'comment' ||
    contentType === 'rewardComment' ||
    contentType === 'statusMsg'
      ? charLimit[contentType]
      : charLimit[contentType][inputType];
  return text.length > limit
    ? {
        color: 'red',
        borderColor: 'red'
      }
    : undefined;
}

export function renderCharLimit({ inputType, contentType, text }) {
  const limit =
    contentType === 'comment' ||
    contentType === 'rewardComment' ||
    contentType === 'statusMsg'
      ? charLimit[contentType]
      : charLimit[contentType][inputType];
  return `${text.length}/${limit} Characters`;
}

export function turnStringIntoQuestion(string) {
  const toDelete = ['?', ' '];
  while (toDelete.indexOf(string.charAt(string.length - 1)) !== -1) {
    string = string.slice(0, -1);
  }
  return string + '?';
}

export function limitBrs(string) {
  return string.replace(
    /(<br ?\/?>){11,}/gi,
    '<br><br><br><br><br><br><br><br><br><br>'
  );
}

export function renderText(text) {
  let newText = text;
  while (
    newText !== '' &&
    (newText[0] === ' ' ||
      (newText[newText.length - 1] === ' ' &&
        newText[newText.length - 2] === ' '))
  ) {
    if (newText[0] === ' ') {
      newText = newText.substring(1);
    }
    if (
      newText[newText.length - 1] === ' ' &&
      newText[newText.length - 2] === ' '
    ) {
      newText = newText.slice(0, -1);
    }
  }
  return newText;
}

export function removeLineBreaks(string) {
  return string.replace(/\n/gi, ' ').replace(/ {2,}/gi, ' ');
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
    .replace(/(<3 )/g, '❤️ ');
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
    .replace(/(O_O )/gi, '😳 ');
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
    .replace(/(\(alien\))/gi, '👽')
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
    .replace(/(\(spider\))/gi, '🕷️')
    .replace(/(\(devil\))/gi, '😈')
    .replace(/(\(angel\))/gi, '😇')
    .replace(/(\(lol\))/gi, '😂')
    .replace(/(\(diamond\))/gi, '💎')
    .replace(/(\(clap\))/gi, '👏')
    .replace(/(\(star\))/gi, '⭐')
    .replace(/(\(ufo\))/gi, '🛸')
    .replace(/(\(volcano\))/gi, '🌋')
    .replace(/(\(dinosaur\))/gi, '🦖')
    .replace(/(\(palette\))/gi, '🎨')
    .replace(/(\(fox\))/gi, '🦊')
    .replace(/(\(ghost\))/gi, '👻')
    .replace(/(\(crayon\))/gi, '🖍️')
    .replace(/(\(colored pencil\))/gi, '🖍️')
    .replace((/(\(happy\))/gi, '😄 ')
    .replace(/(\(thank you\))/gi, '🙏');
}

export function addEmoji(string) {
  let firstPart = string.substring(0, string.length - 3);
  let lastPart = addTwoLetterEmoji(string.slice(-3));
  let firstResult = `${firstPart}${lastPart}`;

  firstPart = firstResult.substring(0, firstResult.length - 4);
  lastPart = addThreeLetterEmoji(firstResult.slice(-4));
  return `${firstPart}${lastPart}`;
}

export function finalizeEmoji(string) {
  let emojifiedString = addAdvancedEmoji(string + ' ').replace(
    /((\s*\S+)*)\s*/,
    '$1'
  );
  return addEmoji(emojifiedString);
}

export function hashify(string) {
  const stringArray = string.split(' ');
  const hashedString =
    '#' + stringArray.map(string => capitalize(string)).join('');
  return hashedString;
}

export function isValidEmail(email = '') {
  const regex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/g;
  return regex.test(email);
}

export function isValidUrl(url = '') {
  const regex = /^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/g;
  if (url.indexOf('://') === -1 && url.indexOf('www.') === -1) {
    url = 'www.' + url;
  }
  return regex.test(url);
}

export function isValidYoutubeUrl(url = '') {
  const regex = /^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/g;
  if (url.indexOf('://') === -1 && url.indexOf('www.') === -1) {
    url = 'www.' + url;
  }
  let trimOne = url.split('v=')[1];
  let trimTwo = url.split('youtu.be/')[1];
  return (
    regex.test(url) &&
    (typeof trimOne !== 'undefined' || typeof trimTwo !== 'undefined')
  );
}

export function isValidYoutubeChannelUrl(url = '') {
  const regex = /^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/g;
  const trim = url.split('youtube.com/')[1];
  if (url.indexOf('://') === -1 && url.indexOf('www.') === -1) {
    url = 'www.' + url;
  }
  return regex.test(url) && typeof trim !== 'undefined';
}

export function processedQueryString(string) {
  return string
    ? string
        .replace(/\r?\n/g, '<br>')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\r?\n/g, '<br>')
    : null;
}

export function processedString(string) {
  return string
    ? string
        .replace(/~/g, '&tilde;')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
    : null;
}

export function processedStringWithURL(string) {
  if (typeof string !== 'string') return string || null;
  const maxChar = 100;
  const trimmedString = string =>
    string.length > maxChar ? `${string.substring(0, maxChar)}...` : string;
  const regex = /(\b(((https?|ftp|file|):\/\/)|www[.])[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  let tempString = string
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\r?\n/g, '<br>')
    .replace(regex, `<a href=\"$1\" target=\"_blank\">$1</a>`);
  let newString = '';
  while (tempString.length > 0) {
    let hrefPos = tempString.indexOf('href="');
    if (hrefPos === -1) {
      let headPos = tempString.indexOf('target="_blank">');
      let tailPos = tempString.indexOf('</a>');
      if (headPos !== -1) {
        let wrapperHead = tempString.substring(0, headPos + 16);
        let url = tempString.substring(headPos + 16, tailPos);
        let wrapperTail = tempString.substring(tailPos, tempString.length);
        newString += `${wrapperHead}${trimmedString(url)}${wrapperTail}`;
      } else {
        newString += tempString;
      }
      break;
    }

    newString += tempString.substring(0, hrefPos + 6);
    tempString = tempString.substring(hrefPos + 6, tempString.length);
    if (tempString.indexOf('://') > 8 || tempString.indexOf('://') === -1) {
      newString += 'http://';
    }
  }
  return newString;
}

export function processedURL(url) {
  if (url.indexOf('://') === -1) {
    url = 'http://' + url;
  }
  return url;
}

export function queryStringForArray({ array, originVar, destinationVar }) {
  return `${array
    .map(elem => `${destinationVar}[]=${originVar ? elem[originVar] : elem}`)
    .join('&')}`;
}

export function stringIsEmpty(string) {
  const checkedString = string
    ? string.replace(/\s/g, '').replace(/\r?\n/g, '')
    : '';
  return checkedString === '';
}

export function trimUrl(url) {
  const trimHttp = url?.split('//')[1] || url?.split('//')[0];
  const trimWWW = trimHttp?.split('www.')[1] || trimHttp?.split('www.')[0];
  return trimWWW;
}

export function trimWhiteSpaces(text) {
  let newText = text;
  while (
    newText !== '' &&
    (newText[0] === ' ' || newText[newText.length - 1] === ' ')
  ) {
    if (newText[0] === ' ') {
      newText = newText.substring(1);
    }
    if (newText[newText.length - 1] === ' ') {
      newText = newText.slice(0, -1);
    }
  }
  return newText;
}

export function fetchedVideoCodeFromURL(url) {
  let videoCode = '';
  if (typeof url.split('v=')[1] !== 'undefined') {
    let trimmedUrl = url.split('v=')[1].split('#')[0];
    videoCode = trimmedUrl.split('&')[0];
  } else {
    let trimmedUrl = url.split('youtu.be/')[1].split('#')[0];
    videoCode = trimmedUrl.split('&')[0].split('?')[0];
  }
  return videoCode;
}

/* eslint-enable no-useless-escape */
