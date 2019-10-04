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
export const initialCommentState = {};
export const initialContentState = {};
export const initialExploreState = {
  links: {
    loaded: false,
    links: [],
    loadMoreLinksButtonShown: false
  },
  subjects: {
    featured: [],
    loaded: false
  },
  search: {
    results: [],
    loadMoreButton: false,
    searchText: ''
  },
  videos: {
    addPlaylistModalShown: false,
    allPlaylists: [],
    allPlaylistsLoaded: false,
    currentVideoSlot: null,
    featuredPlaylists: [],
    featuredPlaylistsLoaded: false,
    searchedPlaylists: [],
    loadMorePlaylistsButton: false,
    selectPlaylistsToFeatureModalShown: false,
    loadMorePlaylistsToPinButton: false,
    loadMoreSearchedPlaylistsButton: false,
    playlistsToPin: [],
    reorderFeaturedPlaylistsShown: false,
    clickSafe: true
  }
};
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
export const initialViewState = {
  pageVisible: true,
  scrollPositions: {},
  exploreCategory: 'subjects',
  explorePath: '',
  exploreSubNav: '',
  profileNav: '',
  homeNav: '/'
};
