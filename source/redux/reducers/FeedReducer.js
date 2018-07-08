import FEED from '../constants/Feed'

const defaultState = {
  selectedFilter: 'all',
  scrollLocked: false,
  feeds: [],
  loaded: false,
  loadMoreButton: false
}

export default function FeedReducer(state = defaultState, action) {
  let loadMoreButton = false
  let commentsLoadMoreButton = false
  switch (action.type) {
    case FEED.ATTACH_STAR:
      return {
        ...state,
        feeds: state.feeds.map(feed => {
          const isComment = action.data.contentType === 'comment'
          const contentMatches =
            action.data.contentType === feed.type &&
            action.data.contentId === feed.id
          return {
            ...feed,
            stars: contentMatches
              ? (feed.stars || []).concat(action.data)
              : feed.stars || [],
            childComments: feed.childComments.map(comment => {
              return {
                ...comment,
                stars:
                  isComment && comment.id === action.data.contentId
                    ? (comment.stars || []).concat(action.data)
                    : comment.stars || [],
                replies: comment.replies.map(reply => ({
                  ...reply,
                  stars:
                    isComment && reply.id === action.data.contentId
                      ? (reply.stars || []).concat(action.data)
                      : reply.stars || []
                }))
              }
            }),
            targetObj: feed.targetObj
              ? {
                  ...feed.targetObj,
                  [action.data.contentType]: feed.targetObj[
                    action.data.contentType
                  ]
                    ? {
                        ...feed.targetObj[action.data.contentType],
                        stars:
                          action.data.contentId ===
                          feed.targetObj[action.data.contentType].id
                            ? (
                                feed.targetObj[action.data.contentType].stars ||
                                []
                              ).concat(action.data)
                            : feed.targetObj[action.data.contentType].stars
                      }
                    : undefined
                }
              : undefined
          }
        })
      }
    case FEED.CLEAR:
      return {
        ...state,
        feeds: [],
        loadMoreButton: false,
        loaded: false
      }
    case FEED.LIKE_COMMENT:
      return {
        ...state,
        feeds: state.feeds.map(feed => {
          let feedTypeIsComment = feed.type === 'comment'
          let feedContentMatches = feed.contentId === action.data.contentId
          return {
            ...feed,
            likes:
              feedTypeIsComment && feedContentMatches
                ? action.data.likes
                : feed.likes,
            targetObj: feed.targetObj
              ? {
                  ...feed.targetObj,
                  comment: feed.targetObj.comment
                    ? {
                        ...feed.targetObj.comment,
                        likes:
                          feed.targetObj.comment.id === action.data.contentId
                            ? action.data.likes
                            : feed.targetObj.comment.likes
                      }
                    : undefined
                }
              : undefined,
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
    case FEED.LIKE_CONTENT:
      return {
        ...state,
        feeds: state.feeds.map(feed => ({
          ...feed,
          likes:
            feed.type === action.data.rootType &&
            feed.id === action.data.contentId
              ? action.data.likes
              : feed.likes,
          rootObj: feed.rootObj
            ? {
                ...feed.rootObj,
                likes:
                  feed.rootType === action.data.rootType &&
                  feed.rootId === action.data.contentId
                    ? action.data.likes
                    : feed.rootObj.likes
              }
            : undefined
        }))
      }
    case FEED.LOAD:
      if (action.data.length > 20) {
        action.data.pop()
        loadMoreButton = true
      }
      return {
        ...state,
        feeds: state.feeds.concat(action.data),
        selectedFilter: action.filter || state.selectedFilter,
        loadMoreButton,
        loaded: true
      }
    case FEED.LOAD_DETAIL:
      return {
        ...state,
        feeds: state.feeds.map(
          feed =>
            feed.feedId === action.id ? { ...feed, ...action.data } : feed
        )
      }
    case FEED.LOAD_MORE_REPLIES:
      return {
        ...state,
        feeds: state.feeds.map(feed => {
          return {
            ...feed,
            childComments:
              feed.type === action.contentType
                ? feed.childComments.map(comment => {
                    return {
                      ...comment,
                      replies:
                        comment.id === action.commentId
                          ? action.data.replies.concat(comment.replies)
                          : comment.replies,
                      loadMoreReplies:
                        comment.id === action.commentId
                          ? action.data.loadMoreReplies
                          : comment.loadMoreReplies
                    }
                  })
                : feed.childComments
          }
        })
      }
    case FEED.LOAD_MORE:
      if (action.data.length > 20) {
        action.data.pop()
        loadMoreButton = true
      }
      return {
        ...state,
        feeds: state.feeds.concat(action.data),
        selectedFilter: action.filter || state.selectedFilter,
        loadMoreButton
      }
    case FEED.LOAD_NEW:
      return {
        ...state,
        feeds: action.data.concat(state.feeds)
      }
    case FEED.DELETE_COMMENT:
      return {
        ...state,
        feeds: state.feeds.reduce((prev, feed) => {
          if (
            feed.type === 'comment' &&
            (feed.contentId === action.commentId ||
              feed.commentId === action.commentId ||
              feed.replyId === action.commentId)
          ) {
            return prev
          }
          return prev.concat([
            {
              ...feed,
              targetObj: feed.targetObj
                ? {
                    ...feed.targetObj,
                    comment: feed.targetObj.comment
                      ? {
                          ...feed.targetObj.comment,
                          comments: feed.targetObj.comment.comments
                            ? feed.targetObj.comment.comments.filter(
                                comment => comment.id !== action.commentId
                              )
                            : []
                        }
                      : undefined
                  }
                : undefined,
              childComments: feed.childComments.reduce((prev, childComment) => {
                if (childComment.id === action.commentId) {
                  return prev
                }
                return prev.concat([
                  {
                    ...childComment,
                    replies: childComment.replies.reduce((prev, reply) => {
                      if (reply.id === action.commentId) {
                        return prev
                      }
                      return prev.concat([reply])
                    }, [])
                  }
                ])
              }, [])
            }
          ])
        }, [])
      }
    case FEED.DELETE_CONTENT:
      return {
        ...state,
        feeds: state.feeds.filter(
          feed =>
            feed.type !== action.contentType ||
            feed.contentId !== action.contentId
        )
      }
    case FEED.EDIT_COMMENT:
      return {
        ...state,
        feeds: state.feeds.map(feed => {
          let targetContentComments = feed.targetContentComments || []
          let isComment = feed.type === 'comment'
          let contentMatches = feed.contentId === action.commentId
          let commentMatches = feed.commentId === action.commentId
          let replyMatches = feed.replyId === action.commentId
          return {
            ...feed,
            content:
              isComment && contentMatches ? action.editedComment : feed.content,
            targetComment:
              isComment && commentMatches
                ? action.editedComment
                : feed.targetComment,
            targetReply:
              isComment && replyMatches
                ? action.editedComment
                : feed.targetReply,
            targetContentComments: targetContentComments.map(comment => ({
              ...comment,
              content:
                comment.id === action.commentId
                  ? action.editedComment
                  : comment.content
            })),
            childComments: feed.childComments.map(childComment => {
              return {
                ...childComment,
                content:
                  childComment.id === action.commentId
                    ? action.editedComment
                    : childComment.content,
                replies: childComment.replies.map(reply => ({
                  ...reply,
                  content:
                    reply.id === action.commentId
                      ? action.editedComment
                      : reply.content
                }))
              }
            })
          }
        })
      }
    case FEED.EDIT_CONTENT:
      return {
        ...state,
        feeds: state.feeds.map(feed => {
          let contentMatches =
            feed.type === action.contentType &&
            feed.contentId === action.contentId
          let rootContentMatches =
            feed.rootType === action.contentType &&
            feed.rootId === action.contentId
          return {
            ...feed,
            contentTitle: contentMatches
              ? action.editedTitle
              : feed.contentTitle,
            contentDescription: contentMatches
              ? action.editedDescription
              : feed.contentDescription,
            content: contentMatches ? action.editedUrl : feed.content,
            rootContentTitle: rootContentMatches
              ? action.editedTitle
              : feed.rootContentTitle,
            rootContent: rootContentMatches
              ? action.editedUrl
              : feed.rootContent
          }
        })
      }
    case FEED.EDIT_REWARD_COMMENT:
      return {
        ...state,
        feeds: state.feeds.map(feed => {
          return {
            ...feed,
            stars: feed.stars
              ? feed.stars.map(star => ({
                  ...star,
                  rewardComment:
                    star.id === action.id ? action.text : star.rewardComment
                }))
              : [],
            childComments: feed.childComments.map(comment => ({
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
            })),
            targetCommentStars: feed.targetCommentStars
              ? feed.targetCommentStars.map(star => ({
                  ...star,
                  rewardComment:
                    star.id === action.id ? action.text : star.rewardComment
                }))
              : []
          }
        })
      }
    case FEED.EDIT_QUESTION:
      return {
        ...state,
        feeds: state.feeds.map(feed => {
          let contentMatches =
            feed.type === 'question' && feed.contentId === action.contentId
          let rootContentMatches =
            feed.rootType === 'question' && feed.rootId === action.contentId
          return {
            ...feed,
            content: contentMatches ? action.editedContent : feed.content,
            contentDescription: contentMatches
              ? action.editedDescription
              : feed.description,
            rootContentTitle: rootContentMatches
              ? action.editedContent
              : feed.rootContentTitle,
            rootContent: rootContentMatches
              ? action.editedContent
              : feed.rootContent,
            rootContentDescription: rootContentMatches
              ? action.editedDescription
              : feed.rootContentDescription
          }
        })
      }
    case FEED.EDIT_DISCUSSION:
      return {
        ...state,
        feeds: state.feeds.map(feed => {
          let contentMatches =
            feed.type === 'discussion' && feed.contentId === action.contentId
          let discussionIdMatches =
            feed.type === 'comment' && feed.discussionId === action.contentId
          return {
            ...feed,
            contentTitle: contentMatches
              ? action.editedTitle
              : feed.contentTitle,
            contentDescription: contentMatches
              ? action.editedDescription
              : feed.contentDescription,
            discussionTitle: discussionIdMatches
              ? action.editedTitle
              : feed.discussionTitle,
            discussionDescription: discussionIdMatches
              ? action.editedDescription
              : feed.discussionDescription
          }
        })
      }
    case FEED.STAR_VIDEO:
      return {
        ...state,
        feeds: state.feeds.map(feed => {
          let contentMatches =
            feed.type === 'video' && feed.contentId === action.videoId
          let rootVideoMatches =
            feed.type === 'comment' &&
            feed.rootId === action.videoId &&
            feed.rootType === 'video'
          return {
            ...feed,
            isStarred: contentMatches ? action.isStarred : feed.isStarred,
            rootContentIsStarred: rootVideoMatches
              ? action.isStarred
              : feed.rootContentIsStarred
          }
        })
      }
    case FEED.LOAD_COMMENTS:
      if (action.data.type === 'comment') action.data.childComments.reverse()
      if (action.data.childComments.length > 3) {
        action.data.type === 'comment'
          ? action.data.childComments.shift()
          : action.data.childComments.pop()
        commentsLoadMoreButton = true
      }
      return {
        ...state,
        feeds: state.feeds.map(feed => {
          let match =
            feed.type === action.data.type &&
            feed.contentId === action.data.contentId
          return {
            ...feed,
            commentsLoadMoreButton: match
              ? commentsLoadMoreButton
              : feed.commentsLoadMoreButton,
            childComments: match
              ? action.data.childComments
              : feed.childComments,
            isReply: match ? action.data.isReply : feed.isReply
          }
        })
      }
    case FEED.LOAD_MORE_COMMENTS:
      if (action.data.type === 'comment') action.data.childComments.reverse()
      if (action.data.childComments.length > 3) {
        action.data.type === 'comment'
          ? action.data.childComments.shift()
          : action.data.childComments.pop()
        commentsLoadMoreButton = true
      }
      return {
        ...state,
        feeds: state.feeds.map(feed => {
          let match =
            feed.type === action.data.type &&
            feed.contentId === action.data.contentId
          return {
            ...feed,
            commentsLoadMoreButton,
            childComments: match
              ? action.data.type === 'comment'
                ? action.data.childComments.concat(feed.childComments)
                : feed.childComments.concat(action.data.childComments)
              : feed.childComments
          }
        })
      }
    case FEED.UPLOAD_CONTENT:
      return {
        ...state,
        feeds: [
          { ...action.data, newPost: true, commentsLoadMoreButton: false }
        ].concat(state.feeds)
      }
    case FEED.UPLOAD_COMMENT:
      return {
        ...state,
        feeds: state.feeds.map(feed => {
          return {
            ...feed,
            childComments:
              feed.type === action.data.type &&
              feed.contentId === action.data.contentId
                ? [action.data].concat(feed.childComments)
                : feed.childComments
          }
        })
      }
    case FEED.UPLOAD_TC_COMMENT:
      return {
        ...state,
        feeds: state.feeds.map(feed => {
          return {
            ...feed,
            targetObj:
              feed.feedId === action.panelId
                ? {
                    ...feed.targetObj,
                    comment: {
                      ...feed.targetObj.comment,
                      comments: [action.data].concat(
                        feed.targetObj.comment.comments || []
                      )
                    }
                  }
                : feed.targetObj
          }
        })
      }
    default:
      return state
  }
}
