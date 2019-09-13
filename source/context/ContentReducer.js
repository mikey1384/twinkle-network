export default function ContentPageReducer(state, action) {
  const contentKey =
    action.contentType && action.contentId
      ? action.contentType + action.contentId
      : 'temp';
  const prevContentState = state[contentKey] || {
    stars: [],
    childComments: [],
    likes: [],
    subjects: [],
    commentsLoadMoreButton: false,
    subjectsLoadMoreButton: false
  };
  switch (action.type) {
    case 'INIT_CONTENT':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          ...action.data,
          contentId: action.contentId,
          contentType: action.contentType
        }
      };
    case 'ADD_TAGS':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          tags: prevContentState.concat(action.tags)
        }
      };
    case 'ATTACH_STAR':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          stars: (prevContentState.stars || []).concat(action.data),
          childComments: prevContentState.childComments?.map(comment => {
            return {
              ...comment,
              stars:
                comment.id === action.data.contentId &&
                action.data.contentType === 'comment'
                  ? (comment.stars || []).concat(action.data)
                  : comment.stars || [],
              replies: comment.replies.map(reply => ({
                ...reply,
                stars:
                  reply.id === action.data.contentId &&
                  action.data.contentType === 'comment'
                    ? (reply.stars || []).concat(action.data)
                    : reply.stars || []
              }))
            };
          }),
          subjects: prevContentState.subjects?.map(subject => ({
            ...subject,
            comments: subject.comments.map(comment => ({
              ...comment,
              stars:
                comment.id === action.data.contentId
                  ? comment.stars?.concat(action.data)
                  : comment.stars || [],
              replies: comment.replies.map(reply => ({
                ...reply,
                stars:
                  reply.id === action.data.contentId
                    ? reply.stars?.concat(action.data)
                    : reply.stars || []
              }))
            }))
          })),
          targetObj: prevContentState.targetObj
            ? {
                ...prevContentState.targetObj,
                comment: prevContentState.targetObj.comment
                  ? {
                      ...prevContentState.targetObj.comment,
                      stars:
                        prevContentState.targetObj.comment.id ===
                          action.data.contentId &&
                        action.data.contentType === 'comment'
                          ? (
                              prevContentState.targetObj.comment.stars || []
                            ).concat(action.data)
                          : prevContentState.targetObj.comment.stars
                    }
                  : undefined
              }
            : undefined
        }
      };
    case 'CHANGE_SPOILER_STATUS':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          secretShown: action.shown,
          targetObj: prevContentState.targetObj
            ? {
                ...prevContentState.targetObj,
                subject: prevContentState.targetObj.subject
                  ? {
                      ...prevContentState.targetObj.subject,
                      secretShown: action.shown
                    }
                  : undefined
              }
            : undefined
        }
      };
    case 'DELETE_COMMENT': {
      const newState = { ...state };
      const contentKeys = Object.keys(newState);
      for (let contentKey of contentKeys) {
        const prevContentState = newState[contentKey];
        newState[contentKey] = {
          ...prevContentState,
          childComments: prevContentState.childComments
            ?.filter(comment => comment.id !== action.commentId)
            .map(comment => ({
              ...comment,
              replies: comment.replies?.filter(
                reply => reply.id !== action.commentId
              )
            })),
          subjects: prevContentState.subjects?.map(subject => ({
            ...subject,
            comments: subject.comments
              ?.filter(comment => comment.id !== action.commentId)
              .map(comment => ({
                ...comment,
                replies: comment.replies?.filter(
                  reply => reply.id !== action.commentId
                )
              }))
          })),
          targetObj: prevContentState.targetObj
            ? {
                ...prevContentState.targetObj,
                comment: prevContentState.targetObj.comment
                  ? {
                      ...prevContentState.targetObj.comment,
                      comments: prevContentState.targetObj.comment.comments?.filter(
                        comment => comment.id !== action.commentId
                      )
                    }
                  : undefined
              }
            : undefined
        };
      }
      return newState;
    }
    case 'DELETE_SUBJECT': {
      const newState = { ...state };
      const contentKeys = Object.keys(newState);
      for (let contentKey of contentKeys) {
        const prevContentState = newState[contentKey];
        newState[contentKey] = {
          ...prevContentState,
          subjects: prevContentState.subjects?.filter(
            subject => subject.id !== action.subjectId
          )
        };
      }
      return newState;
    }
    case 'EDIT_COMMENT': {
      const newState = { ...state };
      const contentKeys = Object.keys(newState);
      for (let contentKey of contentKeys) {
        const prevContentState = newState[contentKey];
        newState[contentKey] = {
          ...prevContentState,
          childComments: prevContentState.childComments.map(comment => ({
            ...comment,
            content:
              comment.id === action.commentId
                ? action.editedComment
                : comment.content,
            replies: comment.replies?.map(reply =>
              reply.id === action.commentId
                ? {
                    ...reply,
                    content: action.editedComment
                  }
                : reply
            )
          })),
          targetObj: prevContentState.targetObj
            ? {
                ...prevContentState.targetObj,
                comment: prevContentState.targetObj.comment
                  ? {
                      ...prevContentState.targetObj.comment,
                      comments: prevContentState.targetObj.comment.comments?.map(
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
          subjects: prevContentState.subjects?.map(subject => ({
            ...prevContentState,
            comments: subject.comments?.map(comment => ({
              ...comment,
              content:
                comment.id === action.commentId
                  ? action.editedComment
                  : comment.content,
              replies: comment.replies?.map(reply =>
                reply.id === action.commentId
                  ? {
                      ...reply,
                      content: action.editedComment
                    }
                  : reply
              )
            }))
          }))
        };
      }
      return newState;
    }
    case 'EDIT_CONTENT': {
      const newState = { ...state };
      const contentKeys = Object.keys(newState);
      for (let contentKey of contentKeys) {
        const prevContentState = newState[contentKey];
        newState[contentKey] = {
          ...prevContentState,
          ...action.data
        };
      }
      return newState;
    }
    case 'EDIT_REWARD_COMMENT':
      const newState = { ...state };
      const contentKeys = Object.keys(newState);
      for (let contentKey of contentKeys) {
        const prevContentState = newState[contentKey];
        newState[contentKey] = {
          ...prevContentState,
          stars: prevContentState.stars?.map(star => ({
            ...star,
            rewardComment:
              star.id === action.id ? action.text : star.rewardComment
          })),
          childComments: prevContentState.childComments?.map(comment => ({
            ...comment,
            stars: comment.stars?.map(star => ({
              ...star,
              rewardComment:
                star.id === action.id ? action.text : star.rewardComment
            })),
            replies: comment.replies.map(reply => ({
              ...reply,
              stars: reply.stars?.map(star => ({
                ...star,
                rewardComment:
                  star.id === action.id ? action.text : star.rewardComment
              }))
            }))
          })),
          subjects: prevContentState.subjects?.map(subject => ({
            ...subject,
            comments: subject.comments.map(comment => ({
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
          })),
          targetObj: prevContentState.targetObj
            ? {
                ...prevContentState.targetObj,
                comment: prevContentState.targetObj.comment
                  ? {
                      ...prevContentState.targetObj.comment,
                      stars: prevContentState.targetObj.comment.stars?.map(
                        star => ({
                          ...star,
                          rewardComment:
                            star.id === action.id
                              ? action.text
                              : star.rewardComment
                        })
                      )
                    }
                  : undefined
              }
            : undefined
        };
      }
      return newState;
    case 'EDIT_SUBJECT': {
      const newState = { ...state };
      const contentKeys = Object.keys(newState);
      for (let contentKey of contentKeys) {
        const prevContentState = newState[contentKey];
        newState[contentKey] = {
          ...prevContentState,
          subjects: prevContentState.subjects?.map(subject =>
            subject.id === action.subjectId
              ? {
                  ...subject,
                  ...action.editedSubject
                }
              : subject
          )
        };
      }
      return newState;
    }
    case 'LIKE_COMMENT': {
      const newState = { ...state };
      const contentKeys = Object.keys(newState);
      for (let contentKey of contentKeys) {
        const prevContentState = newState[contentKey];
        newState[contentKey] = {
          ...prevContentState,
          childComments: prevContentState.childComments.map(comment => {
            return {
              ...comment,
              likes:
                comment.id === action.commentId ? action.likes : comment.likes,
              replies: comment.replies.map(reply => {
                return {
                  ...reply,
                  likes:
                    reply.id === action.commentId ? action.likes : reply.likes
                };
              })
            };
          }),
          subjects: prevContentState.subjects.map(subject => {
            return {
              ...subject,
              comments: subject.comments.map(comment => {
                return {
                  ...comment,
                  likes:
                    comment.id === action.commentId
                      ? action.likes
                      : comment.likes,
                  replies: comment.replies.map(reply => {
                    return {
                      ...reply,
                      likes:
                        reply.id === action.commentId
                          ? action.likes
                          : reply.likes
                    };
                  })
                };
              })
            };
          })
        };
      }
      return newState;
    }
    case 'LIKE_CONTENT': {
      const newState = { ...state };
      const contentKeys = Object.keys(newState);
      for (let contentKey of contentKeys) {
        const prevContentState = newState[contentKey];
        newState[contentKey] = {
          ...prevContentState,
          likes:
            prevContentState.id === action.contentId &&
            prevContentState.contentType === action.contentType
              ? action.likes
              : prevContentState.likes,
          childComments:
            action.contentType === 'comment'
              ? prevContentState.childComments.map(comment => ({
                  ...comment,
                  likes:
                    comment.id === action.contentId
                      ? action.likes
                      : comment.likes,
                  replies: comment.replies.map(reply => ({
                    ...reply,
                    likes:
                      reply.id === action.contentId
                        ? action.likes
                        : reply.likes,
                    replies: reply.replies.map(reply => ({
                      ...reply,
                      likes:
                        reply.id === action.contentId
                          ? action.likes
                          : reply.likes
                    }))
                  }))
                }))
              : prevContentState.childComments,
          rootObj: prevContentState.rootObj
            ? {
                ...prevContentState.rootObj,
                likes:
                  prevContentState.rootId === action.contentId &&
                  prevContentState.rootType === action.contentType
                    ? action.likes
                    : prevContentState.rootObj.likes
              }
            : undefined,
          targetObj: prevContentState.targetObj
            ? {
                ...prevContentState.targetObj,
                [action.contentType]: prevContentState.targetObj[
                  action.contentType
                ]
                  ? {
                      ...prevContentState.targetObj[action.contentType],
                      likes:
                        prevContentState.targetObj[action.contentType].id ===
                        action.contentId
                          ? action.likes
                          : prevContentState.targetObj[action.contentType].likes
                    }
                  : undefined
              }
            : undefined
        };
      }
      return newState;
    }
    case 'LOAD_COMMENTS':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          childComments: action.comments,
          commentsLoadMoreButton: action.loadMoreButton
        }
      };
    case 'LOAD_MORE_COMMENTS': {
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          childComments:
            state.contentType === 'comment'
              ? (action.comments || []).concat(state.childComments)
              : (state.childComments || []).concat(action.comments),
          commentsLoadMoreButton: action.loadMoreButton
        }
      };
    }
    case 'LOAD_MORE_REPLIES':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          childComments: prevContentState.childComments.map(comment => ({
            ...comment,
            replies:
              comment.id === action.commentId
                ? (action.replies || []).concat(comment.replies)
                : comment.replies,
            loadMoreButton:
              comment.id === action.commentId
                ? action.loadMoreButton
                : comment.loadMoreButton
          }))
        }
      };
    case 'LOAD_MORE_SUBJECT_COMMENTS':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          subjects: prevContentState.subjects.map(subject => {
            if (subject.id === action.subjectId) {
              return {
                ...subject,
                comments: subject.comments.concat(action.comments),
                loadMoreCommentsButton: action.loadMoreButton
              };
            }
            return subject;
          })
        }
      };
    case 'LOAD_MORE_SUBJECT_REPLIES':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          subjects: prevContentState.subjects.map(subject => {
            return {
              ...subject,
              comments: subject.comments.map(comment => {
                return {
                  ...comment,
                  replies:
                    comment.id === action.commentId
                      ? action.replies.concat(comment.replies)
                      : comment.replies,
                  loadMoreButton:
                    comment.id === action.commentId
                      ? action.loadMoreButton
                      : comment.loadMoreButton
                };
              })
            };
          })
        }
      };
    case 'LOAD_MORE_SUBJECTS':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          subjects: (prevContentState.subjects || []).concat(action.results),
          subjectsLoadMoreButton: action.loadMoreButton
        }
      };
    case 'LOAD_REPLIES_OF_REPLY':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          childComments: prevContentState.childComments.map(comment => {
            if (comment.id === action.commentId) {
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
        }
      };
    case 'LOAD_SUBJECT_COMMENTS':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          subjects: prevContentState.subjects?.map(subject => {
            if (subject.id === action.subjectId) {
              return {
                ...subject,
                comments: action.comments,
                loadMoreCommentsButton: action.loadMoreButton
              };
            }
            return subject;
          })
        }
      };
    case 'SET_BY_USER_STATUS':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          byUser: action.byUser
        }
      };
    case 'SET_COMMENTS_SHOWN':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          commentsShown: true
        }
      };
    case 'SET_REWARD_LEVEL':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          rewardLevel: action.rewardLevel
        }
      };
    case 'SET_SUBJECT_REWARD_LEVEL':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          subjects: prevContentState.subjects?.map(subject => {
            return subject.id === action.contentId
              ? {
                  ...subject,
                  rewardLevel: action.rewardLevel
                }
              : subject;
          })
        }
      };
    case 'SET_VIDEO_QUESTIONS':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          questions: action.questions
        }
      };
    case 'SHOW_TC_REPLY_INPUT':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          targetObj: { ...prevContentState.targetObj, replyInputShown: true }
        }
      };
    case 'UPLOAD_COMMENT':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          childComments:
            prevContentState.contentType === 'comment'
              ? (prevContentState.childComments || []).concat([action.data])
              : [action.data].concat(prevContentState.childComments),
          subjects: prevContentState.subjects?.map(subject =>
            subject.id === action.data.subjectId
              ? {
                  ...subject,
                  comments: [action.data].concat(subject.comments)
                }
              : subject
          )
        }
      };
    case 'UPLOAD_REPLY':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          childComments: prevContentState.childComments.map(comment => {
            let match = false;
            let commentId = action.data.replyId || action.data.commentId;
            if (comment.id === commentId) {
              match = true;
            } else {
              for (let reply of comment.replies || []) {
                if (reply.id === commentId) {
                  match = true;
                  break;
                }
              }
            }
            return {
              ...comment,
              replies: match
                ? comment.replies.concat([action.data])
                : comment.replies
            };
          }),
          subjects: prevContentState.subjects.map(subject => {
            return {
              ...subject,
              comments: subject.comments.map(comment =>
                comment.id === action.data.commentId ||
                comment.id === action.data.replyId
                  ? {
                      ...comment,
                      replies: comment.replies.concat([action.data])
                    }
                  : comment
              )
            };
          })
        }
      };
    case 'UPLOAD_SUBJECT':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          subjects: [action.subject].concat(prevContentState.subjects)
        }
      };
    case 'UPLOAD_TARGET_COMMENT':
      return {
        ...state,
        [contentKey]: {
          ...prevContentState,
          targetObj: {
            ...prevContentState.targetObj,
            comment: {
              ...prevContentState.targetObj.comment,
              comments: [action.data].concat(
                prevContentState.targetObj?.comment?.comments || []
              )
            }
          }
        }
      };
    default:
      return state;
  }
}
