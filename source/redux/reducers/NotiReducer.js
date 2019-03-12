import NOTI from '../constants/Noti';

const defaultState = {
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
  totalRewardAmount: 0
};

export default function NotiReducer(state = defaultState, action) {
  switch (action.type) {
    case NOTI.CHANGE_SOCKET_STATUS:
      return {
        ...state,
        socketConnected: action.connected
      };
    case NOTI.CHECK_VERSION:
      return {
        ...state,
        versionMatch: action.data.match
      };
    case NOTI.CHAT_SUBJECT_CHANGE:
      return {
        ...state,
        currentChatSubject: {
          ...state.currentChatSubject,
          ...action.subject
        }
      };
    case NOTI.CLEAR:
      return defaultState;
    case NOTI.CLEAR_REWARDS:
      return {
        ...state,
        rewards: [],
        totalRewardAmount: 0,
        loadMore: {
          ...state.loadMore,
          rewards: false
        }
      };
    case NOTI.INCREASE_NUM_NEW_NOTIS:
      return {
        ...state,
        numNewNotis: state.numNewNotis + 1
      };
    case NOTI.INCREASE_NUM_NEW_POSTS:
      return {
        ...state,
        numNewPosts: state.numNewPosts + 1
      };
    case NOTI.LOAD:
      return {
        ...state,
        ...action.data,
        numNewNotis: 0
      };
    case NOTI.LOAD_RANKS:
      return {
        ...state,
        allRanks: action.all,
        top30s: action.top30s,
        rankingsLoaded: true
      };
    case NOTI.LOAD_MORE:
      return {
        ...state,
        notifications: state.notifications.concat(action.data.notifications),
        loadMore: {
          ...state.loadMore,
          ...action.data.loadMore
        }
      };
    case NOTI.LOAD_MORE_REWARDS:
      return {
        ...state,
        rewards: state.rewards.concat(action.data.rewards),
        loadMore: {
          ...state.loadMore,
          rewards: action.data.loadMore
        }
      };
    case NOTI.RESET_NUM_NEW_POSTS:
      return {
        ...state,
        numNewPosts: 0
      };
    default:
      return state;
  }
}
