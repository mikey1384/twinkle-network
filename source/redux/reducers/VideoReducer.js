import { fetchedVideoCodeFromURL } from 'helpers/stringHelpers';
import VIDEO from '../constants/Video';

const defaultVideoPageState = {
  videoLoading: true,
  comments: [],
  discussions: [],
  tags: [],
  loadMoreCommentsButton: false,
  loadMoreDiscussionsButton: false
};
const defaultState = {
  loaded: false,
  allVideoThumbs: [],
  loadMoreButton: false,
  allVideosLoaded: false,
  addVideoModalShown: false,
  videoPage: defaultVideoPageState,
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
    case VIDEO.ATTACH_STAR:
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          stars:
            action.data.contentType === 'video'
              ? (state.videoPage.stars || []).concat(action.data)
              : state.videoPage.stars || [],
          discussions: state.videoPage.discussions.map(discussion => ({
            ...discussion,
            comments: discussion.comments.map(comment => ({
              ...comment,
              stars:
                comment.id === action.data.contentId
                  ? (comment.stars || []).concat(action.data)
                  : comment.stars || [],
              replies: comment.replies.map(reply => ({
                ...reply,
                stars:
                  reply.id === action.data.contentId
                    ? (reply.stars || []).concat(action.data)
                    : reply.stars || []
              }))
            }))
          })),
          comments: state.videoPage.comments.map(comment => ({
            ...comment,
            stars:
              comment.id === action.data.contentId
                ? (comment.stars || []).concat(action.data)
                : comment.stars || [],
            replies: comment.replies.map(reply => ({
              ...reply,
              stars:
                reply.id === action.data.contentId
                  ? (reply.stars || []).concat(action.data)
                  : reply.stars || []
            }))
          }))
        }
      };
    case VIDEO.CHANGE_BY_USER_STATUS:
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          byUser: action.byUser
        },
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
    case VIDEO.DELETE_COMMENT:
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          discussions: state.videoPage.discussions.map(discussion => {
            return {
              ...discussion,
              comments: (discussion.comments || [])
                .filter(comment => comment.id !== action.commentId)
                .map(comment => ({
                  ...comment,
                  replies: (comment.replies || []).filter(
                    reply => reply.id !== action.commentId
                  )
                }))
            };
          }),
          comments: state.videoPage.comments.reduce((prev, comment) => {
            if (comment.id === action.commentId) return prev;
            return prev.concat([
              {
                ...comment,
                replies: comment.replies.filter(
                  reply => reply.id !== action.commentId
                )
              }
            ]);
          }, [])
        }
      };
    case VIDEO.DELETE_DISCUSSION:
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          discussions: state.videoPage.discussions.filter(
            discussion => discussion.id !== action.discussionId
          )
        }
      };
    case VIDEO.EDIT_COMMENT:
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          discussions: state.videoPage.discussions.map(discussion => ({
            ...discussion,
            comments: discussion.comments.map(comment => ({
              ...comment,
              content:
                comment.id === action.commentId
                  ? action.editedComment
                  : comment.content,
              replies: comment.replies.map(reply => ({
                ...reply,
                content:
                  reply.id === action.commentId
                    ? action.editedComment
                    : reply.content
              }))
            }))
          })),
          comments: state.videoPage.comments.map(comment => ({
            ...comment,
            content:
              comment.id === action.commentId
                ? action.editedComment
                : comment.content,
            replies: comment.replies.map(reply => ({
              ...reply,
              content:
                reply.id === action.commentId
                  ? action.editedComment
                  : reply.content
            }))
          }))
        }
      };
    case VIDEO.EDIT_DISCUSSION:
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          discussions: state.videoPage.discussions.map(discussion => ({
            ...discussion,
            title:
              discussion.id === action.discussionId
                ? action.data.title
                : discussion.title,
            description:
              discussion.id === action.discussionId
                ? action.data.description
                : discussion.description
          }))
        }
      };
    case VIDEO.EDIT_REWARD_COMMENT:
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          stars: (state.videoPage.stars || []).map(star => ({
            ...star,
            rewardComment:
              star.id === action.id ? action.text : star.rewardComment
          })),
          discussions: state.videoPage.discussions.map(discussion => ({
            ...discussion,
            comments: discussion.comments.map(comment => ({
              ...comment,
              stars: comment.stars
                ? comment.stars.map(star => ({
                    ...star,
                    rewardComment:
                      star.id === action.id ? action.text : star.rewardComment
                  }))
                : [],
              replies: comment.replies.map(reply => ({
                ...reply,
                stars: reply.stars
                  ? reply.stars.map(star => ({
                      ...star,
                      rewardComment:
                        star.id === action.id ? action.text : star.rewardComment
                    }))
                  : []
              }))
            }))
          })),
          comments: state.videoPage.comments.map(comment => ({
            ...comment,
            stars: comment.stars
              ? comment.stars.map(star => ({
                  ...star,
                  rewardComment:
                    star.id === action.id ? action.text : star.rewardComment
                }))
              : [],
            replies: comment.replies.map(reply => ({
              ...reply,
              stars: reply.stars
                ? reply.stars.map(star => ({
                    ...star,
                    rewardComment:
                      star.id === action.id ? action.text : star.rewardComment
                  }))
                : []
            }))
          }))
        }
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
    case VIDEO.LIKE_COMMENT:
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
                  likes:
                    comment.id === action.data.commentId
                      ? action.data.likes
                      : comment.likes,
                  replies: comment.replies.map(reply => {
                    return {
                      ...reply,
                      likes:
                        reply.id === action.data.commentId
                          ? action.data.likes
                          : reply.likes
                    };
                  })
                };
              })
            };
          }),
          comments: state.videoPage.comments.map(comment => {
            return {
              ...comment,
              likes:
                comment.id === action.data.commentId
                  ? action.data.likes
                  : comment.likes,
              replies: comment.replies.map(reply => {
                return {
                  ...reply,
                  likes:
                    reply.id === action.data.commentId
                      ? action.data.likes
                      : reply.likes
                };
              })
            };
          })
        }
      };
    case VIDEO.LIKE:
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          likes: action.data
        },
        allVideoThumbs: state.allVideoThumbs.map(thumb => ({
          ...thumb,
          numLikes:
            thumb.id === action.videoId ? action.data.length : thumb.numLikes
        }))
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
    case VIDEO.LOAD_DISCUSSIONS:
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          discussions: action.results,
          loadMoreDiscussionsButton: action.loadMoreButton
        }
      };
    case VIDEO.LOAD_MORE_DISCUSSIONS:
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          discussions: state.videoPage.discussions.concat(action.results),
          loadMoreDiscussionsButton: action.loadMoreButton
        }
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
    case VIDEO.LOAD_RIGHT_MENU_VIDS:
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          ...action.data
        }
      };
    case VIDEO.LOAD_MORE_RIGHT_MENU_PL_VIDS:
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          playlistVideos: state.videoPage.playlistVideos.concat(
            action.playlistVideos
          ),
          playlistVideosLoadMoreShown: action.playlistVideosLoadMoreShown
        }
      };
    case VIDEO.LOAD_DISCUSSION_COMMENTS:
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          discussions: state.videoPage.discussions.map(discussion => {
            if (discussion.id === action.discussionId) {
              return {
                ...discussion,
                comments: action.comments,
                loadMoreCommentsButton: action.loadMoreButton
              };
            }
            return discussion;
          })
        }
      };
    case VIDEO.LOAD_PAGE:
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          ...action.data,
          videoLoading: false,
          comments: []
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
    case VIDEO.LOAD_MORE_COMMENTS:
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          comments: state.videoPage.comments.concat(action.comments),
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
    case VIDEO.UPLOAD_DISCUSSION:
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          discussions: [action.data].concat(state.videoPage.discussions)
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
    case VIDEO.ADD_QUESTIONS:
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          questions: action.data
        }
      };
    case VIDEO.EDIT_PAGE:
      const { description } = action.params;
      const url = fetchedVideoCodeFromURL(action.params.url);
      return {
        ...state,
        allVideoThumbs: state.allVideoThumbs.map(thumb => {
          return {
            ...thumb,
            title:
              thumb.id === action.params.videoId
                ? action.params.title
                : thumb.title,
            content: thumb.id === action.params.videoId ? url : thumb.content
          };
        }),
        videoPage: {
          ...state.videoPage,
          title: action.params.title,
          description,
          content: url
        }
      };
    case VIDEO.RESET_PAGE:
      return {
        ...state,
        videoPage: defaultVideoPageState
      };
    case VIDEO.SET_DIFFICULTY:
      return {
        ...state,
        allVideoThumbs: state.allVideoThumbs.map(thumb =>
          thumb.id === action.videoId
            ? {
                ...thumb,
                difficulty: action.difficulty
              }
            : thumb
        ),
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
    case VIDEO.PAGE_UNAVAILABLE:
      return {
        ...state,
        videoPage: {
          videoUnavailable: true
        }
      };
    default:
      return state;
  }
}
