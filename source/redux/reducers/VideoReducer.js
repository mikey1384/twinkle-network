import { fetchedVideoCodeFromURL } from 'helpers/stringHelpers'
import VIDEO from '../constants/Video'

const defaultVideoPageState = {
  videoLoading: true,
  comments: [],
  discussions: [],
  loadMoreCommentsButton: false,
  loadMoreDiscussionsButton: false
}
const defaultState = {
  loaded: false,
  allVideoThumbs: [],
  loadMoreButton: false,
  allVideosLoaded: false,
  addVideoModalShown: false,
  videoPage: defaultVideoPageState,
  currentVideoSlot: null
}

export default function VideoReducer(state = defaultState, action) {
  let loadMoreButton = false
  let loadMoreCommentsButton = false
  let loadMoreDiscussionsButton = false
  let loadMoreDiscussionCommentsButton = false
  let allVideosLoaded = false
  let reply
  switch (action.type) {
    case VIDEO.DELETE:
      const newVideoThumbs = state.allVideoThumbs
      newVideoThumbs.splice(action.arrayIndex, 1)
      return {
        ...state,
        allVideoThumbs: newVideoThumbs.concat(action.data)
      }
    case VIDEO.DELETE_COMMENT:
      let newComments = state.videoPage.comments.filter(
        comment => comment.id !== action.data.commentId
      )
      let noComments = newComments.length === 0
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          discussions: state.videoPage.discussions.map(discussion => {
            return {
              ...discussion,
              comments: discussion.comments
                .filter(comment => comment.id !== action.data.commentId)
                .map(comment => ({
                  ...comment,
                  replies: comment.replies.filter(
                    reply => reply.id !== action.data.commentId
                  )
                }))
            }
          }),
          comments: newComments.map(comment => ({
            ...comment,
            replies: comment.replies.filter(
              reply => reply.id !== action.data.commentId
            )
          })),
          noComments
        }
      }
    case VIDEO.DELETE_DISCUSSION:
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          discussions: state.videoPage.discussions.filter(
            discussion => discussion.id !== action.discussionId
          )
        }
      }
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
      }
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
      }
    case VIDEO.EMPTY_CURRENT_VIDEO_SLOT:
      return {
        ...state,
        currentVideoSlot: null
      }
    case VIDEO.FILL_CURRENT_VIDEO_SLOT:
      return {
        ...state,
        currentVideoSlot: action.videoId
      }
    case VIDEO.LOAD:
      if (action.videos.length > 12) {
        action.videos.pop()
        loadMoreButton = true
      } else {
        allVideosLoaded = true
        loadMoreButton = false
      }
      return {
        ...state,
        loaded: true,
        allVideoThumbs: action.initialRun
          ? action.videos
          : state.allVideoThumbs.concat(action.videos),
        loadMoreButton,
        allVideosLoaded
      }
    case VIDEO.EDIT_TITLE:
      return {
        ...state,
        allVideoThumbs: state.allVideoThumbs.map(thumb => ({
          ...thumb,
          title: thumb.id === action.videoId ? action.data : thumb.title
        }))
      }
    case VIDEO.OPEN_MODAL:
      return {
        ...state,
        addVideoModalShown: true
      }
    case VIDEO.CLOSE_MODAL:
      return {
        ...state,
        addVideoModalShown: false
      }
    case VIDEO.LOAD_MORE_COMMENTS:
      loadMoreCommentsButton = false
      if (action.data.comments.length > 20) {
        action.data.comments.pop()
        loadMoreCommentsButton = true
      }
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          comments: state.videoPage.comments.concat(action.data.comments),
          noComments: action.data.noComments,
          loadMoreCommentsButton
        }
      }
    case VIDEO.LOAD_MORE_REPLIES:
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          comments: state.videoPage.comments.map(comment => {
            return {
              ...comment,
              replies:
                action.commentType === 'default' &&
                comment.id === action.commentId
                  ? action.data.replies.concat(comment.replies)
                  : comment.replies,
              loadMoreReplies:
                action.commentType === 'default' &&
                comment.id === action.commentId
                  ? action.data.loadMoreReplies
                  : comment.loadMoreReplies
            }
          }),
          discussions: state.videoPage.discussions.map(discussion => {
            return {
              ...discussion,
              comments: discussion.comments.map(comment => {
                return {
                  ...comment,
                  replies:
                    action.commentType !== 'default' &&
                    comment.id === action.commentId
                      ? action.data.replies.concat(comment.replies)
                      : comment.replies,
                  loadMoreReplies:
                    action.commentType !== 'default' &&
                    comment.id === action.commentId
                      ? action.data.loadMoreReplies
                      : comment.loadMoreReplies
                }
              })
            }
          })
        }
      }
    case VIDEO.LOAD_MORE_DISCUSSIONS:
      loadMoreDiscussionsButton = false
      if (action.data.length > 3) {
        action.data.pop()
        loadMoreDiscussionsButton = true
      }
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          discussions: state.videoPage.discussions.concat(action.data),
          loadMoreDiscussionsButton
        }
      }
    case VIDEO.LOAD_MORE_DISCUSSION_COMMENTS:
      loadMoreDiscussionCommentsButton = false
      if (action.data.length > 3) {
        action.data.pop()
        loadMoreDiscussionCommentsButton = true
      }
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          discussions: state.videoPage.discussions.map(discussion => {
            if (discussion.id === action.discussionId) {
              return {
                ...discussion,
                comments: discussion.comments.concat(action.data),
                loadMoreDiscussionCommentsButton
              }
            }
            return discussion
          })
        }
      }
    case VIDEO.LOAD_RIGHT_MENU_VIDS:
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          ...action.data
        }
      }
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
      }
    case VIDEO.LOAD_DISCUSSION_COMMENTS:
      loadMoreDiscussionCommentsButton = false
      if (action.data.length > 3) {
        action.data.pop()
        loadMoreDiscussionCommentsButton = true
      }
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          discussions: state.videoPage.discussions.map(discussion => {
            if (discussion.id === action.discussionId) {
              return {
                ...discussion,
                comments: action.data,
                loadMoreDiscussionCommentsButton
              }
            }
            return discussion
          })
        }
      }
    case VIDEO.LOAD_PAGE:
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          videoLoading: false,
          ...action.data,
          comments: []
        }
      }
    case VIDEO.LOAD_COMMENTS:
      loadMoreCommentsButton = false
      if (action.data.comments.length > 20) {
        action.data.comments.pop()
        loadMoreCommentsButton = true
      }
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          ...action.data,
          loadMoreCommentsButton
        }
      }
    case VIDEO.LOAD_DISCUSSIONS:
      loadMoreDiscussionsButton = false
      if (action.data.length > 3) {
        action.data.pop()
        loadMoreDiscussionsButton = true
      }
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          discussions: action.data,
          loadMoreDiscussionsButton
        }
      }
    case VIDEO.UPLOAD:
      const newState = action.data.concat(state.allVideoThumbs)
      if (action.data.length > 0 && !state.allVideosLoaded) {
        newState.pop()
      }
      return {
        ...state,
        allVideoThumbs: newState,
        addVideoModalShown: false
      }
    case VIDEO.UPLOAD_COMMENT:
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          comments: [action.comment].concat(state.videoPage.comments)
        }
      }
    case VIDEO.UPLOAD_DISCUSSION:
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          discussions: [action.data].concat(state.videoPage.discussions)
        }
      }
    case VIDEO.UPLOAD_DISCUSSION_COMMENT:
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          discussions: state.videoPage.discussions.map(discussion => {
            if (discussion.id === action.data.discussionId) {
              return {
                ...discussion,
                comments: [action.data].concat(discussion.comments)
              }
            }
            return discussion
          }),
          comments: [action.data].concat(state.videoPage.comments),
          noComments: false
        }
      }
    case VIDEO.UPLOAD_REPLY:
      reply = {
        ...action.data,
        ...action.replyType
      }
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
                    comment.id === action.data.commentId
                      ? comment.replies.concat(reply)
                      : comment.replies
                }
              })
            }
          }),
          comments: state.videoPage.comments.map(comment => {
            return {
              ...comment,
              replies:
                comment.id === action.data.commentId
                  ? comment.replies.concat(reply)
                  : comment.replies
            }
          })
        }
      }
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
                    }
                  })
                }
              })
            }
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
                }
              })
            }
          })
        }
      }
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
      }
    case VIDEO.STAR:
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          isStarred: action.isStarred
        },
        allVideoThumbs: state.allVideoThumbs.map(thumb => ({
          ...thumb,
          isStarred:
            thumb.id === action.videoId ? action.isStarred : thumb.isStarred
        }))
      }
    case VIDEO.ADD_QUESTIONS:
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          questions: action.data
        }
      }
    case VIDEO.EDIT_PAGE:
      const { description } = action.params
      const url = fetchedVideoCodeFromURL(action.params.url)
      return {
        ...state,
        allVideoThumbs: state.allVideoThumbs.map(thumb => {
          return {
            ...thumb,
            title:
              thumb.id === action.params.videoId
                ? action.params.title
                : thumb.title,
            content: thumb.id === action.params.videoId ? url : thumb.url
          }
        }),
        videoPage: {
          ...state.videoPage,
          title: action.params.title,
          description,
          content: url
        }
      }
    case VIDEO.RESET_PAGE:
      return {
        ...state,
        videoPage: defaultVideoPageState
      }
    case VIDEO.RESET:
      return defaultState
    case VIDEO.PAGE_UNAVAILABLE:
      return {
        ...state,
        videoPage: {
          videoUnavailable: true
        }
      }
    default:
      return state
  }
}
