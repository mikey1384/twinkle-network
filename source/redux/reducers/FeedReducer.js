import {processedStringWithURL} from 'helpers/stringHelpers'
const defaultState = {
  feeds: null,
  noFeeds: false,
  selectedFilter: 'all',
  newFeeds: [], // may need later but delete it if revealed otherwise
  loadMoreButton: false,
  categorySearchResult: []
}

export default function FeedReducer(state = defaultState, action) {
  let loadMoreButton = false
  let commentsLoadMoreButton = false
  let noFeeds = false
  switch (action.type) {
    case 'CLEAR_CATEGORIES_SEARCH':
      return {
        ...state,
        categorySearchResult: []
      }
    case 'CLEAR_FEEDS':
      return {
        ...state,
        feeds: []
      }
    case 'FETCH_CATEGORIES':
      return {
        ...state,
        categorySearchResult: action.data
      }
    case 'FETCH_FEED':
      return {
        ...state,
        feeds: state.feeds.map(feed => {
          if (feed.id === action.data.id) {
            feed = action.data
          }
          return feed
        })
      }
    case 'FETCH_FEEDS':
      if (action.data.length > 20) {
        action.data.pop()
        loadMoreButton = true
      }
      if (action.data.length === 0) noFeeds = true
      return {
        ...state,
        feeds: action.data,
        selectedFilter: action.filter,
        loadMoreButton,
        noFeeds
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
        selectedFilter: action.filter,
        loadMoreButton
      }
    case 'FEED_TARGET_VIDEO_COMMENT_LIKE':
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
    case 'FEED_VIDEO_COMMENT_DELETE':
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
    case 'FEED_VIDEO_COMMENT_EDIT':
      let editedComment = processedStringWithURL(action.data.editedComment)
      return {
        ...state,
        feeds: state.feeds.map(feed => {
          let targetContentComments = feed.targetContentComments || []
          if (feed.type === 'comment') {
            if (feed.contentId === action.data.commentId) {
              feed.content = editedComment
            }
            if (feed.commentId === action.data.commentId) {
              feed.targetComment = editedComment
            }
            if (feed.replyId === action.data.commentId) {
              feed.targetReply = editedComment
            }
          }
          return {
            ...feed,
            targetContentComments: targetContentComments.map(comment => ({
              ...comment,
              content: comment.id === action.data.commentId ? editedComment : comment.content
            })),
            childComments: feed.childComments.map(childComment => {
              if (childComment.id === action.data.commentId) {
                childComment.content = editedComment
              }
              return {
                ...childComment,
                replies: childComment.replies.map(reply => {
                  if (reply.id === action.data.commentId) {
                    reply.content = editedComment
                  }
                  return reply
                })
              }
            })
          }
        })
      }
    case 'FEED_VIDEO_COMMENT_LIKE':
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
    case 'FEED_VIDEO_LIKE':
      return {
        ...state,
        feeds: state.feeds.map(feed => ({
          ...feed,
          contentLikers: feed.contentId === action.data.contentId ?
            action.data.likes : feed.contentLikers,
          parentContentLikers: feed.type === 'comment' && feed.parentContentId === action.data.contentId ?
            action.data.likes : feed.parentContentLikers
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
            commentsShown: match ? true : feed.commentsShown,
            commentsLoadMoreButton: match ? commentsLoadMoreButton : feed.commentsLoadMoreButton,
            childComments: match ? action.data.childComments : feed.childComments,
            isReply: match ? action.data.isReply : feed.isReply
          }
        })
      }
    case 'UPLOAD_CONTENT':
      return {
        ...state,
        categorySearchResult: [],
        feeds: [action.data].concat(state.feeds)
      }
    case 'UPLOAD_FEED_VIDEO_COMMENT':
      return {
        ...state,
        feeds: state.feeds.map(feed => {
          return {
            ...feed,
            childComments: feed.type === action.data.type && feed.contentId === action.data.contentId ?
              (
                action.data.type === 'video' ?
                action.data.comments : [action.data].concat(feed.childComments)
              ) :
              feed.childComments
          }
        }),
        newFeeds: action.data.type === 'video' ? state.newFeeds.concat([action.data.comments[0]]) : state.newFeeds.concat([action.data])
      }
    case 'UPLOAD_FEED_VIDEO_REPLY':
      let {reply} = action.data
      return {
        ...state,
        feeds: state.feeds.map(feed => {
          if (feed.type === action.data.type && feed.contentId === action.data.contentId) {
            let {reply} = action.data
            if (feed.type === 'comment') {
              feed.childComments = [reply].concat(feed.childComments)
            }
          }
          return {
            ...feed,
            childComments: feed.childComments.map(childComment => {
              let {replies} = childComment
              replies = (
                (feed.type === 'comment' && childComment.id === action.data.contentId) ||
                (feed.type !== 'comment' && childComment.id === action.data.commentId) ||
                (feed.type !== 'comment' && childComment.id === action.data.reply.commentId)
              ) ? replies.concat([reply]) : replies
              return {
                ...childComment,
                replies
              }
            })
          }
        }),
        newFeeds: state.newFeeds.concat([reply])
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
