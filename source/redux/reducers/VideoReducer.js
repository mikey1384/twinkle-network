import VIDEO from '../constants/Video';

const defaultState = {
  loaded: false,
  allVideoThumbs: [],
  loadMoreButton: false,
  allVideosLoaded: false,
  addVideoModalShown: false,
  currentVideoSlot: null
};

export default function VideoReducer(state = defaultState, action) {
  switch (action.type) {
    case VIDEO.ADD_TAGS:
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          tags: state.videoPage.tags.concat(action.tags)
        }
      };
    case VIDEO.CHANGE_BY_USER_STATUS:
      return {
        ...state,
        allVideoThumbs: state.allVideoThumbs.map(thumb =>
          thumb.id === action.videoId
            ? {
                ...thumb,
                byUser: action.byUser
              }
            : thumb
        )
      };
    case VIDEO.DELETE:
      const newVideoThumbs = state.allVideoThumbs;
      newVideoThumbs.splice(action.arrayIndex, 1);
      return {
        ...state,
        allVideoThumbs: newVideoThumbs.concat(action.data)
      };
    case VIDEO.EDIT_TITLE:
      return {
        ...state,
        allVideoThumbs: state.allVideoThumbs.map(thumb => ({
          ...thumb,
          title: thumb.id === action.videoId ? action.data : thumb.title
        }))
      };
    case VIDEO.EMPTY_CURRENT_VIDEO_SLOT:
      return {
        ...state,
        currentVideoSlot: null
      };
    case VIDEO.FILL_CURRENT_VIDEO_SLOT:
      return {
        ...state,
        currentVideoSlot: action.videoId
      };
    case VIDEO.LOAD_TAGS:
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          tags: action.tags
        }
      };
    case VIDEO.LIKE:
      return {
        ...state,
        allVideoThumbs: state.allVideoThumbs.map(thumb =>
          thumb.id === action.videoId
            ? {
                ...thumb,
                numLikes: action.data.length
              }
            : thumb
        )
      };
    case VIDEO.LOAD:
      return {
        ...state,
        loaded: true,
        allVideoThumbs: action.initialRun
          ? action.videos
          : state.allVideoThumbs.concat(action.videos),
        loadMoreButton: action.loadMoreButton,
        allVideosLoaded: !action.loadMoreButton
      };
    case VIDEO.LOAD_MORE_DISCUSSION_REPLIES:
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          discussions: state.videoPage.discussions.map(discussion => {
            return {
              ...discussion,
              comments: discussion.comments.map(comment => {
                return {
                  ...comment,
                  replies:
                    comment.id === action.commentId
                      ? action.replies.concat(comment.replies)
                      : comment.replies,
                  loadMoreButton:
                    comment.id === action.commentId
                      ? action.loadMoreButton
                      : comment.loadMoreButton
                };
              })
            };
          })
        }
      };
    case VIDEO.LOAD_MORE_REPLIES:
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          comments: state.videoPage.comments.map(comment => {
            return {
              ...comment,
              replies:
                comment.id === action.commentId
                  ? action.replies.concat(comment.replies)
                  : comment.replies,
              loadMoreButton:
                comment.id === action.commentId
                  ? action.loadMoreButton
                  : comment.loadMoreButton
            };
          })
        }
      };
    case VIDEO.LOAD_MORE_DISCUSSION_COMMENTS:
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          discussions: state.videoPage.discussions.map(discussion => {
            if (discussion.id === action.discussionId) {
              return {
                ...discussion,
                comments: discussion.comments.concat(action.comments),
                loadMoreCommentsButton: action.loadMoreButton
              };
            }
            return discussion;
          })
        }
      };
    case VIDEO.LOAD_COMMENTS:
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          comments: action.comments,
          loadMoreCommentsButton: action.loadMoreButton
        }
      };
    case VIDEO.OPEN_MODAL:
      return {
        ...state,
        addVideoModalShown: true
      };
    case VIDEO.CLOSE_MODAL:
      return {
        ...state,
        addVideoModalShown: false
      };
    case VIDEO.UPLOAD:
      const newState = [action.data].concat(state.allVideoThumbs);
      if (!state.allVideosLoaded) {
        newState.pop();
      }
      return {
        ...state,
        allVideoThumbs: newState,
        addVideoModalShown: false
      };
    case VIDEO.UPLOAD_COMMENT:
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          discussions: state.videoPage.discussions.map(discussion => ({
            ...discussion,
            comments:
              discussion.id === action.comment.discussionId
                ? [action.comment].concat(discussion.comments)
                : discussion.comments
          })),
          comments: [action.comment].concat(state.videoPage.comments)
        }
      };
    case VIDEO.UPLOAD_REPLY:
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          discussions: state.videoPage.discussions.map(discussion => {
            return {
              ...discussion,
              comments: discussion.comments.map(comment => {
                return {
                  ...comment,
                  replies:
                    comment.id === action.reply.commentId ||
                    comment.id === action.reply.replyId
                      ? comment.replies.concat([action.reply])
                      : comment.replies
                };
              })
            };
          }),
          comments: state.videoPage.comments.map(comment => {
            return {
              ...comment,
              replies:
                comment.id === action.reply.commentId ||
                comment.id === action.reply.replyId
                  ? comment.replies.concat([action.reply])
                  : comment.replies
            };
          })
        }
      };
    case VIDEO.EDIT_THUMBS:
      return {
        ...state,
        allVideoThumbs: state.allVideoThumbs.map(thumb => {
          return {
            ...thumb,
            title:
              thumb.id === action.params.videoId
                ? action.params.title
                : thumb.title,
            content:
              thumb.id === action.params.videoId
                ? action.params.url
                : thumb.content
          };
        })
      };
    case VIDEO.SET_DIFFICULTY:
      return {
        ...state,
        allVideoThumbs: state.allVideoThumbs.map(thumb => {
          return thumb.id === action.videoId
            ? {
                ...thumb,
                difficulty: action.difficulty
              }
            : thumb;
        }),
        videoPage: {
          ...state.videoPage,
          difficulty: action.difficulty
        }
      };
    case VIDEO.SET_DISCUSSION_DIFFICULTY:
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          discussions: state.videoPage.discussions.map(discussion => {
            return discussion.id === action.contentId
              ? {
                  ...discussion,
                  difficulty: action.difficulty
                }
              : discussion;
          })
        }
      };
    case VIDEO.RESET:
      return defaultState;
    default:
      return state;
  }
}
