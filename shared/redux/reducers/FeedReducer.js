const defaultState = {
  feeds: [],
  loadMoreButton: false
};

let loadMoreButton = false;
export default function FeedReducer(state = defaultState, action) {
  switch(action.type) {
    case 'FETCH_FEEDS':
      if (action.data.length > 20) {
        action.data.pop()
        loadMoreButton = true;
      } else {
        loadMoreButton = false;
      }
      return {
        ...state,
        feeds: action.data,
        loadMoreButton
      };
    case 'FETCH_MORE_FEEDS':
      if (action.data.length > 20) {
        action.data.pop()
        loadMoreButton = true;
      } else {
        loadMoreButton = false;
      }
      return {
        ...state,
        feeds: state.feeds.concat(action.data),
        loadMoreButton
      };
    case 'FEED_VIDEO_COMMENT_LIKE':
      return {
        ...state,
        feeds: state.feeds.map(feed => {
          if (feed.contentId === action.data.contentId) {
            feed.contentLikers = action.data.likes
          }
          if (feed.commentId === action.data.contentId) {
            feed.siblingContentLikers = action.data.likes
          }
          return feed;
        })
      }
    case 'FEED_SIBLING_VIDEO_COMMENT_LIKE':
      return {
        ...state,
        feeds: state.feeds.map(feed => {
          if (feed.contentId === action.data.contentId) {
            feed.contentLikers = action.data.likes
          }
          if (feed.commentId === action.data.contentId) {
            feed.siblingContentLikers = action.data.likes
          }
          return feed;
        })
      }
    default:
      return state;
  }
}
