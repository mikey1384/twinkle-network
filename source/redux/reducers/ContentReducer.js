import CONTENT from '../constants/Content'

const defaultState = {
  searchResult: []
}

export default function ContentReducer(state = defaultState, action) {
  switch (action.type) {
    case CONTENT.CLEAR_SEARCH_RESULTS:
      return {
        ...state,
        searchResult: []
      }
    case CONTENT.SEARCH:
      return {
        ...state,
        searchResult: action.data.result
      }
    default:
      return state
  }
}
