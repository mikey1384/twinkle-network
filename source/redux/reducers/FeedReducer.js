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
    case 'CLEAR_FEEDS':
      return {
        ...state,
        feeds: [],
        loadMoreButton: false,
        loaded: false
      }
    case 'FETCH_FEED':
      return {
        ...state,
        feeds: state.feeds.map(feed => {
          return feed.id === action.data.id ? action.data : feed
        })
      }
    case 'FETCH_FEEDS':
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
    case 'FETCH_MORE_FEED_REPLIES':
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
          let targetContentMatches =
            (!feed.replyId && feed.commentId === action.data.contentId) ||
            feed.replyId === action.data.contentId
          return {
            ...feed,
            contentLikers: contentMatches
              ? action.data.likes
              : feed.contentLikers,
            targetContentLikers: targetContentMatches
              ? action.data.likes
              : feed.targetContentLikers
          }
        })
      }
    case 'FEED_COMMENT_DELETE':
      return {
        ...state,
        feeds: state.feeds.reduce((resultingArray, feed) => {
          if (
            feed.contentId === action.commentId ||
            feed.commentId === action.commentId ||
            feed.replyId === action.commentId
          ) {
            return resultingArray
          }
          return resultingArray.concat([
            {
              ...feed,
              targetContentComments: feed.targetContentComments
                ? feed.targetContentComments.filter(
                    comment => comment.id !== action.commentId
                  )
                : [],
              childComments: feed.childComments.reduce(
                (resultingArray, childComment) => {
                  if (childComment.id === action.commentId) {
                    return resultingArray
                  }
                  return resultingArray.concat([
                    {
                      ...childComment,
                      replies: childComment.replies.reduce(
                        (resultingArray, reply) => {
                          if (reply.id === action.commentId) {
                            return resultingArray
                          }
                          return resultingArray.concat([reply])
                        },
                        []
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
    case 'FEED_CONTENT_DELETE':
      return {
        ...state,
        feeds: state.feeds.filter(
          feed =>
            feed.type !== action.contentType ||
            feed.contentId !== action.contentId
        )
      }
    case 'FEED_COMMENT_EDIT':
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
    case 'FEED_CONTENT_EDIT':
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
    case 'FEED_QUESTION_EDIT':
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
    case 'FEED_DISCUSSION_EDIT':
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
    case 'FEED_VIDEO_STAR':
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
    case 'COMMENT_FEED_LIKE':
      return {
        ...state,
        feeds: state.feeds.map(feed => {
          let feedTypeIsComment = feed.type === 'comment'
          let feedContentMatches = feed.contentId === action.data.contentId
          let targetContentMatches =
            (!feed.replyId && feed.commentId === action.data.contentId) ||
            feed.replyId === action.data.contentId
          return {
            ...feed,
            contentLikers:
              feedTypeIsComment && feedContentMatches
                ? action.data.likes
                : feed.contentLikers,
            targetContentLikers:
              feedTypeIsComment && targetContentMatches
                ? action.data.likes
                : feed.targetContentLikers,
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
          contentLikers:
            feed.rootType === action.data.rootType &&
            feed.contentId === action.data.contentId
              ? action.data.likes
              : feed.contentLikers,
          rootContentLikers:
            feed.type === 'comment' &&
            feed.rootType === action.data.rootType &&
            feed.rootId === action.data.contentId
              ? action.data.likes
              : feed.rootContentLikers
        }))
      }
    case 'QUESTION_FEED_LIKE':
      return {
        ...state,
        feeds: state.feeds.map(feed => ({
          ...feed,
          contentLikers:
            feed.rootType === 'question' &&
            feed.contentId === action.data.contentId
              ? action.data.likes
              : feed.contentLikers,
          rootContentLikers:
            feed.type === 'comment' &&
            feed.rootType === 'question' &&
            feed.rootId === action.data.contentId
              ? action.data.likes
              : feed.rootContentLikers
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
          let match =
            feed.type === action.data.type &&
            feed.contentId === action.data.contentId
          return {
            ...feed,
            commentsLoadMoreButton,
            childComments: match
              ? feed.childComments.concat(action.data.childComments)
              : feed.childComments
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
    case 'UPLOAD_CONTENT':
      return {
        ...state,
        feeds: [{ ...action.data, commentsLoadMoreButton: false }].concat(
          state.feeds
        )
      }
    case 'UPLOAD_FEED_COMMENT':
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
    case 'UPLOAD_FEED_REPLY':
      let { reply } = action.data
      return {
        ...state,
        feeds: state.feeds.map(feed => {
          let match =
            feed.type === action.data.type &&
            feed.type === 'comment' &&
            feed.contentId === action.data.contentId
          let comments = match
            ? [reply].concat(feed.childComments)
            : feed.childComments
          return {
            ...feed,
            childComments: comments.map(childComment => {
              return {
                ...childComment,
                replies:
                  (feed.type === 'comment' &&
                    childComment.id === action.data.contentId) ||
                  (feed.type !== 'comment' &&
                    childComment.id === action.data.commentId) ||
                  (feed.type !== 'comment' &&
                    childComment.id === action.data.reply.commentId)
                    ? childComment.replies.concat([reply])
                    : childComment.replies
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
            comments = [action.data].concat(prevComments)
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
