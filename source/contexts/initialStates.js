export const initialChatState = {
  loaded: false,
  selectedChannelId: null,
  currentChannel: {},
  channels: [],
  messages: [],
  userSearchResults: [],
  chatSearchResults: [],
  loadMoreMessages: false,
  channelLoadMoreButton: false,
  numUnreads: 0,
  msgsWhileInvisible: 0,
  recepientId: null,
  recentChessMessage: undefined,
  subject: {},
  subjectSearchResults: [],
  filesBeingUploaded: {}
};
export const initialNotiState = {
  versionMatch: true,
  notifications: [],
  rewards: [],
  currentChatSubject: {},
  loadMore: {
    notifications: false,
    rewards: false
  },
  numNewNotis: 0,
  numNewPosts: 0,
  rankingsLoaded: false,
  allRanks: [],
  top30s: [],
  socketConnected: false,
  rankModifier: 0,
  totalRewardAmount: 0,
  updateDetail: ''
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
export const initialScrollState = {
  scrollPositions: {}
};
export const initialUserState = {
  authLevel: 0,
  canDelete: false,
  canEdit: false,
  canEditRewardLevel: false,
  canStar: false,
  canEditPlaylists: false,
  canPinPlaylists: false,
  defaultSearchFilter: '',
  hideWatched: false,
  isCreator: false,
  loadMoreButton: false,
  loggedIn: false,
  profile: {},
  profileTheme: 'logoBlue',
  profiles: [],
  profilesLoaded: false,
  searchedProfiles: [],
  signinModalShown: false
};
