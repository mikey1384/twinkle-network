import {processedString} from 'helpers/stringHelpers'

const defaultState = {
  selectedFilter: 'all',
  scrollLocked: false,
  feeds: null,
  loaded: false,
  loadMoreButton: false
}

export default function FeedReducer(state = defaultState, action) {
  let loadMoreButton = false
  let commentsLoadMoreButton = false
  switch (action.type) {
    case 'CLEAR_FEEDS':
      return {
        ...state,
        selectedFilter: 'all',
        feeds: [],
        loadMoreButton: false,
        loaded: false
      }
    case 'FETCH_FEED':
      return {
        ...state,
        feeds: state.feeds.map(feed => {
          return (feed.id === action.data.id) ? action.data : feed
        })
      }
    case 'FETCH_FEEDS':
      if (action.data.length > 20) {
        action.data.pop()
        loadMoreButton = true
      }
      return {
        ...state,
        feeds: action.data,
        selectedFilter: action.filter || state.selectedFilter,
        loadMoreButton,
        loaded: true
      }
    case 'FETCH_MORE_FEED_REPLIES':
      return {
        ...state,
        feeds: state.feeds.map(feed => {
          return {
            ...feed,
            childComments: feed.type === action.contentType ? feed.childComments.map(comment => {
              return {
                ...comment,
                replies: comment.id === action.commentId ? action.data.replies.concat(comment.replies) : comment.replies,
                loadMoreReplies: comment.id === action.commentId ? action.data.loadMoreReplies : comment.loadMoreReplies
              }
            }) : feed.childComments
          }
        })
      }
    case 'FETCH_MORE_FEEDS':
      if (action.data.length > 5) {
        action.data.pop()
        loadMoreButton = true
      }
      return {
        ...state,
        feeds: state.feeds.concat(action.data),
        selectedFilter: action.filter || state.selectedFilter,
        loadMoreButton
      }
    case 'FEED_TARGET_COMMENT_LIKE':
      return {
        ...state,
        feeds: state.feeds.map(feed => {
          let contentMatches = feed.contentId === action.data.contentId
          let targetContentMatches = (!feed.replyId && feed.commentId === action.data.contentId) ||
              (feed.replyId === action.data.contentId)
          return {
            ...feed,
            contentLikers: contentMatches ? action.data.likes : feed.contentLikers,
            targetContentLikers: targetContentMatches ? action.data.likes : feed.targetContentLikers
          }
        })
      }
    case 'FEED_COMMENT_DELETE':
      return {
        ...state,
        feeds: state.feeds.reduce((resultingArray, feed) => {
          if (feed.contentId === action.commentId || feed.commentId === action.commentId || feed.replyId === action.commentId) return resultingArray
          return resultingArray.concat([{
            ...feed,
            targetContentComments: feed.targetContentComments ? feed.targetContentComments.filter(comment => comment.id !== action.commentId) : [],
            childComments: feed.childComments.reduce((resultingArray, childComment) => {
              if (childComment.id === action.commentId) return resultingArray
              return resultingArray.concat([{
                ...childComment,
                replies: childComment.replies.reduce((resultingArray, reply) => {
                  if (reply.id === action.commentId) return resultingArray
                  return resultingArray.concat([reply])
                }, [])
              }])
            }, [])
          }])
        }, [])
      }
    case 'FEED_COMMENT_EDIT':
      let editedComment = processedString(action.data.editedComment)
      return {
        ...state,
        feeds: state.feeds.map(feed => {
          let targetContentComments = feed.targetContentComments || []
          let isComment = feed.type === 'comment'
          let contentMatches = feed.contentId === action.data.commentId
          let commentMatches = feed.commentId === action.data.commentId
          let replyMatches = feed.replyId === action.data.commentId
          return {
            ...feed,
            content: isComment && contentMatches ? editedComment : feed.content,
            targetComment: isComment && commentMatches ? editedComment : feed.targetComment,
            targetReply: isComment && replyMatches ? editedComment : feed.targetReply,
            targetContentComments: targetContentComments.map(comment => ({
              ...comment,
              content: comment.id === action.data.commentId ? editedComment : comment.content
            })),
            childComments: feed.childComments.map(childComment => {
              return {
                ...childComment,
                content: childComment.id === action.data.commentId ? editedComment : childComment.content,
                replies: childComment.replies.map(reply => ({
                  ...reply,
                  content: reply.id === action.data.commentId ? editedComment : reply.content
                }))
              }
            })
          }
        })
      }
    case 'COMMENT_FEED_LIKE':
      return {
        ...state,
        feeds: state.feeds.map(feed => {
          let feedTypeIsComment = feed.type === 'comment'
          let feedContentMatches = feed.contentId === action.data.contentId
          let targetContentMatches =
            (!feed.replyId && (feed.commentId === action.data.contentId)) || (feed.replyId === action.data.contentId)
          return {
            ...feed,
            contentLikers: feedTypeIsComment && feedContentMatches ? action.data.likes : feed.contentLikers,
            targetContentLikers: feedTypeIsComment && targetContentMatches ? action.data.likes : feed.targetContentLikers,
            childComments: feed.childComments.map(childComment => {
              let matches = childComment.id === action.data.contentId
              return {
                ...childComment,
                likes: matches ? action.data.likes : childComment.likes,
                replies: childComment.replies.map(reply => {
                  let matches = reply.id === action.data.contentId
                  return {
                    ...reply,
                    likes: matches ? action.data.likes : reply.likes
                  }
                })
              }
            })
          }
        })
      }
    case 'CONTENT_FEED_LIKE':
      return {
        ...state,
        feeds: state.feeds.map(feed => ({
          ...feed,
          contentLikers: feed.contentId === action.data.contentId ?
            action.data.likes : feed.contentLikers,
          rootContentLikers: feed.type === 'comment' && feed.rootId === action.data.contentId ?
            action.data.likes : feed.rootContentLikers
        }))
      }
    case 'LOAD_MORE_FEED_COMMENTS':
      if (action.data.childComments.length > 3) {
        action.data.childComments.pop()
        commentsLoadMoreButton = true
      }
      return {
        ...state,
        feeds: state.feeds.map(feed => {
          let match = feed.type === action.data.type && feed.contentId === action.data.contentId
          return {
            ...feed,
            commentsLoadMoreButton,
            childComments: match ? feed.childComments.concat(action.data.childComments) : feed.childComments
          }
        })
      }
    case 'SHOW_FEED_COMMENTS':
      if (action.data.childComments.length > 3) {
        action.data.childComments.pop()
        commentsLoadMoreButton = true
      }
      return {
        ...state,
        feeds: state.feeds.map(feed => {
          let match = feed.type === action.data.type && feed.contentId === action.data.contentId
          return {
            ...feed,
            commentsLoadMoreButton: match ? commentsLoadMoreButton : feed.commentsLoadMoreButton,
            childComments: match ? action.data.childComments : feed.childComments,
            isReply: match ? action.data.isReply : feed.isReply
          }
        })
      }
    case 'UPLOAD_CONTENT':
      return {
        ...state,
        feeds: [action.data].concat(state.feeds)
      }
    case 'UPLOAD_FEED_COMMENT':
      return {
        ...state,
        feeds: state.feeds.map(feed => {
          return {
            ...feed,
            childComments: feed.type === action.data.type && feed.contentId === action.data.contentId ?
              [action.data].concat(feed.childComments) : feed.childComments
          }
        })
      }
    case 'UPLOAD_FEED_REPLY':
      let {reply} = action.data
      return {
        ...state,
        feeds: state.feeds.map(feed => {
          let match = feed.type === action.data.type && feed.type === 'comment' && feed.contentId === action.data.contentId
          let comments = match ? [reply].concat(feed.childComments) : feed.childComments
          return {
            ...feed,
            childComments: comments.map(childComment => {
              return {
                ...childComment,
                replies: (
                  (feed.type === 'comment' && childComment.id === action.data.contentId) ||
                  (feed.type !== 'comment' && childComment.id === action.data.commentId) ||
                  (feed.type !== 'comment' && childComment.id === action.data.reply.commentId)
                ) ? childComment.replies.concat([reply]) : childComment.replies
              }
            })
          }
        })
      }
    case 'UPLOAD_TC_COMMENT':
      return {
        ...state,
        feeds: state.feeds.map(feed => {
          let comments = []
          if (feed.id === action.panelId) {
            let prevComments = feed.targetContentComments || []
            comments = prevComments.concat([action.data])
          }
          return {
            ...feed,
            targetContentComments: comments
          }
        })
      }
    default:
      return state
  }
}
