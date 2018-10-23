export const defaultChatSubject = 'Introduce yourself!';
export const rewardValue = {
  star: 200
};
import { Color } from './css';

export const charLimit = {
  chat: {
    subject: 200,
    message: 5000
  },
  comment: 10000,
  discussion: {
    title: 300,
    description: 5000
  },
  playlist: {
    title: 200,
    description: 5000
  },
  videoQuestion: {
    title: 2000,
    choice: 2000
  },
  question: {
    title: 200,
    description: 5000
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
  logoBlue: {
    background: Color.logoBlue(),
    color: '#fff'
  },
  green: {
    background: Color.green(),
    color: '#fff'
  },
  orange: {
    background: Color.orange(),
    color: '#fff'
  },
  pink: {
    background: Color.pink(),
    color: '#fff'
  }
};
export const returnMaxStars = ({ difficulty }) => {
  let maxStars = 5;
  if (difficulty > 0) {
    maxStars = 10 * difficulty;
  }
  return maxStars;
};
