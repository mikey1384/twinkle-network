import NOTI from '../constants/Noti'

const defaultState = {
  versionMatch: true,
  notifications: [],
  rewards: [],
  currentChatSubject: {},
  numNewNotis: 0,
  numNewPosts: 0
}

export default function NotiReducer(state = defaultState, action) {
  switch (action.type) {
    case NOTI.CHECK_VERSION:
      return {
        ...state,
        versionMatch: action.data.match
      }
    case NOTI.CHAT_SUBJECT_CHANGE:
      return {
        ...state,
        currentChatSubject: {
          ...state.currentChatSubject,
          ...action.subject
        }
      }
    case NOTI.CLEAR:
      return {
        ...state,
        notifications: [],
        rewards: []
      }
    case NOTI.INCREASE_NUM_NEW_NOTIS:
      return {
        ...state,
        numNewNotis: state.numNewNotis + 1
      }
    case NOTI.INCREASE_NUM_NEW_POSTS:
      return {
        ...state,
        numNewPosts: state.numNewPosts + 1
      }
    case NOTI.LOAD:
      return {
        ...state,
        ...action.data,
        numNewNotis: 0
      }
    case NOTI.RESET_NUM_NEW_POSTS:
      return {
        ...state,
        numNewPosts: 0
      }
    default:
      return state
  }
}
