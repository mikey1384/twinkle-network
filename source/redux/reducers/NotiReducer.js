const defaultState = {
  versionMatch: true,
  notifications: [],
  currentChatSubject: {},
  loaded: false
}

export default function NotiReducer(state = defaultState, action) {
  switch (action.type) {
    case 'CHECK_VERSION':
      return {
        ...state,
        versionMatch: action.data.match
      }
    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: []
      }
    case 'FETCH_NOTIFICATIONS':
      return {
        ...state,
        ...action.data,
        loaded: true
      }
    case 'NOTIFY_CHAT_SUBJECT_CHANGE':
      return {
        ...state,
        currentChatSubject: {
          ...state.currentChatSubject,
          content: action.subject.content,
          userId: action.subject.uploader.id,
          username: action.subject.uploader.name,
          timeStamp: action.subject.timeStamp
        }
      }
    default:
      return state
  }
}
