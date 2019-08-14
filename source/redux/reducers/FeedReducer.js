import FEED from '../constants/Feed';

const defaultState = {
  currentSection: 'storyFeeds',
  category: 'uploads',
  scrollLocked: false,
  storyFeeds: [],
  profileFeeds: [],
  loaded: false,
  profileFeedsLoadMoreButton: false,
  storyFeedsLoadMoreButton: false,
  subFilter: 'all'
};

export default function FeedReducer(state = defaultState, action) {
  const { currentSection } = state;
  switch (action.type) {
    case FEED.ADD_TAGS:
      return {
        ...state,
        [currentSection]: state[currentSection].map(feed =>
          feed.type === action.contentType &&
          feed.contentId === action.contentId
            ? {
                ...feed,
                tags: (feed.tags || []).concat(action.tags)
              }
            : feed
        )
      };
    case FEED.ADD_TAG_TO_CONTENTS:
      return {
        ...state,
        [currentSection]: state[currentSection].map(feed => ({
          ...feed,
          tags:
            feed.type === action.contentType &&
            action.contentIds.includes(feed.contentId)
              ? (feed.tags || []).concat(action.tag)
              : feed.tags
        }))
      };
    case FEED.ATTACH_STAR:
      return {
        ...state,
        [currentSection]: state[currentSection].map(feed => {
          const isComment = action.data.contentType === 'comment';
          const contentMatches =
            action.data.contentType === feed.type &&
            action.data.contentId === feed.id;
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
              };
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
          };
        })
      };
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
              ? feed.childComments?.map(comment => ({
                  ...comment,
                  likes:
                    comment.id === action.data.contentId
                      ? action.data.likes
                      : comment.likes,
                  replies: comment.replies.map(reply => ({
                    ...reply,
                    likes:
                      reply.id === action.data.contentId
                        ? action.data.likes
                        : reply.likes,
                    replies: reply.replies.map(reply => ({
                      ...reply,
                      likes:
                        reply.id === action.data.contentId
                          ? action.data.likes
                          : reply.likes
                    }))
                  }))
                }))
              : feed.childComments
        }))
      };
    case FEED.CHANGE_BY_USER_STATUS:
      return {
        ...state,
        [currentSection]: state[currentSection].map(feed => {
          let contentMatches =
            feed.type === 'video' && feed.contentId === action.contentId;
          return {
            ...feed,
            byUser: contentMatches ? action.byUser : feed.byUser
          };
        })
      };
    case FEED.CHANGE_CATEGORY:
      return {
        ...state,
        category: action.category
      };
    case FEED.CHANGE_SPOILER_STATUS:
      return {
        ...state,
        [currentSection]: state[currentSection].map(feed => {
          const contentMatches =
            feed.type === 'subject' && feed.contentId === action.subjectId;
          const targetContentMatches =
            feed.targetObj?.subject?.id === action.subjectId;
          return contentMatches
            ? {
                ...feed,
                secretShown: action.shown
              }
            : {
                ...feed,
                secretShown: targetContentMatches
                  ? action.shown
                  : feed.secretShown,
                targetObj: feed.targetObj
                  ? {
                      ...feed.targetObj,
                      subject: feed.targetObj.subject
                        ? targetContentMatches
                          ? {
                              ...feed.targetObj.subject,
                              secretShown: action.shown
                            }
                          : feed.targetObj.subject
                        : undefined
                    }
                  : undefined
              };
        })
      };
    case FEED.CHANGE_SUB_FILTER:
      return {
        ...state,
        subFilter: action.filter
      };
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
            return prev;
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
                          comments: feed.targetObj.comment.comments?.filter(
                            comment => comment.id !== action.commentId
                          )
                        }
                      : undefined
                  }
                : undefined,
              childComments: feed.childComments?.reduce((prev, comment) => {
                if (comment.id === action.commentId) {
                  return prev;
                }
                return prev.concat([
                  {
                    ...comment,
                    replies: comment.replies?.filter(
                      reply => reply.id !== action.commentId
                    )
                  }
                ]);
              }, [])
            }
          ]);
        }, [])
      };
    case FEED.DELETE_CONTENT:
      return {
        ...state,
        [currentSection]: state[currentSection]
          .filter(
            feed =>
              feed.type !== action.contentType ||
              feed.contentId !== action.contentId
          )
          .map(feed =>
            action.contentType === 'comment'
              ? {
                  ...feed,
                  targetObj: feed.targetObj
                    ? {
                        ...feed.targetObj,
                        comment: feed.targetObj.comment
                          ? {
                              ...feed.targetObj.comment,
                              comments: feed.targetObj.comment.comments?.filter(
                                comment => comment.id !== action.contentId
                              )
                            }
                          : undefined
                      }
                    : undefined,
                  childComments: feed.childComments?.reduce((prev, comment) => {
                    if (comment.id === action.contentId) {
                      return prev;
                    }
                    return prev.concat([
                      {
                        ...comment,
                        replies: comment.replies?.filter(
                          reply => reply.id !== action.contentId
                        )
                      }
                    ]);
                  }, [])
                }
              : feed
          )
      };
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
                              ).map(comment =>
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
                childComments: feed.childComments?.map(comment => {
                  return comment.id === action.commentId
                    ? {
                        ...comment,
                        content: action.editedComment
                      }
                    : {
                        ...comment,
                        replies: comment.replies?.map(reply =>
                          reply.id === action.commentId
                            ? {
                                ...reply,
                                content: action.editedComment
                              }
                            : reply
                        )
                      };
                })
              };
        })
      };
    case FEED.EDIT_CONTENT:
      return {
        ...state,
        [currentSection]: state[currentSection].map(feed => {
          const contentMatches =
            feed.type === action.contentType &&
            feed.contentId === action.contentId;
          const rootContentMatches =
            feed.rootType === action.contentType &&
            feed.rootId === action.contentId;
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
                  : undefined,
                childComments:
                  action.contentType === 'comment'
                    ? feed.childComments?.map(comment => {
                        return comment.id === action.contentId
                          ? {
                              ...comment,
                              ...action.data
                            }
                          : {
                              ...comment,
                              replies: comment.replies?.map(reply =>
                                reply.id === action.contentId
                                  ? {
                                      ...reply,
                                      ...action.data
                                    }
                                  : reply
                              )
                            };
                      })
                    : feed.childComments
              };
        })
      };
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
          };
        })
      };
    case FEED.EDIT_SUBJECT:
      return {
        ...state,
        [currentSection]: state[currentSection].map(feed => {
          let contentMatches =
            feed.type === 'subject' && feed.contentId === action.contentId;
          let subjectIdMatches =
            feed.type === 'comment' && feed.subjectId === action.contentId;
          return {
            ...feed,
            contentTitle: contentMatches
              ? action.editedTitle
              : feed.contentTitle,
            contentDescription: contentMatches
              ? action.editedDescription
              : feed.contentDescription,
            subjectTitle: subjectIdMatches
              ? action.editedTitle
              : feed.subjectTitle,
            subjectDescription: subjectIdMatches
              ? action.editedDescription
              : feed.subjectDescription
          };
        })
      };
    case FEED.SET_SECTION:
      return {
        ...state,
        currentSection: action.section
      };
    case FEED.LOAD:
      return {
        ...state,
        [currentSection]: action.feeds,
        [`${currentSection}LoadMoreButton`]: action.loadMoreButton,
        loaded: true
      };
    case FEED.LOAD_MORE:
      return {
        ...state,
        [currentSection]: state[currentSection].concat(action.feeds),
        [`${currentSection}LoadMoreButton`]: action.loadMoreButton
      };
    case FEED.LOAD_DETAIL:
      return {
        ...state,
        [currentSection]: state[currentSection].map(feed =>
          feed.feedId === action.feedId ? { ...feed, ...action.data } : feed
        )
      };
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
                    : comment;
                })
              }
            : feed;
        })
      };
    case FEED.LOAD_NEW:
      return {
        ...state,
        storyFeeds: action.data.concat(state.storyFeeds)
      };
    case FEED.LOAD_REPLIES_OF_REPLY:
      return {
        ...state,
        [currentSection]: state[currentSection].map(feed => ({
          ...feed,
          childComments: feed.childComments?.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: [
                  ...comment.replies.filter(
                    reply => reply.id <= action.replyId
                  ),
                  ...action.replies,
                  ...comment.replies.filter(reply => reply.id > action.replyId)
                ]
              };
            }
            let containsRootReply = false;
            for (let reply of comment.replies) {
              if (reply.id === action.replyId) {
                containsRootReply = true;
                break;
              }
            }
            if (containsRootReply) {
              return {
                ...comment,
                replies: [
                  ...comment.replies.filter(
                    reply => reply.id <= action.replyId
                  ),
                  ...action.replies,
                  ...comment.replies.filter(reply => reply.id > action.replyId)
                ]
              };
            }
            return comment;
          })
        }))
      };
    case FEED.LOAD_TAGS:
      return {
        ...state,
        [currentSection]: state[currentSection].map(feed => ({
          ...feed,
          tags:
            feed.type === action.contentType &&
            feed.contentId === action.contentId
              ? action.tags
              : feed.tags
        }))
      };
    case FEED.LOAD_COMMENTS:
      if (action.data.comments.length === 0) return state;
      return {
        ...state,
        [currentSection]: state[currentSection].map(feed => {
          return feed.feedId === action.feedId
            ? {
                ...feed,
                commentsLoadMoreButton: action.data.loadMoreButton,
                childComments: action.data.comments
              }
            : feed;
        })
      };
    case FEED.LOAD_MORE_COMMENTS:
      return {
        ...state,
        [currentSection]: state[currentSection].map(feed => {
          let match = feed.feedId === action.feedId;
          return match
            ? {
                ...feed,
                commentsLoadMoreButton: action.data.loadMoreButton,
                childComments:
                  action.contentType === 'comment'
                    ? action.data.comments.concat(feed.childComments || [])
                    : (feed.childComments || []).concat(action.data.comments)
              }
            : feed;
        })
      };
    case FEED.SET_REWARD_LEVEL:
      return {
        ...state,
        [currentSection]: state[currentSection].map(feed => {
          return feed.type === action.contentType &&
            feed.id === action.contentId
            ? {
                ...feed,
                rewardLevel: action.rewardLevel
              }
            : {
                ...feed,
                rootObj: feed.rootObj
                  ? feed.rootType === action.contentType &&
                    feed.rootId === action.contentId
                    ? {
                        ...feed.rootObj,
                        rewardLevel: action.rewardLevel
                      }
                    : feed.rootObj
                  : undefined,
                targetObj: feed.targetObj
                  ? feed.targetObj.subject &&
                    feed.subjectId === action.contentId
                    ? {
                        ...feed.targetObj,
                        subject: {
                          ...feed.targetObj.subject,
                          rewardLevel: action.rewardLevel
                        }
                      }
                    : feed.targetObj
                  : undefined
              };
        })
      };
    case FEED.UPLOAD_CONTENT:
      return {
        ...state,
        [currentSection]: [action.data].concat(state[currentSection])
      };
    case FEED.UPLOAD_COMMENT:
      const commentId = action.comment.replyId || action.comment.commentId;
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
            };
          } else {
            return {
              ...feed,
              childComments: (feed.childComments || []).map(childComment => {
                let match = false;
                if (childComment.id === commentId) {
                  match = true;
                } else {
                  for (let reply of childComment.replies || []) {
                    if (reply.id === commentId) {
                      match = true;
                      break;
                    }
                  }
                }
                return {
                  ...childComment,
                  replies: match
                    ? childComment.replies.concat([action.comment])
                    : childComment.replies
                };
              })
            };
          }
        })
      };
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
          };
        })
      };
    default:
      return state;
  }
}
