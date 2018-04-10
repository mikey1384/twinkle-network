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
  let loadMoreCommentsButton = false
  switch (action.type) {
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
          comments: state.linkPage.comments.reduce(
            (resultingArray, comment) => {
              if (comment.id === action.commentId) return resultingArray
              return resultingArray.concat([
                {
                  ...comment,
                  replies: comment.replies.reduce((resultingArray, reply) => {
                    if (reply.id === action.commentId) return resultingArray
                    return resultingArray.concat([reply])
                  }, [])
                }
              ])
            },
            []
          )
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
            let matches = comment.id === action.data.contentId
            return {
              ...comment,
              likes: matches ? action.data.likes : comment.likes,
              replies: comment.replies.map(reply => {
                let matches = reply.id === action.data.contentId
                return {
                  ...reply,
                  likes: matches ? action.data.likes : reply.likes
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
          content: action.data.id === state.linkPage.id ? processedURL(content) : link.content
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
      if (action.data.length > 20) {
        action.data.pop()
        loadMoreCommentsButton = true
      }
      return {
        ...state,
        linkPage: {
          ...state.linkPage,
          ...action.data,
          loadMoreCommentsButton
        }
      }
    case LINK.LOAD_MORE_COMMENTS:
      if (action.data.comments.length > 20) {
        action.data.comments.pop()
        loadMoreCommentsButton = true
      }
      return {
        ...state,
        linkPage: {
          ...state.linkPage,
          comments: state.linkPage.comments.concat(action.data.comments),
          loadMoreCommentsButton
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
                ? action.data.replies.concat(comment.replies)
                : comment.replies,
            loadMoreReplies:
              comment.id === action.commentId
                ? action.data.loadMoreReplies
                : comment.loadMoreReplies
          }))
        }
      }
    case LINK.LIKE:
      return {
        ...state,
        linkPage: {
          ...state.linkPage,
          likers: action.likes
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
              comment.id === action.data.commentId ||
              comment.id === action.data.reply.commentId
                ? comment.replies.concat([action.data.reply])
                : comment.replies
          }))
        }
      }
    case LINK.UPLOAD:
      return {
        ...state,
        links: [action.linkItem].concat(state.links)
      }
    default:
      return state
  }
}
