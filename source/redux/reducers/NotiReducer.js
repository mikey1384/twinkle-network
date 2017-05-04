const defaultState = {
  versionMatch: true,
  notifications: []
}

export default function NotiReducer(state = defaultState, action) {
  switch (action.type) {
    case 'CHECK_VERSION':
      return {
        ...state,
        versionMatch: action.data.match
      }
    default:
      return state
  }
}
