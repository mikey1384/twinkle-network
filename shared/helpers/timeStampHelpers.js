export function timeSince(date) {
  var date = Number(date);
  var seconds = Math.floor((new Date() - date * 1000) / 1000);
  var interval = Math.floor(seconds / 31536000);
  var s = 's';
  if (interval >= 1) {
    if (interval === 1) {interval = 'a'; s = '';};
    return interval + " year"+s+" ago";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    if (interval === 1) {interval = 'a'; s = '';};
    return interval + " month"+s+" ago";
  }
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    if (interval === 1) {interval = 'a'; s = '';};
    return interval + " day"+s+" ago";
  }
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    if (interval === 1) {interval = 'an'; s = '';};
    return interval + " hour"+s+" ago";
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    if (interval === 1) {interval = 'a'; s = '';};
    return interval + " minute"+s+" ago";
  }
  var string = (seconds <= 0) ? "Just now" : Math.floor(seconds) + " second"+s+" ago"
  return string;
}
