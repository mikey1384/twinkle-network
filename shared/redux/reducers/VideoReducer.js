import {processedStringWithURL, stringIsEmpty} from 'helpers/stringHelpers';

const defaultState = {
  allVideoThumbs: [],
  loadMoreButton: false,
  allVideosLoaded: false,
  addVideoModalShown: false,
  videoPage: {
    comments: [],
    noComments: false
  },
  searchResult: []
};

export default function VideoReducer(state = defaultState, action) {
  switch(action.type) {
    case 'CLEAR_CONTENT_SEARCH_RESULTS':
      return {
        ...state,
        searchResult: []
      }
    case 'GET_VIDEOS':
      let loadMoreButton = false;
      let allVideosLoaded = false;
      if (action.videos.length > 12) {
        action.videos.pop();
        loadMoreButton = true;
      } else {
        allVideosLoaded = true;
      }
      if (action.initialRun) {
        return {
          ...state,
          allVideoThumbs: action.videos,
          loadMoreButton,
          allVideosLoaded
        }
      } else {
        return {
          ...state,
          allVideoThumbs: state.allVideoThumbs.concat(action.videos),
          loadMoreButton,
          allVideosLoaded
        }
      }
    case 'UPLOAD_VIDEO':
      const newState = action.data.concat(state.allVideoThumbs);
      if (action.data.length > 0 && !state.allVideosLoaded) {
        newState.pop();
      }
      return {
        ...state,
        allVideoThumbs: newState,
        addVideoModalShown: false
      }
    case 'EDIT_VIDEO_TITLE':
      return {
        ...state,
        allVideoThumbs: state.allVideoThumbs.map(thumb => {
          if (thumb.id === action.videoId) {
            thumb.title = action.data;
          }
          return thumb;
        })
      }
    case 'DELETE_VIDEO':
      const newVideoThumbs = state.allVideoThumbs;
      newVideoThumbs.splice(action.arrayIndex, 1);
      return {
        ...state,
        allVideoThumbs: newVideoThumbs.concat(action.data)
      }
    case 'VID_MODAL_OPEN':
      return {
        ...state,
        addVideoModalShown: true
      };
    case 'VID_MODAL_CLOSE':
      return {
        ...state,
        addVideoModalShown: false
      };
    case 'LOAD_VIDEO_PAGE':
      if (action.data.error) {
        console.error(action.data.error);
        return {
          ...state,
          videoPage: {
            comments: [],
            noComments: false
          }
        };
      }
      return {
        ...state,
        videoPage: {
          ...action.data,
          comments: []
        }
      }
    case 'LOAD_VIDEO_COMMENTS':
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          comments: action.data.comments,
          noComments: action.data.noComments
        }
      }
    case 'UPLOAD_VIDEO_COMMENT':
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          comments: action.data.comments,
          noComments: action.data.noComments
        }
      }
    case 'EDIT_VIDEO_COMMENT':
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          comments: state.videoPage.comments.map(comment => {
            if (comment.id === action.data.commentId) {
              return {
                ...comment,
                content: processedStringWithURL(action.data.editedComment)
              }
            }
            return comment;
          })
        }
      }
    case 'DELETE_VIDEO_COMMENT':
      let newComments = state.videoPage.comments.filter(comment => comment.id !== action.data.commentId)
      let noComments = newComments.length === 0;
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          comments: newComments,
          noComments
        }
      }
    case 'UPLOAD_VIDEO_REPLY':
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          comments: state.videoPage.comments.map(comment => {
            if (comment.id === action.data.commentId) {
              return {
                ...comment,
                replies: comment.replies.concat(action.data.reply)
              }
            }
            return comment;
          })
        }
      }
    case 'EDIT_VIDEO_REPLY':
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          comments: state.videoPage.comments.map(comment => {
            if (comment.id === action.data.commentId) {
              return {
                ...comment,
                replies: comment.replies.map(reply => {
                  if (reply.id === action.data.replyId) {
                    return {
                      ...reply,
                      content: processedStringWithURL(action.data.editedReply)
                    }
                  }
                  return reply;
                })
              }
            }
            return comment;
          })
        }
      }
    case 'DELETE_VIDEO_REPLY':
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          comments: state.videoPage.comments.map(comment => {
            if (comment.id === action.data.commentId) {
              return {
                ...comment,
                replies: comment.replies.filter(reply => reply.id !== action.data.replyId)
              }
            }
            return comment;
          })
        }
      }
    case 'VIDEO_COMMENT_LIKE':
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          comments: state.videoPage.comments.map(comment => {
            if (comment.id === action.data.commentId) {
              return {
                ...comment,
                likes: action.data.likes
              }
            }
            return comment;
          })
        }
      }
    case 'VIDEO_REPLY_LIKE':
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          comments: state.videoPage.comments.map(comment => {
            if (comment.id === action.data.commentId) {
              return {
                ...comment,
                replies: comment.replies.map(reply => {
                  if (reply.id === action.data.replyId) {
                    return {
                      ...reply,
                      likes: action.data.likes
                    }
                  }
                  return reply;
                })
              }
            }
            return comment;
          })
        }
      }
    case 'VIDEO_LIKE':
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          likes: action.data
        },
        allVideoThumbs: state.allVideoThumbs.map(thumb => {
          if (thumb.id === action.videoId) {
            thumb.numLikes = action.data.length
          }
          return thumb;
        })
      }
    case 'UPLOAD_QUESTIONS':
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          questions: action.data
        }
      }
    case 'EDIT_VIDEO_PAGE':
      const description = (stringIsEmpty(action.params.description)) ?
      'No description' : processedStringWithURL(action.params.description);
      return {
        ...state,
        allVideoThumbs: state.allVideoThumbs.map(thumb => {
          if (thumb.id === action.params.videoId) {
            thumb.title = action.params.title
          }
          return thumb;
        }),
        videoPage: {
          ...state.videoPage,
          title: action.params.title,
          description
        }
      }
    case 'RESET_VIDEO_PAGE':
      return {
        ...state,
        videoPage: {
          comments: [],
          noComments: false
        }
      }
    case 'RESET_VID_STATE':
      return {
        ...state,
        allVideoThumbs: [],
        loadMoreButton: false,
        allVideosLoaded: false,
        addVideoModalShown: false
      }
    case 'SEARCH_CONTENT':
      return {
        ...state,
        searchResult: action.data.result
      }
    default:
      return state;
  }
}
