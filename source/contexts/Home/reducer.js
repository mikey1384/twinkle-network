export default function HomeReducer(state, action) {
  const contentKey =
    action.contentType && action.contentId
      ? action.contentType + action.contentId
      : 'temp';
  switch (action.type) {
    case 'CHANGE_CATEGORY':
      return {
        ...state,
        category: action.category
      };
    case 'CHANGE_SUB_FILTER':
      return {
        ...state,
        subFilter: action.subFilter
      };
    case 'DELETE_FEED':
      return {
        ...state,
        feeds: state.feeds.filter(
          feed => feed.contentType + feed.contentId !== contentKey
        )
      };
    case 'LOAD_FEEDS':
      return {
        ...state,
        feeds: action.feeds,
        loadMoreButton: action.loadMoreButton,
        loaded: true
      };
    case 'LOAD_MORE_FEEDS':
      return {
        ...state,
        feeds: state.feeds.concat(action.feeds),
        loadMoreButton: action.loadMoreButton
      };
    case 'LOAD_NEW_FEEDS':
      return {
        ...state,
        feeds: action.data.concat(state.feeds)
      };
    case 'RELOAD_FEEDS':
      return {
        ...state,
        loaded: false
      };
    default:
      return state;
  }
}
