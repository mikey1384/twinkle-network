import FEED from '../constants/Feed'

const defaultState = {
  currentSection: 'storyFeeds',
  selectedFilter: 'all',
  scrollLocked: false,
  storyFeeds: [],
  profileFeeds: [],
  loaded: false,
  loadMoreButton: false
}

export default function FeedReducer(state = defaultState, action) {
  let loadMoreButton = false
  const { currentSection } = state
  switch (action.type) {
    case FEED.ATTACH_STAR:
      return {
        ...state,
        [currentSection]: state[currentSection].map(feed => {
          const isComment = action.data.contentType === 'comment'
          const contentMatches =
            action.data.contentType === feed.type &&
            action.data.contentId === feed.id
          return {
            ...feed,
            stars: contentMatches
              ? (feed.stars || []).concat(action.data)
              : feed.stars || [],
            childComments: (feed.childComments || []).map(comment => {
              return {
                ...comment,
                stars:
                  isComment && comment.id === action.data.contentId
                    ? (comment.stars || []).concat(action.data)
                    : comment.stars || [],
                replies: (comment.replies || []).map(reply => ({
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
        [currentSection]: [],
        loadMoreButton: false,
        loaded: false
      }
    case FEED.LIKE_CONTENT:
      return {
        ...state,
        [currentSection]: state[currentSection].map(feed => ({
          ...feed,
          likes:
            feed.type === action.data.type && feed.id === action.data.contentId
              ? action.data.likes
              : feed.likes,
          rootObj: feed.rootObj
            ? {
                ...feed.rootObj,
                likes:
                  feed.rootType === action.data.type &&
                  feed.rootId === action.data.contentId
                    ? action.data.likes
                    : feed.rootObj.likes
              }
            : undefined,
          targetObj: feed.targetObj
            ? {
                ...feed.targetObj,
                comment:
                  feed.targetObj.comment &&
                  feed.targetObj.comment.id === action.data.contentId &&
                  action.data.type === 'comment'
                    ? {
                        ...feed.targetObj.comment,
                        likes: action.data.likes
                      }
                    : feed.targetObj.comment
              }
            : undefined,
          childComments:
            action.data.type === 'comment'
              ? (feed.childComments || []).map(
                  comment =>
                    comment.id === action.data.contentId
                      ? { ...comment, likes: action.data.likes }
                      : {
                          ...comment,
                          replies: (comment.replies || []).map(
                            reply =>
                              reply.id === action.data.contentId
                                ? { ...reply, likes: action.data.likes }
                                : reply
                          )
                        }
                )
              : feed.childComments
        }))
      }
    case FEED.LOAD:
      if (action.data.length > 20) {
        action.data.pop()
        loadMoreButton = true
      }
      return {
        ...state,
        [currentSection]: state[currentSection].concat(action.data),
        selectedFilter: action.filter || state.selectedFilter,
        loadMoreButton,
        loaded: true
      }
    case FEED.LOAD_DETAIL:
      return {
        ...state,
        [currentSection]: state[currentSection].map(
          feed =>
            feed.feedId === action.feedId ? { ...feed, ...action.data } : feed
        )
      }
    case FEED.LOAD_MORE_REPLIES:
      return {
        ...state,
        [currentSection]: state[currentSection].map(feed => {
          return feed.feedId === action.feedId
            ? {
                ...feed,
                childComments: feed.childComments.map(comment => {
                  return comment.id === action.data.commentId
                    ? {
                        ...comment,
                        replies: action.data.replies.concat(comment.replies),
                        loadMoreButton: action.data.loadMoreButton
                      }
                    : comment
                })
              }
            : feed
        })
      }
    case FEED.LOAD_MORE:
      if (action.data.length > 20) {
        action.data.pop()
        loadMoreButton = true
      }
      return {
        ...state,
        [currentSection]: state[currentSection].concat(action.data),
        selectedFilter: action.filter || state.selectedFilter,
        loadMoreButton
      }
    case FEED.LOAD_NEW:
      return {
        ...state,
        story: action.data.concat(state.story)
      }
    case FEED.DELETE_COMMENT:
      return {
        ...state,
        [currentSection]: state[currentSection].reduce((prev, feed) => {
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
                          comments: (
                            feed.targetObj.comment.comments || []
                          ).filter(comment => comment.id !== action.commentId)
                        }
                      : undefined
                  }
                : undefined,
              childComments: (feed.childComments || []).reduce(
                (prev, comment) => {
                  if (comment.id === action.commentId) {
                    return prev
                  }
                  return prev.concat([
                    {
                      ...comment,
                      replies: (comment.replies || []).filter(
                        reply => reply.id !== action.commentId
                      )
                    }
                  ])
                },
                []
              )
            }
          ])
        }, [])
      }
    case FEED.DELETE_CONTENT:
      return {
        ...state,
        [currentSection]: state[currentSection].filter(
          feed =>
            feed.type !== action.contentType ||
            feed.contentId !== action.contentId
        )
      }
    case FEED.EDIT_COMMENT:
      return {
        ...state,
        [currentSection]: state[currentSection].map(feed => {
          return feed.id === action.commentId && feed.type === 'comment'
            ? {
                ...feed,
                content: action.editedComment
              }
            : {
                ...feed,
                targetObj: feed.targetObj
                  ? {
                      ...feed.targetObj,
                      comment: feed.targetObj.comment
                        ? feed.targetObj.comment.id === action.commentId
                          ? {
                              ...feed.targetObj.comment,
                              content: action.editedComment
                            }
                          : {
                              ...feed.targetObj.comment,
                              comments: (
                                feed.targetObj.comment.comments || []
                              ).map(
                                comment =>
                                  comment.id === action.commentId
                                    ? {
                                        ...comment,
                                        content: action.editedComment
                                      }
                                    : comment
                              )
                            }
                        : undefined
                    }
                  : undefined,
                childComments: (feed.childComments || []).map(comment => {
                  return comment.id === action.commentId
                    ? {
                        ...comment,
                        content: action.editedComment
                      }
                    : {
                        ...comment,
                        replies: (comment.replies || []).map(
                          reply =>
                            reply.id === action.commentId
                              ? {
                                  ...reply,
                                  content: action.editedComment
                                }
                              : reply
                        )
                      }
                })
              }
        })
      }
    case FEED.EDIT_CONTENT:
      return {
        ...state,
        [currentSection]: state[currentSection].map(feed => {
          const contentMatches =
            feed.type === action.contentType &&
            feed.contentId === action.contentId
          const rootContentMatches =
            feed.rootType === action.contentType &&
            feed.rootId === action.contentId
          return contentMatches
            ? {
                ...feed,
                ...action.data
              }
            : rootContentMatches
              ? {
                  ...feed,
                  rootObj: {
                    ...feed.rootObj,
                    ...action.data
                  }
                }
              : {
                  ...feed,
                  targetObj: feed.targetObj
                    ? {
                        ...feed.targetObj,
                        [action.contentType]: feed.targetObj[action.contentType]
                          ? feed.targetObj[action.contentType].id ===
                            action.contentId
                            ? {
                                ...feed.targetObj[action.contentType],
                                ...action.data
                              }
                            : feed.targetObj[action.contentType]
                          : undefined
                      }
                    : undefined
                }
        })
      }
    case FEED.EDIT_REWARD_COMMENT:
      return {
        ...state,
        [currentSection]: state[currentSection].map(feed => {
          return {
            ...feed,
            stars: feed.stars
              ? feed.stars.map(star => ({
                  ...star,
                  rewardComment:
                    star.id === action.id ? action.text : star.rewardComment
                }))
              : [],
            childComments: (feed.childComments || []).map(comment => ({
              ...comment,
              stars: comment.stars
                ? comment.stars.map(star => ({
                    ...star,
                    rewardComment:
                      star.id === action.id ? action.text : star.rewardComment
                  }))
                : [],
              replies: (comment.replies || []).map(reply => ({
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
            targetObj: feed.targetObj
              ? {
                  ...feed.targetObj,
                  comment: feed.targetObj.comment
                    ? {
                        ...feed.targetObj.comment,
                        stars: feed.targetObj.comment.stars
                          ? feed.targetObj.comment.stars.map(star => ({
                              ...star,
                              rewardComment:
                                star.id === action.id
                                  ? action.text
                                  : star.rewardComment
                            }))
                          : []
                      }
                    : undefined
                }
              : undefined
          }
        })
      }
    case FEED.EDIT_QUESTION:
      return {
        ...state,
        [currentSection]: state[currentSection].map(feed => {
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
        [currentSection]: state[currentSection].map(feed => {
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
    case FEED.SET_SECTION:
      return {
        ...state,
        currentSection: action.section
      }
    case FEED.STAR_VIDEO:
      return {
        ...state,
        [currentSection]: state[currentSection].map(feed => {
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
      if (action.data.comments.length === 0) return state
      return {
        ...state,
        [currentSection]: state[currentSection].map(feed => {
          return feed.feedId === action.feedId
            ? {
                ...feed,
                commentsLoadMoreButton: action.data.loadMoreButton,
                childComments: action.data.comments
              }
            : feed
        })
      }
    case FEED.LOAD_MORE_COMMENTS:
      return {
        ...state,
        [currentSection]: state[currentSection].map(feed => {
          let match = feed.feedId === action.feedId
          return match
            ? {
                ...feed,
                commentsLoadMoreButton: action.data.loadMoreButton,
                childComments:
                  action.contentType === 'comment'
                    ? action.data.comments.concat(feed.childComments || [])
                    : (feed.childComments || []).concat(action.data.comments)
              }
            : feed
        })
      }
    case FEED.UPLOAD_CONTENT:
      return {
        ...state,
        [currentSection]: [action.data].concat(state[currentSection])
      }
    case FEED.UPLOAD_COMMENT:
      const commentId = action.comment.replyId || action.comment.commentId
      return {
        ...state,
        [currentSection]: state[currentSection].map(feed => {
          if (
            (feed.type === 'comment' && feed.id === commentId) ||
            (feed.type !== 'comment' &&
              !commentId &&
              feed.type === action.contentType &&
              feed.id === action.contentId)
          ) {
            return {
              ...feed,
              childComments:
                feed.type === 'comment'
                  ? (feed.childComments || []).concat([action.comment])
                  : [action.comment].concat(feed.childComments || [])
            }
          } else {
            return {
              ...feed,
              childComments: (feed.childComments || []).map(childComment => {
                let match = false
                if (childComment.id === commentId) {
                  match = true
                } else {
                  for (let reply of childComment.replies || []) {
                    if (reply.id === commentId) {
                      match = true
                      break
                    }
                  }
                }
                return {
                  ...childComment,
                  replies: match
                    ? childComment.replies.concat([action.comment])
                    : childComment.replies
                }
              })
            }
          }
        })
      }
    case FEED.UPLOAD_TC_COMMENT:
      return {
        ...state,
        [currentSection]: state[currentSection].map(feed => {
          return {
            ...feed,
            targetObj:
              feed.feedId === action.feedId
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
