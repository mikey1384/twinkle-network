const defaultState = {
  feeds: null,
  loadMoreButton: false,
  categorySearchResult: []
};

let loadMoreButton = false;
export default function FeedReducer(state = defaultState, action) {
  switch(action.type) {
    case 'CLEAR_CATEGORIES_SEARCH':
      return {
        ...state,
        categorySearchResult: []
      }
    case 'FETCH_CATEGORIES':
      return {
        ...state,
        categorySearchResult: action.data
      };
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
      loadMoreButton = false;
      if (action.data.length > 20) {
        action.data.pop()
        loadMoreButton = true;
      }
      return {
        ...state,
        feeds: state.feeds.concat(action.data),
        loadMoreButton
      };
    case 'FEED_VIDEO_LIKE':
      return {
        ...state,
        feeds: state.feeds.map(feed => {
          if (feed.type === 'video') {
            if (feed.contentId === action.data.contentId) {
              feed.contentLikers = action.data.likes
            }
            if (feed.commentId === action.data.contentId) {
              feed.siblingContentLikers = action.data.likes
            }
          }
          return feed;
        })
      }
    case 'FEED_VIDEO_COMMENT_LIKE':
      return {
        ...state,
        feeds: state.feeds.map(feed => {
          if (feed.type === 'comment') {
            if (feed.contentId === action.data.contentId) {
              feed.contentLikers = action.data.likes
            }
            if (!feed.replyId && feed.commentId === action.data.contentId) {
              feed.siblingContentLikers = action.data.likes
            }
            if (feed.replyId === action.data.contentId) {
              feed.siblingContentLikers = action.data.likes
            }
          }
          return feed;
        })
      }
    case 'FEED_SIBLING_VIDEO_COMMENT_LIKE':
      return {
        ...state,
        feeds: state.feeds.map(feed => {
          if (feed.type === 'comment') {
            if (feed.contentId === action.data.contentId) {
              feed.contentLikers = action.data.likes
            }
            if (!feed.replyId && feed.commentId === action.data.contentId) {
              feed.siblingContentLikers = action.data.likes
            }
            if (feed.replyId === action.data.contentId) {
              feed.siblingContentLikers = action.data.likes
            }
          }
          return feed;
        })
      }
    case 'UPLOAD_CONTENT':
      return {
        ...state,
        categorySearchResult: [],
        feeds: [action.data].concat(state.feeds)
      };
    default:
      return state;
  }
}
