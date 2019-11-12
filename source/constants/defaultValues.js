export const defaultChatSubject = 'Introduce yourself!';
export const rewardValue = {
  star: 200
};
export const cloudFrontURL = 'https://d3jvoamd2k4p0s.cloudfront.net';
export const clientVersion = '1.1.2';
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
export const LAST_ONLINE_FILTER_LABEL = 'Last Online';
export const RANKING_FILTER_LABEL = 'Ranking';

export const returnMaxStars = ({ rewardLevel }) => {
  let maxStars = 5;
  if (rewardLevel > 0) {
    maxStars = 10 * rewardLevel;
  }
  return maxStars;
};
