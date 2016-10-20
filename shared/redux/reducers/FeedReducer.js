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
              feed.targetContentLikers = action.data.likes
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
              feed.targetContentLikers = action.data.likes
            }
            if (feed.replyId === action.data.contentId) {
              feed.targetContentLikers = action.data.likes
            }
          }
          return {
            ...feed,
            childComments: feed.childComments.map(childComment => {
              let likes = childComment.likes;
              if (childComment.id === action.data.contentId) {
                likes = action.data.likes;
              }
              return {
                ...childComment,
                likes,
                replies: childComment.replies.map(reply => {
                  let likes = reply.likes;
                  if (reply.id === action.data.contentId) {
                    likes = action.data.likes;
                  }
                  return {
                    ...reply,
                    likes
                  }
                })
              };
            })
          }
        })
      }
    case 'FEED_TARGET_VIDEO_COMMENT_LIKE':
      return {
        ...state,
        feeds: state.feeds.map(feed => {
          if (feed.type === 'comment') {
            if (feed.contentId === action.data.contentId) {
              feed.contentLikers = action.data.likes
            }
            if (!feed.replyId && feed.commentId === action.data.contentId) {
              feed.targetContentLikers = action.data.likes
            }
            if (feed.replyId === action.data.contentId) {
              feed.targetContentLikers = action.data.likes
            }
          }
          return feed;
        })
      }
    case 'LOAD_MORE_FEED_COMMENTS':
      return {
        ...state,
        feeds: state.feeds.map(feed => {
          if (feed.type === action.data.type && feed.contentId == action.data.contentId) {
            if (action.data.childComments.length > 3) {
              action.data.childComments.pop();
              feed.commentsLoadMoreButton = true;
            } else {
              feed.commentsLoadMoreButton = false;
            }
            feed.childComments = feed.childComments.concat(action.data.childComments);
          }
          return feed;
        })
      }
    case 'SHOW_FEED_COMMENTS':
      return {
        ...state,
        feeds: state.feeds.map(feed => {
          if (feed.type === action.data.type && feed.contentId == action.data.contentId) {
            feed.commentsShown = true;
            if (action.data.childComments.length > 3) {
              action.data.childComments.pop();
              feed.commentsLoadMoreButton = true;
            }
            feed.childComments = action.data.childComments;
            feed.isReply = action.data.isReply;
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
    case 'UPLOAD_FEED_VIDEO_COMMENT':
      return {
        ...state,
        feeds: state.feeds.map(feed => {
          if (feed.type === action.data.type && feed.contentId == action.data.contentId) {
            feed.childComments = action.data.comments;
          }
          return feed;
        })
      }
    case 'UPLOAD_FEED_VIDEO_REPLY':
      return {
        ...state,
        feeds: state.feeds.map(feed => {
          if (feed.type === action.data.type && feed.contentId == action.data.contentId) {
            let {reply} = action.data;
            if (feed.type === 'comment') {
              feed.childComments = [reply].concat(feed.childComments)
            }
          }
          return {
            ...feed,
            childComments: feed.childComments.map(childComment => {
              let {replies} = childComment;
              let {reply} = action.data;
              if (childComment.id === action.data.contentId) {
                replies = replies.concat([reply])
              } else if (feed.type === 'video' && childComment.id === action.data.commentId) {
                replies = replies.concat([reply])
              } else if (feed.type === 'video' && childComment.id === action.data.reply.commentId) {
                replies = replies.concat([reply])
              }
              return {
                ...childComment,
                replies
              };
            })
          };
        })
      }
    default:
      return state;
  }
}
