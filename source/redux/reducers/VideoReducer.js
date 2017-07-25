import {processedString, fetchedVideoCodeFromURL} from 'helpers/stringHelpers'

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
  videoPage: defaultVideoPageState
}

export default function VideoReducer(state = defaultState, action) {
  let loadMoreButton = false
  let loadMoreCommentsButton = false
  let loadMoreDiscussionsButton = false
  let loadMoreDiscussionCommentsButton = false
  let allVideosLoaded = false
  let reply
  switch (action.type) {
    case 'DELETE_VIDEO':
      const newVideoThumbs = state.allVideoThumbs
      newVideoThumbs.splice(action.arrayIndex, 1)
      return {
        ...state,
        allVideoThumbs: newVideoThumbs.concat(action.data)
      }
    case 'DELETE_VIDEO_COMMENT':
      let newComments = state.videoPage.comments.filter(comment => comment.id !== action.data.commentId)
      let noComments = newComments.length === 0
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          discussions: state.videoPage.discussions.map(discussion => {
            return {
              ...discussion,
              comments: discussion.comments.filter(
                comment => comment.id !== action.data.commentId
              ).map(comment => ({
                ...comment,
                replies: comment.replies.filter(reply => reply.id !== action.data.commentId)
              }))
            }
          }),
          comments: newComments.map(comment => ({
            ...comment,
            replies: comment.replies.filter(reply => reply.id !== action.data.commentId)
          })),
          noComments
        }
      }
    case 'DELETE_VIDEO_DISCUSSION':
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          discussions: state.videoPage.discussions.filter(discussion => discussion.id !== action.discussionId)
        }
      }
    case 'EDIT_VIDEO_COMMENT':
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          discussions: state.videoPage.discussions.map(discussion => ({
            ...discussion,
            comments: discussion.comments.map(comment => ({
              ...comment,
              content: comment.id === action.data.commentId ? processedString(action.data.editedComment) : comment.content,
              replies: comment.replies.map(reply => ({
                ...reply,
                content: reply.id === action.data.commentId ? processedString(action.data.editedComment) : reply.content
              }))
            }))
          })),
          comments: state.videoPage.comments.map(comment => ({
            ...comment,
            content: comment.id === action.data.commentId ? processedString(action.data.editedComment) : comment.content,
            replies: comment.replies.map(reply => ({
              ...reply,
              content: reply.id === action.data.commentId ? processedString(action.data.editedComment) : reply.content
            }))
          }))
        }
      }
    case 'EDIT_VIDEO_DISCUSSION':
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          discussions: state.videoPage.discussions.map(discussion => ({
            ...discussion,
            title: discussion.id === action.discussionId ? action.data.title : discussion.title,
            description: discussion.id === action.discussionId ? action.data.description : discussion.description
          }))
        }
      }
    case 'GET_VIDEOS':
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
        allVideoThumbs: action.initialRun ? action.videos : state.allVideoThumbs.concat(action.videos),
        loadMoreButton,
        allVideosLoaded
      }
    case 'EDIT_VIDEO_TITLE':
      return {
        ...state,
        allVideoThumbs: state.allVideoThumbs.map(thumb => {
          if (thumb.id === action.videoId) {
            thumb.title = action.data
          }
          return thumb
        })
      }
    case 'VID_MODAL_OPEN':
      return {
        ...state,
        addVideoModalShown: true
      }
    case 'VID_MODAL_CLOSE':
      return {
        ...state,
        addVideoModalShown: false
      }
    case 'LOAD_MORE_COMMENTS':
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
    case 'LOAD_MORE_REPLIES':
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          comments: state.videoPage.comments.map(comment => {
            return {
              ...comment,
              replies: action.commentType === 'default' && comment.id === action.commentId ?
                action.data.replies.concat(comment.replies) : comment.replies,
              loadMoreReplies: action.commentType === 'default' && comment.id === action.commentId ? action.data.loadMoreReplies : comment.loadMoreReplies
            }
          }),
          discussions: state.videoPage.discussions.map(discussion => {
            return {
              ...discussion,
              comments: discussion.comments.map(comment => {
                return {
                  ...comment,
                  replies: action.commentType !== 'default' && comment.id === action.commentId ?
                    action.data.replies.concat(comment.replies) : comment.replies,
                  loadMoreReplies: action.commentType !== 'default' && comment.id === action.commentId ? action.data.loadMoreReplies : comment.loadMoreReplies
                }
              })
            }
          })
        }
      }
    case 'LOAD_MORE_VIDEO_DISCUSSIONS':
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
    case 'LOAD_MORE_VIDEO_DISCUSSION_COMMENTS':
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
    case 'LOAD_RIGHT_MENU_VIDEOS':
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          ...action.data
        }
      }
    case 'LOAD_MORE_RIGHT_MENU_PL_VIDEOS':
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          playlistVideos: state.videoPage.playlistVideos.concat(action.playlistVideos),
          playlistVideosLoadMoreShown: action.playlistVideosLoadMoreShown
        }
      }
    case 'LOAD_VIDEO_DISCUSSION_COMMENTS':
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
    case 'LOAD_VIDEO_PAGE':
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          videoLoading: false,
          ...action.data,
          comments: []
        }
      }
    case 'LOAD_VIDEO_COMMENTS':
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
    case 'LOAD_VIDEO_DISCUSSIONS':
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
    case 'UPLOAD_VIDEO':
      const newState = action.data.concat(state.allVideoThumbs)
      if (action.data.length > 0 && !state.allVideosLoaded) {
        newState.pop()
      }
      return {
        ...state,
        allVideoThumbs: newState,
        addVideoModalShown: false
      }
    case 'UPLOAD_VIDEO_COMMENT':
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          comments: [action.comment].concat(state.videoPage.comments)
        }
      }
    case 'UPLOAD_VIDEO_DISCUSSION':
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          discussions: [action.data].concat(state.videoPage.discussions)
        }
      }
    case 'UPLOAD_VIDEO_DISCUSSION_COMMENT':
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
    case 'UPLOAD_VIDEO_REPLY':
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
                  replies: comment.id === action.data.commentId ?
                    comment.replies.concat(reply) : comment.replies
                }
              })
            }
          }),
          comments: state.videoPage.comments.map(comment => {
            return {
              ...comment,
              replies: comment.id === action.data.commentId ?
                comment.replies.concat(reply) : comment.replies
            }
          })
        }
      }
    case 'VIDEO_COMMENT_LIKE':
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
                  likes: comment.id === action.data.commentId ? action.data.likes : comment.likes,
                  replies: comment.replies.map(reply => {
                    return {
                      ...reply,
                      likes: reply.id === action.data.commentId ? action.data.likes : reply.likes
                    }
                  })
                }
              })
            }
          }),
          comments: state.videoPage.comments.map(comment => {
            return {
              ...comment,
              likes: comment.id === action.data.commentId ? action.data.likes : comment.likes,
              replies: comment.replies.map(reply => {
                return {
                  ...reply,
                  likes: reply.id === action.data.commentId ? action.data.likes : reply.likes
                }
              })
            }
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
          return thumb
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
      const description = processedString(action.params.description)
      const url = fetchedVideoCodeFromURL(action.params.url)
      return {
        ...state,
        allVideoThumbs: state.allVideoThumbs.map(thumb => {
          return {
            ...thumb,
            title: (thumb.id === action.params.videoId) ? action.params.title : thumb.title,
            content: (thumb.id === action.params.videoId) ? url : thumb.url
          }
        }),
        videoPage: {
          ...state.videoPage,
          title: action.params.title,
          description,
          content: url
        }
      }
    case 'RESET_VIDEO_PAGE':
      return {
        ...state,
        videoPage: defaultVideoPageState
      }
    case 'RESET_VID_STATE':
      return {
        ...state,
        allVideoThumbs: [],
        loadMoreButton: false,
        allVideosLoaded: false,
        addVideoModalShown: false
      }
    case 'VIDEO_PAGE_UNAVAILABLE':
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
