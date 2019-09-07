export const initialHomeInputState = {
  subject: {
    attachment: undefined,
    descriptionInputShown: false,
    details: {
      title: '',
      description: '',
      secretAnswer: '',
      rewardLevel: 0
    },
    hasSecretAnswer: false
  },
  content: {
    alreadyPosted: false,
    descriptionFieldShown: false,
    form: {
      url: '',
      isVideo: false,
      title: '',
      description: '',
      rewardLevel: 0
    },
    titleFieldShown: false,
    urlHelper: '',
    urlError: ''
  }
};

export const initialSubjectState = {};
export const initialCommentState = {};
export const initialVideoState = {};
export const initialUrlState = {};
export const initialUserState = {};
