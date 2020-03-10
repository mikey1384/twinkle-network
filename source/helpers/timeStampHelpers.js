export function timeSince(dateText) {
  const date = Number(dateText);
  const seconds = Math.floor((new Date() - date * 1000) / 1000);
  let interval = Math.floor(seconds / 31536000);
  let s = 's';
  if (interval >= 1) {
    if (interval === 1) {
      interval = 'a';
      s = '';
    }
    return interval + ' year' + s + ' ago';
  }
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    if (interval === 1) {
      interval = 'a';
      s = '';
    }
    return interval + ' month' + s + ' ago';
  }
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    if (interval === 1) {
      interval = 'a';
      s = '';
    }
    return interval + ' day' + s + ' ago';
  }
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    if (interval === 1) {
      interval = 'an';
      s = '';
    }
    return interval + ' hour' + s + ' ago';
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    if (interval === 1) {
      interval = 'a';
      s = '';
    }
    return interval + ' minute' + s + ' ago';
  }
  s = Math.floor(seconds) > 1 ? 's' : '';
  const string =
    seconds <= 0 ? 'Just now' : Math.floor(seconds) + ` second${s} ago`;
  return string;
}
