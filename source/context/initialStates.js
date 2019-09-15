export const initialCommentState = {};
export const initialContentState = {};
export const initialHomeInputState = {
  subject: {
    attachment: undefined,
    descriptionFieldShown: false,
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
export const initialHomeState = {
  category: 'uploads',
  feeds: [],
  loadMoreButton: false,
  subFilter: 'all'
};
export const initialProfileState = {
  notables: {
    feeds: [],
    loadMoreButton: false
  },
  posts: {
    all: [],
    allLoaded: false,
    allLoadMoreButton: false,
    comments: [],
    commentsLoaded: false,
    commentsLoadMoreButton: false,
    likes: [],
    likesLoaded: false,
    likesLoadMoreButton: false,
    subjects: [],
    subjectsLoaded: false,
    subjectsLoadMoreButton: false,
    videos: [],
    videosLoaded: false,
    videosLoadMoreButton: false,
    links: [],
    linksLoaded: false,
    linksLoadMoreButton: false
  }
};
export const initialViewState = {
  pageVisible: true,
  scrollPositions: {}
};
