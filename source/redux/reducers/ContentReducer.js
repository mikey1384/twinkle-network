const defaultState = {
  searchResult: []
}

export default function ContentReducer(state = defaultState, action) {
  switch (action.type) {
    case 'CLEAR_CONTENT_SEARCH_RESULTS':
      return {
        ...state,
        searchResult: []
      }
    case 'SEARCH_CONTENT':
      return {
        ...state,
        searchResult: action.data.result
      }
    default:
      return state
  }
}
