import SEARCH from '../constants/Search'

const defaultState = {
  searchMode: false,
  searchText: ''
}

export default function SearchReducer(state = defaultState, action) {
  switch (action.type) {
    case SEARCH.CHANGE_INPUT:
      return {
        ...state,
        searchText: action.text
      }
    case SEARCH.CLOSE:
      return {
        ...state,
        searchMode: false
      }
    case SEARCH.INIT:
      return {
        ...state,
        searchMode: true
      }
    default:
      return state
  }
}
