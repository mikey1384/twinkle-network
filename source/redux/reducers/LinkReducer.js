import LINK from '../constants/Link'
import { processedURL } from 'helpers/stringHelpers'

const defaultState = {
  links: [],
  loadMoreLinksButtonShown: false,
  linkPage: {
    comments: []
  }
}

export default function linkReducer(state = defaultState, action) {
  let loadMoreLinksButtonShown = false
  switch (action.type) {
    case LINK.ATTACH_STAR:
      return {
        ...state,
        linkPage: {
          ...state.linkPage,
          comments: state.linkPage.comments.map(comment => ({
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
      }
    case LINK.DELETE:
      return {
        ...state,
        links: state.links.filter(link => link.id !== action.linkId)
      }
    case LINK.DELETE_COMMENT:
      return {
        ...state,
        linkPage: {
          ...state.linkPage,
          comments: state.linkPage.comments.reduce((prev, comment) => {
            if (comment.id === action.commentId) return prev
            return prev.concat([
              {
                ...comment,
                replies: comment.replies.filter(
                  reply => reply.id !== action.commentId
                )
              }
            ])
          }, [])
        }
      }
    case LINK.EDIT_COMMENT:
      return {
        ...state,
        linkPage: {
          ...state.linkPage,
          comments: state.linkPage.comments.map(comment => ({
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
    case LINK.EDIT_REWARD_COMMENT:
      return {
        ...state,
        linkPage: {
          ...state.linkPage,
          comments: state.linkPage.comments.map(comment => ({
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
      }
    case LINK.EDIT_TITLE:
      return {
        ...state,
        links: state.links.map(link => ({
          ...link,
          title: action.data.id === link.id ? action.data.title : link.title
        }))
      }
    case LINK.LIKE_COMMENT:
      return {
        ...state,
        linkPage: {
          ...state.linkPage,
          comments: state.linkPage.comments.map(comment => {
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
    case LINK.EDIT_PAGE:
      const {
        editedTitle: title,
        editedDescription: description,
        editedUrl: content
      } = action.data
      return {
        ...state,
        links: state.links.map(link => ({
          ...link,
          title: action.data.id === state.linkPage.id ? title : link.title,
          content:
            action.data.id === state.linkPage.id
              ? processedURL(content)
              : link.content
        })),
        linkPage: {
          ...state.linkPage,
          content: processedURL(content),
          title,
          description
        }
      }
    case LINK.LOAD:
      if (action.links.length > 20) {
        loadMoreLinksButtonShown = true
        action.links.pop()
      }
      return {
        ...state,
        links: action.links,
        loadMoreLinksButtonShown
      }
    case LINK.LOAD_MORE:
      if (action.links.length > 20) {
        loadMoreLinksButtonShown = true
        action.links.pop()
      }
      return {
        ...state,
        links: state.links.concat(action.links),
        loadMoreLinksButtonShown
      }
    case LINK.LOAD_COMMENTS:
      return {
        ...state,
        linkPage: {
          ...state.linkPage,
          comments: action.comments,
          loadMoreCommentsButton: action.loadMoreButton
        }
      }
    case LINK.LOAD_MORE_COMMENTS:
      return {
        ...state,
        linkPage: {
          ...state.linkPage,
          comments: state.linkPage.comments.concat(action.comments),
          loadMoreCommentsButton: action.loadMoreButton
        }
      }
    case LINK.LOAD_MORE_REPLIES:
      return {
        ...state,
        linkPage: {
          ...state.linkPage,
          comments: state.linkPage.comments.map(comment => ({
            ...comment,
            replies:
              comment.id === action.commentId
                ? action.replies.concat(comment.replies)
                : comment.replies,
            loadMoreButton:
              comment.id === action.commentId
                ? action.loadMoreButton
                : comment.loadMoreButton
          }))
        }
      }
    case LINK.LIKE:
      return {
        ...state,
        linkPage: {
          ...state.linkPage,
          likes: action.likes
        }
      }
    case LINK.LOAD_PAGE:
      return {
        ...state,
        linkPage: {
          ...state.linkPage,
          ...action.page
        }
      }
    case LINK.UPLOAD_COMMENT:
      return {
        ...state,
        linkPage: {
          ...state.linkPage,
          comments: [action.comment].concat(state.linkPage.comments)
        }
      }
    case LINK.UPLOAD_REPLY:
      return {
        ...state,
        linkPage: {
          ...state.linkPage,
          comments: state.linkPage.comments.map(comment => ({
            ...comment,
            replies:
              comment.id === action.reply.replyId ||
              comment.id === action.reply.commentId
                ? comment.replies.concat([action.reply])
                : comment.replies
          }))
        }
      }
    case LINK.UPLOAD:
      return {
        ...state,
        links: [action.linkItem].concat(state.links)
      }
    case LINK.RESET_PAGE:
      return {
        ...state,
        linkPage: {
          comments: []
        }
      }
    default:
      return state
  }
}
