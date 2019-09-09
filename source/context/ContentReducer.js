export default function ContentPageReducer(state, action) {
  switch (action.type) {
    case 'INIT_CONTENT':
      return {
        ...state,
        ...action.content
      };
    case 'ADD_TAGS':
      return {
        ...state,
        tags: state.tags.concat(action.tags)
      };
    case 'ATTACH_STAR':
      return {
        ...state,
        stars:
          action.data.contentId === state.contentId &&
          action.data.contentType === state.type
            ? (state.stars || []).concat(action.data)
            : state.stars || [],
        childComments: state.childComments?.map(comment => {
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
        subjects: state.subjects?.map(subject => ({
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
        targetObj: state.targetObj
          ? {
              ...state.targetObj,
              comment: state.targetObj.comment
                ? {
                    ...state.targetObj.comment,
                    stars:
                      state.targetObj.comment.id === action.data.contentId &&
                      action.data.contentType === 'comment'
                        ? (state.targetObj.comment.stars || []).concat(
                            action.data
                          )
                        : state.targetObj.comment.stars
                  }
                : undefined
            }
          : undefined
      };
    case 'CHANGE_SPOILER_STATUS':
      return {
        ...state,
        secretShown: action.shown,
        targetObj: state.targetObj
          ? {
              ...state.targetObj,
              subject: state.targetObj.subject
                ? {
                    ...state.targetObj.subject,
                    secretShown: action.shown
                  }
                : undefined
            }
          : undefined
      };
    case 'DELETE_COMMENT':
      return {
        ...state,
        childComments: state.childComments
          ?.filter(comment => comment.id !== action.commentId)
          .map(comment => ({
            ...comment,
            replies: comment.replies?.filter(
              reply => reply.id !== action.commentId
            )
          })),
        subjects: state.subjects?.map(subject => ({
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
        targetObj: state.targetObj
          ? {
              ...state.targetObj,
              comment: state.targetObj.comment
                ? {
                    ...state.targetObj.comment,
                    comments: state.targetObj.comment.comments?.filter(
                      comment => comment.id !== action.commentId
                    )
                  }
                : undefined
            }
          : undefined
      };
    case 'DELETE_SUBJECT':
      return {
        ...state,
        subjects: state.subjects?.filter(
          subject => subject.id !== action.subjectId
        )
      };
    case 'EDIT_COMMENT':
      return {
        ...state,
        childComments: state.childComments.map(comment => ({
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
        targetObj: state.targetObj
          ? {
              ...state.targetObj,
              comment: state.targetObj.comment
                ? {
                    ...state.targetObj.comment,
                    comments: state.targetObj.comment.comments?.map(comment =>
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
        subjects: state.subjects?.map(subject => ({
          ...subject,
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
    case 'EDIT_CONTENT':
      return {
        ...state,
        ...action.data
      };
    case 'EDIT_REWARD_COMMENT':
      return {
        ...state,
        stars: state.stars?.map(star => ({
          ...star,
          rewardComment:
            star.id === action.id ? action.text : star.rewardComment
        })),
        childComments: state.childComments?.map(comment => ({
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
        subjects: state.subjects?.map(subject => ({
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
        targetObj: state.targetObj
          ? {
              ...state.targetObj,
              comment: state.targetObj.comment
                ? {
                    ...state.targetObj.comment,
                    stars: state.targetObj.comment.stars?.map(star => ({
                      ...star,
                      rewardComment:
                        star.id === action.id ? action.text : star.rewardComment
                    }))
                  }
                : undefined
            }
          : undefined
      };
    case 'EDIT_SUBJECT':
      return {
        ...state,
        subjects: state.subjects?.map(subject =>
          subject.id === action.subjectId
            ? {
                ...subject,
                ...action.editedSubject
              }
            : subject
        )
      };
    case 'LIKE_COMMENT':
      return {
        ...state,
        childComments: state.childComments.map(comment => {
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
        subjects: state.subjects.map(subject => {
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
                      reply.id === action.commentId ? action.likes : reply.likes
                  };
                })
              };
            })
          };
        })
      };
    case 'LIKE_CONTENT':
      return {
        ...state,
        likes:
          state.id === action.contentId && state.type === action.contentType
            ? action.likes
            : state.likes,
        childComments:
          action.contentType === 'comment'
            ? state.childComments.map(comment => ({
                ...comment,
                likes:
                  comment.id === action.contentId
                    ? action.likes
                    : comment.likes,
                replies: comment.replies.map(reply => ({
                  ...reply,
                  likes:
                    reply.id === action.contentId ? action.likes : reply.likes,
                  replies: reply.replies.map(reply => ({
                    ...reply,
                    likes:
                      reply.id === action.contentId ? action.likes : reply.likes
                  }))
                }))
              }))
            : state.childComments,
        rootObj: state.rootObj
          ? {
              ...state.rootObj,
              likes:
                state.rootId === action.contentId &&
                state.rootType === action.contentType
                  ? action.likes
                  : state.rootObj.likes
            }
          : undefined,
        targetObj: state.targetObj
          ? {
              ...state.targetObj,
              [action.contentType]: state.targetObj[action.contentType]
                ? {
                    ...state.targetObj[action.contentType],
                    likes:
                      state.targetObj[action.contentType].id ===
                      action.contentId
                        ? action.likes
                        : state.targetObj[action.contentType].likes
                  }
                : undefined
            }
          : undefined
      };
    case 'LOAD_COMMENTS':
      return {
        ...state,
        childComments: action.comments,
        commentsLoadMoreButton: action.loadMoreButton
      };
    case 'LOAD_MORE_COMMENTS': {
      const { comments, loadMoreButton } = action.data.data
        ? action.data.data
        : action.data;
      return {
        ...state,
        childComments:
          state.type === 'comment'
            ? (comments || []).concat(state.childComments)
            : (state.childComments || []).concat(comments),
        commentsLoadMoreButton: loadMoreButton
      };
    }
    case 'LOAD_MORE_REPLIES':
      return {
        ...state,
        childComments: state.childComments.map(comment => ({
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
      };
    case 'LOAD_MORE_SUBJECT_COMMENTS':
      return {
        ...state,
        subjects: state.subjects.map(subject => {
          if (subject.id === action.subjectId) {
            return {
              ...subject,
              comments: subject.comments.concat(action.comments),
              loadMoreCommentsButton: action.loadMoreButton
            };
          }
          return subject;
        })
      };
    case 'LOAD_MORE_SUBJECT_REPLIES':
      return {
        ...state,
        subjects: state.subjects.map(subject => {
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
      };
    case 'LOAD_MORE_SUBJECTS':
      return {
        ...state,
        subjects: (state.subjects || []).concat(action.results),
        subjectsLoadMoreButton: action.loadMoreButton
      };
    case 'LOAD_REPLIES_OF_REPLY':
      return {
        ...state,
        childComments: state.childComments.map(comment => {
          if (comment.id === action.commentId) {
            return {
              ...comment,
              replies: [
                ...comment.replies.filter(reply => reply.id <= action.replyId),
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
                ...comment.replies.filter(reply => reply.id <= action.replyId),
                ...action.replies,
                ...comment.replies.filter(reply => reply.id > action.replyId)
              ]
            };
          }
          return comment;
        })
      };
    case 'LOAD_SUBJECT_COMMENTS':
      return {
        ...state,
        subjects: state.subjects?.map(subject => {
          if (subject.id === action.subjectId) {
            return {
              ...subject,
              comments: action.comments,
              loadMoreCommentsButton: action.loadMoreButton
            };
          }
          return subject;
        })
      };
    case 'SET_BY_USER_STATUS':
      return {
        ...state,
        byUser: action.byUser
      };
    case 'SET_COMMENTS_SHOWN':
      return {
        ...state,
        commentsShown: true
      };
    case 'SET_REWARD_LEVEL':
      return {
        ...state,
        rewardLevel: action.rewardLevel
      };
    case 'SET_SUBJECT_REWARD_LEVEL':
      return {
        ...state,
        subjects: state.subjects?.map(subject => {
          return subject.id === action.contentId
            ? {
                ...subject,
                rewardLevel: action.rewardLevel
              }
            : subject;
        })
      };
    case 'SET_VIDEO_QUESTIONS':
      return {
        ...state,
        questions: action.questions
      };
    case 'SHOW_TC_REPLY_INPUT':
      return {
        ...state,
        targetObj: state.targetObj
          ? { ...state.targetObj, replyInputShown: true }
          : { replyInputShown: true }
      };
    case 'UPLOAD_COMMENT':
      return {
        ...state,
        childComments:
          state.type === 'comment'
            ? (state.childComments || []).concat([action.data])
            : [action.data].concat(state.childComments),
        subjects: state.subjects?.map(subject =>
          subject.id === action.data.subjectId
            ? {
                ...subject,
                comments: [action.data].concat(subject.comments)
              }
            : subject
        )
      };
    case 'UPLOAD_REPLY':
      return {
        ...state,
        childComments: state.childComments.map(comment => {
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
        subjects: state.subjects.map(subject => {
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
      };
    case 'UPLOAD_SUBJECT':
      return {
        ...state,
        subjects: [action.subject].concat(state.subjects)
      };
    case 'UPLOAD_TARGET_COMMENT':
      return {
        ...state,
        targetObj: {
          ...state.targetObj,
          comment: {
            ...state.targetObj.comment,
            comments: [action.data].concat(
              state.targetObj?.comment?.comments || []
            )
          }
        }
      };
    default:
      return state;
  }
}
