import { useState } from 'react';

export default function useContentObj(props) {
  const initialState = {
    stars: [],
    childComments: [],
    likes: [],
    subjects: [],
    commentsLoadMoreButton: false,
    subjectsLoadMoreButton: false
  };
  const [contentObj, setContentObj] = useState({
    ...initialState,
    ...props
  });

  function onInitContent({ content }) {
    setContentObj({ ...initialState, ...content });
  }

  function onAddTags({ tags }) {
    setContentObj(contentObj => ({
      ...contentObj,
      tags: contentObj.tags.concat(tags)
    }));
  }

  function onAttachStar(data) {
    setContentObj(contentObj => ({
      ...contentObj,
      stars:
        data.contentId === contentObj.contentId &&
        data.contentType === contentObj.type
          ? (contentObj.stars || []).concat(data)
          : contentObj.stars || [],
      childComments: contentObj.childComments?.map(comment => {
        return {
          ...comment,
          stars:
            comment.id === data.contentId && data.contentType === 'comment'
              ? (comment.stars || []).concat(data)
              : comment.stars || [],
          replies: comment.replies.map(reply => ({
            ...reply,
            stars:
              reply.id === data.contentId && data.contentType === 'comment'
                ? (reply.stars || []).concat(data)
                : reply.stars || []
          }))
        };
      }),
      subjects: contentObj.subjects?.map(subject => ({
        ...subject,
        comments: subject.comments.map(comment => ({
          ...comment,
          stars:
            comment.id === data.contentId
              ? comment.stars?.concat(data)
              : comment.stars || [],
          replies: comment.replies.map(reply => ({
            ...reply,
            stars:
              reply.id === data.contentId
                ? reply.stars?.concat(data)
                : reply.stars || []
          }))
        }))
      })),
      targetObj: contentObj.targetObj
        ? {
            ...contentObj.targetObj,
            comment: contentObj.targetObj.comment
              ? {
                  ...contentObj.targetObj.comment,
                  stars:
                    contentObj.targetObj.comment.id === data.contentId &&
                    data.contentType === 'comment'
                      ? (contentObj.targetObj.comment.stars || []).concat(data)
                      : contentObj.targetObj.comment.stars
                }
              : undefined
          }
        : undefined
    }));
  }

  function onChangeSpoilerStatus({ shown }) {
    setContentObj(contentObj => ({
      ...contentObj,
      secretShown: shown,
      targetObj: contentObj.targetObj
        ? {
            ...contentObj.targetObj,
            subject: contentObj.targetObj.subject
              ? {
                  ...contentObj.targetObj.subject,
                  secretShown: shown
                }
              : undefined
          }
        : undefined
    }));
  }

  function onDeleteComment(commentId) {
    setContentObj(contentObj => ({
      ...contentObj,
      childComments: contentObj.childComments
        ?.filter(comment => comment.id !== commentId)
        .map(comment => ({
          ...comment,
          replies: comment.replies?.filter(reply => reply.id !== commentId)
        })),
      subjects: contentObj.subjects?.map(subject => ({
        ...subject,
        comments: subject.comments
          ?.filter(comment => comment.id !== commentId)
          .map(comment => ({
            ...comment,
            replies: comment.replies?.filter(reply => reply.id !== commentId)
          }))
      })),
      targetObj: contentObj.targetObj
        ? {
            ...contentObj.targetObj,
            comment: contentObj.targetObj.comment
              ? {
                  ...contentObj.targetObj.comment,
                  comments: contentObj.targetObj.comment.comments?.filter(
                    comment => comment.id !== commentId
                  )
                }
              : undefined
          }
        : undefined
    }));
  }

  function onDeleteSubject(subjectId) {
    setContentObj(contentObj => ({
      ...contentObj,
      subjects: contentObj.subjects?.filter(subject => subject.id !== subjectId)
    }));
  }

  function onEditComment({ editedComment, commentId }) {
    setContentObj(contentObj => ({
      ...contentObj,
      childComments: contentObj.childComments.map(comment => ({
        ...comment,
        content: comment.id === commentId ? editedComment : comment.content,
        replies: comment.replies?.map(reply =>
          reply.id === commentId
            ? {
                ...reply,
                content: editedComment
              }
            : reply
        )
      })),
      targetObj: contentObj.targetObj
        ? {
            ...contentObj.targetObj,
            comment: contentObj.targetObj.comment
              ? {
                  ...contentObj.targetObj.comment,
                  comments: contentObj.targetObj.comment.comments?.map(
                    comment =>
                      comment.id === commentId
                        ? {
                            ...comment,
                            content: editedComment
                          }
                        : comment
                  )
                }
              : undefined
          }
        : undefined,
      subjects: contentObj.subjects?.map(subject => ({
        ...subject,
        comments: subject.comments?.map(comment => ({
          ...comment,
          content: comment.id === commentId ? editedComment : comment.content,
          replies: comment.replies?.map(reply =>
            reply.id === commentId
              ? {
                  ...reply,
                  content: editedComment
                }
              : reply
          )
        }))
      }))
    }));
  }

  function onEditRewardComment({ id, text }) {
    setContentObj(contentObj => ({
      ...contentObj,
      stars: contentObj.stars?.map(star => ({
        ...star,
        rewardComment: star.id === id ? text : star.rewardComment
      })),
      childComments: contentObj.childComments?.map(comment => ({
        ...comment,
        stars: comment.stars?.map(star => ({
          ...star,
          rewardComment: star.id === id ? text : star.rewardComment
        })),
        replies: comment.replies.map(reply => ({
          ...reply,
          stars: reply.stars?.map(star => ({
            ...star,
            rewardComment: star.id === id ? text : star.rewardComment
          }))
        }))
      })),
      subjects: contentObj.subjects?.map(subject => ({
        ...subject,
        comments: subject.comments.map(comment => ({
          ...comment,
          stars: comment.stars
            ? comment.stars.map(star => ({
                ...star,
                rewardComment: star.id === id ? text : star.rewardComment
              }))
            : [],
          replies: comment.replies.map(reply => ({
            ...reply,
            stars: reply.stars
              ? reply.stars.map(star => ({
                  ...star,
                  rewardComment: star.id === id ? text : star.rewardComment
                }))
              : []
          }))
        }))
      })),
      targetObj: contentObj.targetObj
        ? {
            ...contentObj.targetObj,
            comment: contentObj.targetObj.comment
              ? {
                  ...contentObj.targetObj.comment,
                  stars: contentObj.targetObj.comment.stars?.map(star => ({
                    ...star,
                    rewardComment: star.id === id ? text : star.rewardComment
                  }))
                }
              : undefined
          }
        : undefined
    }));
  }

  function onEditContent({ data }) {
    setContentObj(contentObj => ({
      ...contentObj,
      ...data
    }));
  }

  function onEditSubject({ editedSubject, subjectId }) {
    setContentObj(contentObj => ({
      ...contentObj,
      subjects: contentObj.subjects?.map(subject =>
        subject.id === subjectId
          ? {
              ...subject,
              ...editedSubject
            }
          : subject
      )
    }));
  }

  function onLikeComment({ commentId, likes }) {
    setContentObj(contentObj => ({
      ...contentObj,
      childComments: contentObj.childComments.map(comment => {
        return {
          ...comment,
          likes: comment.id === commentId ? likes : comment.likes,
          replies: comment.replies.map(reply => {
            return {
              ...reply,
              likes: reply.id === commentId ? likes : reply.likes
            };
          })
        };
      }),
      subjects: contentObj.subjects.map(subject => {
        return {
          ...subject,
          comments: subject.comments.map(comment => {
            return {
              ...comment,
              likes: comment.id === commentId ? likes : comment.likes,
              replies: comment.replies.map(reply => {
                return {
                  ...reply,
                  likes: reply.id === commentId ? likes : reply.likes
                };
              })
            };
          })
        };
      })
    }));
  }

  function onLikeContent({ likes, type, contentId }) {
    setContentObj(contentObj => ({
      ...contentObj,
      likes:
        contentObj.id === contentId && contentObj.type === type
          ? likes
          : contentObj.likes,
      childComments:
        type === 'comment'
          ? contentObj.childComments.map(comment => ({
              ...comment,
              likes: comment.id === contentId ? likes : comment.likes,
              replies: comment.replies.map(reply => ({
                ...reply,
                likes: reply.id === contentId ? likes : reply.likes,
                replies: reply.replies.map(reply => ({
                  ...reply,
                  likes: reply.id === contentId ? likes : reply.likes
                }))
              }))
            }))
          : contentObj.childComments,
      rootObj: contentObj.rootObj
        ? {
            ...contentObj.rootObj,
            likes:
              contentObj.rootId === contentId && contentObj.rootType === type
                ? likes
                : contentObj.rootObj.likes
          }
        : undefined,
      targetObj: contentObj.targetObj
        ? {
            ...contentObj.targetObj,
            [type]: contentObj.targetObj[type]
              ? {
                  ...contentObj.targetObj[type],
                  likes:
                    contentObj.targetObj[type].id === contentId
                      ? likes
                      : contentObj.targetObj[type].likes
                }
              : undefined
          }
        : undefined
    }));
  }

  function onLoadComments({ comments, loadMoreButton }) {
    setContentObj(contentObj => ({
      ...contentObj,
      childComments: comments,
      commentsLoadMoreButton: loadMoreButton
    }));
  }

  function onLoadSubjects({ results, loadMoreButton }) {
    setContentObj(contentObj => ({
      ...contentObj,
      subjects: results,
      subjectsLoadMoreButton: loadMoreButton
    }));
  }

  function onLoadTags({ tags }) {
    setContentObj(contentObj => ({
      ...contentObj,
      tags
    }));
  }

  function onLoadMoreComments(data) {
    const { comments, loadMoreButton } = data.data ? data.data : data;
    const { type } = contentObj;
    setContentObj(contentObj => ({
      ...contentObj,
      childComments:
        type === 'comment'
          ? (comments || []).concat(contentObj.childComments)
          : (contentObj.childComments || []).concat(comments),
      commentsLoadMoreButton: loadMoreButton
    }));
  }

  function onLoadMoreReplies({ commentId, replies, loadMoreButton }) {
    setContentObj(contentObj => ({
      ...contentObj,
      childComments: contentObj.childComments.map(comment => ({
        ...comment,
        replies:
          comment.id === commentId
            ? (replies || []).concat(comment.replies)
            : comment.replies,
        loadMoreButton:
          comment.id === commentId ? loadMoreButton : comment.loadMoreButton
      }))
    }));
  }

  function onLoadMoreSubjects({ results, loadMoreButton }) {
    setContentObj(contentObj => ({
      ...contentObj,
      subjects: (contentObj.subjects || []).concat(results),
      subjectsLoadMoreButton: loadMoreButton
    }));
  }

  function onLoadMoreSubjectComments({
    data: { comments, loadMoreButton },
    subjectId
  }) {
    setContentObj(contentObj => ({
      ...contentObj,
      subjects: contentObj.subjects.map(subject => {
        if (subject.id === subjectId) {
          return {
            ...subject,
            comments: subject.comments.concat(comments),
            loadMoreCommentsButton: loadMoreButton
          };
        }
        return subject;
      })
    }));
  }

  function onLoadMoreSubjectReplies({ commentId, loadMoreButton, replies }) {
    setContentObj(contentObj => ({
      ...contentObj,
      subjects: contentObj.subjects.map(subject => {
        return {
          ...subject,
          comments: subject.comments.map(comment => {
            return {
              ...comment,
              replies:
                comment.id === commentId
                  ? replies.concat(comment.replies)
                  : comment.replies,
              loadMoreButton:
                comment.id === commentId
                  ? loadMoreButton
                  : comment.loadMoreButton
            };
          })
        };
      })
    }));
  }

  function onLoadRepliesOfReply({ replies, commentId, replyId }) {
    setContentObj(contentObj => ({
      ...contentObj,
      childComments: contentObj.childComments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [
              ...comment.replies.filter(reply => reply.id <= replyId),
              ...replies,
              ...comment.replies.filter(reply => reply.id > replyId)
            ]
          };
        }
        let containsRootReply = false;
        for (let reply of comment.replies) {
          if (reply.id === replyId) {
            containsRootReply = true;
            break;
          }
        }
        if (containsRootReply) {
          return {
            ...comment,
            replies: [
              ...comment.replies.filter(reply => reply.id <= replyId),
              ...replies,
              ...comment.replies.filter(reply => reply.id > replyId)
            ]
          };
        }
        return comment;
      })
    }));
  }

  function onSetDifficulty({ difficulty }) {
    setContentObj(contentObj => ({
      ...contentObj,
      difficulty
    }));
  }

  function onSetSubjectDifficulty({ contentId, difficulty }) {
    setContentObj(contentObj => ({
      ...contentObj,
      subjects: contentObj.subjects?.map(subject => {
        return subject.id === contentId
          ? {
              ...subject,
              difficulty
            }
          : subject;
      })
    }));
  }

  function onLoadSubjectComments({
    data: { comments, loadMoreButton },
    subjectId
  }) {
    setContentObj(contentObj => ({
      ...contentObj,
      subjects: contentObj.subjects?.map(subject => {
        if (subject.id === subjectId) {
          return {
            ...subject,
            comments: comments,
            loadMoreCommentsButton: loadMoreButton
          };
        }
        return subject;
      })
    }));
  }

  function onTargetCommentSubmit(data) {
    setContentObj(contentObj => ({
      ...contentObj,
      targetObj: {
        ...contentObj.targetObj,
        comment: {
          ...contentObj.targetObj.comment,
          comments: [data].concat(contentObj.targetObj.comment.comments || [])
        }
      }
    }));
  }

  function onUploadSubject(subject) {
    setContentObj(contentObj => ({
      ...contentObj,
      subjects: [subject].concat(contentObj.subjects)
    }));
  }

  function onUploadComment(data) {
    const { type } = contentObj;
    setContentObj(contentObj => ({
      ...contentObj,
      childComments:
        type === 'comment'
          ? (contentObj.childComments || []).concat([data])
          : [data].concat(contentObj.childComments),
      subjects: contentObj.subjects?.map(subject =>
        subject.id === data.subjectId
          ? {
              ...subject,
              comments: [data].concat(subject.comments)
            }
          : subject
      )
    }));
  }

  function onUploadReply(data) {
    setContentObj(contentObj => ({
      ...contentObj,
      childComments: contentObj.childComments.map(comment => {
        let match = false;
        let commentId = data.replyId || data.commentId;
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
          replies: match ? comment.replies.concat([data]) : comment.replies
        };
      }),
      subjects: contentObj.subjects.map(subject => {
        return {
          ...subject,
          comments: subject.comments.map(comment =>
            comment.id === data.commentId || comment.id === data.replyId
              ? {
                  ...comment,
                  replies: comment.replies.concat([data])
                }
              : comment
          )
        };
      })
    }));
  }

  return {
    contentObj,
    setContentObj,
    onAddTags,
    onAttachStar,
    onChangeSpoilerStatus,
    onDeleteComment,
    onDeleteSubject,
    onEditComment,
    onEditContent,
    onEditRewardComment,
    onEditSubject,
    onInitContent,
    onLikeComment,
    onLikeContent,
    onLoadComments,
    onLoadSubjects,
    onLoadMoreComments,
    onLoadMoreReplies,
    onLoadMoreSubjects,
    onLoadMoreSubjectComments,
    onLoadMoreSubjectReplies,
    onLoadRepliesOfReply,
    onLoadSubjectComments,
    onLoadTags,
    onSetDifficulty,
    onSetSubjectDifficulty,
    onTargetCommentSubmit,
    onUploadComment,
    onUploadReply,
    onUploadSubject
  };
}
