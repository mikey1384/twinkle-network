export const defaultChatSubject = 'Introduce yourself!';
export const rewardValue = {
  star: 200
};
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

export const returnMaxStars = ({ type, rootType }) => {
  let maxStars = 5;
  return maxStars;
};
