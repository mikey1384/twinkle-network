import SEARCH from '../constants/Search'

const defaultState = {
  results: [],
  loadMoreButton: false,
  searchMode: false,
  searchScrollPosition: 0,
  searchText: '',
  selectedFilter: ''
}

export default function SearchReducer(state = defaultState, action) {
  switch (action.type) {
    case SEARCH.CHANGE_FILTER:
      return {
        ...state,
        selectedFilter: action.filter
      }
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
    case SEARCH.LOAD_MORE_RESULTS:
      return {
        ...state,
        results: state.results.concat(action.results),
        loadMoreButton: action.loadMoreButton
      }
    case SEARCH.RECORD_SCROLL_POSITION:
      return {
        ...state,
        searchScrollPosition: action.scrollTop
      }
    case SEARCH.SET_RESULTS:
      return {
        ...state,
        results: action.results,
        loadMoreButton: action.loadMoreButton
      }
    default:
      return state
  }
}
