import NOTI from '../constants/Noti'

const defaultState = {
  versionMatch: true,
  notifications: [],
  currentChatSubject: {}
}

export default function NotiReducer(state = defaultState, action) {
  switch (action.type) {
    case NOTI.CHECK_VERSION:
      return {
        ...state,
        versionMatch: action.data.match
      }
    case NOTI.CLEAR:
      return {
        ...state,
        notifications: []
      }
    case NOTI.LOAD:
      return {
        ...state,
        ...action.data
      }
    case NOTI.CHAT_SUBJECT_CHANGE:
      return {
        ...state,
        currentChatSubject: {
          ...state.currentChatSubject,
          ...action.subject
        }
      }
    default:
      return state
  }
}
