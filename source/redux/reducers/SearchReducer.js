import SEARCH from '../constants/Search'

const defaultState = {
  searchText: ''
}

export default function SearchReducer(state = defaultState, action) {
  switch (action.type) {
    case SEARCH.CHANGE_INPUT:
      return {
        searchText: action.text
      }
    default:
      return state
  }
}
