const defaultState = {
  pageVisible: true
}

export default function ViewReducer(state = defaultState, action) {
  switch (action.type) {
    case 'CHANGE_PAGE_VISIBILITY':
      return {
        ...state,
        pageVisible: action.visible
      }
    default:
      return state
  }
}
