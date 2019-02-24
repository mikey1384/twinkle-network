import { useState } from 'react';

export default function useContentObj(props) {
  const [contentObj, setContentObj] = useState(props);
  function onAttachStar(data) {
    setContentObj({
      ...contentObj,
      stars:
        data.contentId === contentObj.contentId &&
        data.contentType === contentObj.type
          ? contentObj.stars?.concat(data)
          : contentObj.stars || [],
      childComments: contentObj.childComments?.map(comment => {
        return {
          ...comment,
          stars:
            comment.id === data.contentId && data.contentType === 'comment'
              ? comment.stars?.concat(data)
              : comment.stars || [],
          replies: comment.replies.map(reply => ({
            ...reply,
            stars:
              reply.id === data.contentId && data.contentType === 'comment'
                ? reply.stars?.concat(data)
                : reply.stars || []
          }))
        };
      }),
      targetObj: contentObj.targetObj
        ? {
            ...contentObj.targetObj,
            comment: contentObj.targetObj.comment
              ? {
                  ...contentObj.targetObj.comment,
                  stars:
                    contentObj.targetObj.comment.id === data.contentId &&
                    data.contentType === 'comment'
                      ? contentObj.targetObj.comment.stars?.concat(data)
                      : contentObj.targetObj.comment.stars
                }
              : undefined
          }
        : undefined
    });
  }

  function onCommentSubmit(data) {
    const { type } = contentObj;
    setContentObj({
      ...contentObj,
      childComments:
        type === 'comment'
          ? contentObj.childComments?.concat([data])
          : [data].concat(contentObj.childComments)
    });
  }

  function onReplySubmit(data) {
    setContentObj({
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
      })
    });
  }

  function onDeleteComment(commentId) {
    const comments = contentObj.childComments?.filter(
      comment => comment.id !== commentId
    );
    setContentObj({
      ...contentObj,
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
        : undefined,
      childComments: comments.map(comment => ({
        ...comment,
        replies: comment.replies?.filter(reply => reply.id !== commentId)
      }))
    });
  }

  function onEditComment({ editedComment, commentId }) {
    setContentObj({
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
        : undefined
    });
  }

  function onEditRewardComment({ id, text }) {
    setContentObj({
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
    });
  }

  function onEditContent({ data }) {
    setContentObj({
      ...contentObj,
      ...data
    });
  }

  function onLikeContent({ likes, type, contentId }) {
    setContentObj({
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
    });
  }

  function onLoadContent({ data }) {
    setContentObj({ ...contentObj, ...data });
  }

  function onLoadMoreComments({ data: { comments, loadMoreButton } }) {
    const { type } = contentObj;
    setContentObj({
      ...contentObj,
      childComments:
        type === 'comment'
          ? comments.concat(contentObj.childComments)
          : contentObj.childComments.concat(comments),
      commentsLoadMoreButton: loadMoreButton
    });
  }

  function onLoadMoreReplies({ commentId, replies, loadMoreButton }) {
    setContentObj({
      ...contentObj,
      childComments: contentObj.childComments.map(comment => ({
        ...comment,
        replies:
          comment.id === commentId
            ? replies.concat(comment.replies)
            : comment.replies,
        loadMoreButton:
          comment.id === commentId ? loadMoreButton : comment.loadMoreButton
      }))
    });
  }

  function onLoadRepliesOfReply({ replies, commentId, replyId }) {
    setContentObj({
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
    });
  }

  function onSetDifficulty({ difficulty }) {
    setContentObj({
      ...contentObj,
      difficulty
    });
  }

  function onShowComments({ comments, loadMoreButton }) {
    setContentObj({
      ...contentObj,
      childComments: comments,
      commentsLoadMoreButton: loadMoreButton
    });
    return Promise.resolve();
  }

  function onTargetCommentSubmit(data) {
    setContentObj({
      ...contentObj,
      targetObj: {
        ...contentObj.targetObj,
        comment: {
          ...contentObj.targetObj.comment,
          comments: [data].concat(contentObj.targetObj.comment.comments || [])
        }
      }
    });
  }
  return {
    contentObj,
    setContentObj,
    onAttachStar,
    onCommentSubmit,
    onReplySubmit,
    onDeleteComment,
    onEditComment,
    onEditRewardComment,
    onEditContent,
    onLikeContent,
    onLoadContent,
    onLoadMoreComments,
    onLoadMoreReplies,
    onLoadRepliesOfReply,
    onShowComments,
    onSetDifficulty,
    onTargetCommentSubmit
  };
}
