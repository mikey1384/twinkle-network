import SEARCH from '../constants/Search';

const defaultState = {
  results: [],
  loadMoreButton: false,
  searchScrollPosition: 0,
  searchText: '',
  selectedFilter: ''
};

export default function SearchReducer(state = defaultState, action) {
  switch (action.type) {
    case SEARCH.CHANGE_INPUT:
      return {
        ...state,
        searchText: action.text
      };
    case SEARCH.SET_RESULTS:
      if (action.filter && action.filter !== state.selectedFilter) return state;
      return {
        ...state,
        results: action.results,
        loadMoreButton: action.loadMoreButton
      };
    default:
      return state;
  }
}
