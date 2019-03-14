export const defaultChatSubject = 'Introduce yourself!';
export const rewardValue = {
  star: 200
};
import { Color } from './css';

export const clientVersion = '0.2.14';
export const charLimit = {
  chat: {
    subject: 200,
    message: 5000
  },
  comment: 10000,
  playlist: {
    title: 200,
    description: 5000
  },
  videoQuestion: {
    title: 2000,
    choice: 2000
  },
  subject: {
    title: 300,
    description: 20000
  },
  rewardComment: 5000,
  statusMsg: 500,
  url: {
    title: 300,
    description: 20000,
    url: 1000
  },
  video: {
    title: 200,
    description: 10000,
    url: 300
  }
};

export const profileThemes = {
  black: {
    color: Color.black(),
    cover: Color.black()
  },
  logoBlue: {
    color: Color.logoBlue(),
    cover: Color.logoBlue()
  },
  green: {
    color: Color.green(),
    cover: Color.green()
  },
  orange: {
    color: Color.orange(),
    cover: Color.orange()
  },
  pink: {
    color: Color.pink(),
    cover: Color.pink()
  },
  rose: {
    color: Color.rose(),
    cover: Color.rose()
  },
  white: {
    color: '#fff',
    cover: '#fff'
  }
};

export const returnMaxStars = ({ difficulty }) => {
  let maxStars = 5;
  if (difficulty > 0) {
    maxStars = 10 * difficulty;
  }
  return maxStars;
};
