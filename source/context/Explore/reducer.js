export default function ExploreReducer(state, action) {
  switch (action.type) {
    case 'CHANGE_SEARCH_INPUT':
      return {
        ...state,
        search: {
          ...state.search,
          searchText: action.text
        }
      };
    case 'LOAD_FEATURED_SUBJECTS':
      return {
        ...state,
        subjects: {
          ...state.subjects,
          featured: action.subjects,
          loaded: true
        }
      };
    case 'LOAD_SEARCH_RESULTS':
      return {
        ...state,
        search: {
          ...state.search,
          results: action.results,
          loadMoreButton: action.loadMoreButton
        }
      };
    case 'LOAD_MORE_SEARCH_RESULTS':
      return {
        ...state,
        search: {
          ...state.search,
          results: state.search.results.concat(action.results),
          loadMoreButton: action.loadMoreButton
        }
      };
    case 'RELOAD_SUBJECTS':
      return {
        ...state,
        subjects: {
          ...state.subjects,
          loaded: false
        }
      };
    default:
      return state;
  }
}
