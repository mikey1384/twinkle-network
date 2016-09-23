const defaultState = {
  feeds: []
};

export default function FeedReducer(state = defaultState, action) {
  switch(action.type) {
    case 'FETCH_FEEDS':
      return {
        ...state,
        feeds: action.data
      };
    case 'FEED_VIDEO_COMMENT_LIKE':
      return {
        ...state,
        feeds: state.feeds.map(feed => {
          if (feed.contentId === action.data.contentId) {
            feed.contentLikers = action.data.likes
          }
          return feed;
        })
      }
    case 'FEED_SIBLING_VIDEO_COMMENT_LIKE':
      return {
        ...state,
        feeds: state.feeds.map(feed => {
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
