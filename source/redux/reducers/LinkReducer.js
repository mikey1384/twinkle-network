import {processedStringWithURL} from 'helpers/stringHelpers'
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
    case 'DELETE_LINK':
      return {
        ...state,
        links: state.links.filter(link => link.id !== action.linkId)
      }
    case 'DELETE_LINK_COMMENT':
      return {
        ...state,
        linkPage: {
          ...state.linkPage,
          comments: state.linkPage.comments.reduce((resultingArray, comment) => {
            if (comment.id === action.commentId) return resultingArray
            return resultingArray.concat([{
              ...comment,
              replies: comment.replies.reduce((resultingArray, reply) => {
                if (reply.id === action.commentId) return resultingArray
                return resultingArray.concat([reply])
              }, [])
            }])
          }, [])
        }
      }
    case 'EDIT_LINK_COMMENT':
      let editedComment = processedStringWithURL(action.data.editedComment)
      return {
        ...state,
        linkPage: {
          ...state.linkPage,
          comments: state.linkPage.comments.map(comment => ({
            ...comment,
            content: comment.id === action.data.commentId ? editedComment : comment.content,
            replies: comment.replies.map(reply => ({
              ...reply,
              content: reply.id === action.data.commentId ? editedComment : reply.content
            }))
          }))
        }
      }
    case 'EDIT_LINK_TITLE':
      return {
        ...state,
        links: state.links.map(link => ({
          ...link,
          title: action.data.id === link.id ? action.data.title : link.title
        }))
      }
    case 'LIKE_LINK_COMMENT':
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
    case 'EDIT_LINK_PAGE':
      const {editedTitle: title, editedDescription: description, editedUrl: content} = action.data
      return {
        ...state,
        linkPage: {
          ...state.linkPage,
          content,
          title,
          description: processedStringWithURL(description)
        }
      }
    case 'FETCH_LINKS':
      if (action.links.length > 20) {
        loadMoreLinksButtonShown = true
        action.links.pop()
      }
      return {
        ...state,
        links: action.links,
        loadMoreLinksButtonShown
      }
    case 'FETCH_MORE_LINKS':
      if (action.links.length > 20) {
        loadMoreLinksButtonShown = true
        action.links.pop()
      }
      return {
        ...state,
        links: state.links.concat(action.links),
        loadMoreLinksButtonShown
      }
    case 'FETCH_LINK_COMMENTS':
      if (action.data.comments.length > 20) {
        action.data.comments.pop()
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
    case 'FETCH_MORE_LINK_COMMENTS':
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
    case 'FETCH_MORE_LINK_REPLIES':
      return {
        ...state,
        linkPage: {
          ...state.linkPage,
          comments: state.linkPage.comments.map(comment => ({
            ...comment,
            replies: comment.id === action.commentId ? action.data.replies.concat(comment.replies) : comment.replies,
            loadMoreReplies: comment.id === action.commentId ? action.data.loadMoreReplies : comment.loadMoreReplies
          }))
        }
      }
    case 'LIKE_LINK':
      return {
        ...state,
        linkPage: {
          ...state.linkPage,
          likers: action.likes
        }
      }
    case 'LOAD_LINK_PAGE':
      return {
        ...state,
        linkPage: {
          ...action.page
        }
      }
    case 'SUBMIT_LINK_COMMENT':
      return {
        ...state,
        linkPage: {
          ...state.linkPage,
          comments: [action.comment].concat(state.linkPage.comments)
        }
      }
    case 'SUBMIT_LINK_REPLY':
      return {
        ...state,
        linkPage: {
          ...state.linkPage,
          comments: state.linkPage.comments.map(comment => ({
            ...comment,
            replies: (comment.id === action.data.commentId || comment.id === action.data.reply.commentId) ?
              comment.replies.concat([action.data.reply]) : comment.replies
          }))
        }
      }
    default:
      return state
  }
}
