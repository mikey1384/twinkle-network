import React, { useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import SectionPanel from 'components/SectionPanel';
import ContentPanel from 'components/ContentPanel';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import MonthlyXp from './MonthlyXp';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import {
  loadNotableContent,
  loadMoreNotableContents
} from 'helpers/requestHelpers';

Achievements.propTypes = {
  profile: PropTypes.object.isRequired,
  selectedTheme: PropTypes.string,
  myId: PropTypes.number
};

export default function Achievements({
  profile,
  profile: { id, username },
  myId,
  selectedTheme
}) {
  const [loading, setLoading] = useState(true);
  const [loadMoreButton, setLoadMoreButton] = useState(false);
  const [state, dispatch] = useReducer(reducer, { notables: [] });
  const { notables } = state;
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    initNotables();
    async function initNotables() {
      const { results, loadMoreButton } = await loadNotableContent({
        userId: id
      });
      if (mounted.current) {
        dispatch({ type: 'LOAD', notables: results });
        setLoadMoreButton(loadMoreButton);
        setLoading(false);
      }
    }
    return function cleanUp() {
      mounted.current = false;
    };
  }, [profile.id]);

  return (
    <ErrorBoundary>
      <SectionPanel
        customColorTheme={selectedTheme}
        title="Notable Activities"
        loaded={!loading}
      >
        {notables.length === 0 && (
          <div
            style={{ fontSize: '2rem', textAlign: 'center' }}
          >{`${username} hasn't engaged in an activity worth showing here, yet`}</div>
        )}
        {notables.map((contentObj, index) => (
          <ContentPanel
            key={contentObj.feedId}
            style={{ marginBottom: '1rem', zIndex: notables.length - index }}
            inputAtBottom={contentObj.contentType === 'comment'}
            commentsLoadLimit={5}
            contentObj={contentObj}
            userId={myId}
            onAddTags={onAddTags}
            onAddTagToContents={onAddTagToContents}
            onAttachStar={onAttachStar}
            onChangeSpoilerStatus={onChangeSpoilerStatus}
            onCommentSubmit={data =>
              onCommentSubmit({
                contentId: contentObj.contentId,
                contentType: contentObj.contentType,
                comment: data
              })
            }
            onDeleteComment={onDeleteComment}
            onDeleteContent={onDeleteContent}
            onEditComment={onEditComment}
            onEditContent={onEditContent}
            onEditRewardComment={onEditRewardComment}
            onLikeContent={onLikeContent}
            onInitContent={onInitContent}
            onLoadMoreComments={onLoadMoreComments}
            onLoadMoreReplies={data =>
              onLoadMoreReplies({ ...data, feedId: contentObj.feedId })
            }
            onLoadRepliesOfReply={onLoadRepliesOfReply}
            onLoadTags={onLoadTags}
            onReplySubmit={data =>
              onReplySubmit({ ...data, feedId: contentObj.feedId })
            }
            onSetCommentsShown={shown =>
              onSetCommentsShown({ feedId: contentObj.feedId, shown })
            }
            onShowTCReplyInput={onShowTCReplyInput}
            onSetRewardLevel={onSetRewardLevel}
            onShow
            onLoadComments={onLoadComments}
            onTargetCommentSubmit={onTargetCommentSubmit}
          />
        ))}
        {loadMoreButton && (
          <LoadMoreButton
            style={{ fontSize: '1.7rem' }}
            label="Show More"
            transparent
            onClick={onShowMoreNotables}
          />
        )}
      </SectionPanel>
      <MonthlyXp selectedTheme={selectedTheme} userId={id} />
    </ErrorBoundary>
  );

  function onAddTags({ contentType, contentId, tags }) {
    dispatch({ type: 'ADD_TAGS', contentId, tags, contentType });
  }

  function onAddTagToContents({ contentIds, contentType, tagId, tagTitle }) {
    dispatch({
      type: 'ADD_TAG_TO_CONTENTS',
      contentIds,
      contentType,
      tagId,
      tagTitle
    });
  }

  function onLoadTags({ contentType, contentId, tags }) {
    dispatch({
      type: 'LOAD_TAGS',
      contentType,
      contentId,
      tags
    });
  }

  async function onShowMoreNotables() {
    const { results, loadMoreButton } = await loadMoreNotableContents({
      userId: profile.id,
      notables
    });
    dispatch({
      type: 'LOAD_MORE',
      notables: results
    });
    setLoadMoreButton(loadMoreButton);
  }

  async function onAttachStar(data) {
    dispatch({
      type: 'ATTACH_STAR',
      data
    });
  }

  function onChangeSpoilerStatus({ shown, subjectId }) {
    dispatch({
      type: 'CHANGE_SPOILER_STATUS',
      shown,
      subjectId
    });
  }

  function onCommentSubmit({ contentType, contentId, comment }) {
    const commentId = comment.replyId || comment.commentId;
    dispatch({
      type: 'UPLOAD_COMMENT',
      contentType,
      contentId,
      comment,
      commentId
    });
  }

  function onDeleteComment(commentId) {
    dispatch({
      type: 'DELETE_COMMENT',
      commentId
    });
  }

  function onDeleteContent({ contentId, contentType }) {
    dispatch({
      type: 'DELETE_CONTENT',
      contentId,
      contentType
    });
  }

  function onEditComment({ editedComment, commentId }) {
    dispatch({
      type: 'EDIT_COMMENT',
      commentId,
      editedComment
    });
  }

  function onEditContent({ contentId, contentType, data }) {
    dispatch({
      type: 'EDIT_CONTENT',
      contentId,
      contentType,
      data
    });
  }

  function onEditRewardComment({ id, text }) {
    dispatch({
      type: 'EDIT_REWARD_COMMENT',
      id,
      text
    });
  }

  function onLikeContent({ likes, contentType, contentId }) {
    dispatch({
      type: 'LIKE_CONTENT',
      likes,
      contentType,
      contentId
    });
  }

  async function onInitContent({ content, feedId }) {
    dispatch({
      type: 'INIT_CONTENT',
      content,
      feedId
    });
  }

  function onLoadMoreComments({
    data: { comments, loadMoreButton },
    contentType,
    feedId
  }) {
    dispatch({
      type: 'LOAD_MORE_COMMENTS',
      comments,
      contentType,
      feedId,
      loadMoreButton
    });
  }

  function onLoadMoreReplies(data) {
    dispatch({
      type: 'LOAD_MORE_REPLIES',
      data
    });
  }

  function onLoadRepliesOfReply({ replies, commentId, replyId }) {
    dispatch({
      type: 'LOAD_REPLIES_OF_REPLY',
      replies,
      commentId,
      replyId
    });
  }

  function onReplySubmit(data) {
    const commentId = data.replyId || data.commentId;
    dispatch({
      type: 'UPLOAD_REPLY',
      commentId,
      data
    });
  }

  function onSetCommentsShown({ feedId, shown }) {
    dispatch({
      type: 'SHOW_COMMENTS',
      feedId,
      shown
    });
  }

  function onShowTCReplyInput(feedId) {
    dispatch({
      type: 'SHOW_TC_REPLY_INPUT',
      feedId
    });
  }

  function onSetRewardLevel({ contentType, contentId, rewardLevel }) {
    dispatch({
      type: 'SET_REWARD_LEVEL',
      contentType,
      contentId,
      rewardLevel
    });
  }

  function onLoadComments(data, feedId) {
    dispatch({
      type: 'LOAD_COMMENTS',
      data,
      feedId
    });
  }

  function onTargetCommentSubmit(data, feedId) {
    dispatch({
      type: 'UPLOAD_TARGET_COMMENT',
      data,
      feedId
    });
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TAGS':
      return {
        notables: state.notables.map(notable =>
          notable.contentType === action.contentType &&
          notable.contentId === action.contentId
            ? {
                ...notable,
                tags: (notable.tags || []).concat(action.tags)
              }
            : notable
        )
      };
    case 'ADD_TAG_TO_CONTENTS':
      return {
        notables: state.notables.map(notable => ({
          ...notable,
          tags:
            notable.contentType === action.contentType &&
            action.contentIds.includes(notable.contentId)
              ? (notable.tags || []).concat({
                  id: action.tagId,
                  title: action.tagTitle
                })
              : notable.tags
        }))
      };
    case 'ATTACH_STAR':
      return {
        notables: state.notables.map(contentObj => {
          return contentObj.contentId === action.data.contentId
            ? {
                ...contentObj,
                stars:
                  action.data.contentType === contentObj.contentType
                    ? contentObj.stars
                      ? contentObj.stars.concat(action.data)
                      : [action.data]
                    : contentObj.stars || [],
                childComments: contentObj.childComments?.map(comment => {
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
                targetObj: contentObj.targetObj
                  ? {
                      ...contentObj.targetObj,
                      comment: contentObj.targetObj.comment
                        ? {
                            ...contentObj.targetObj.comment,
                            stars:
                              contentObj.targetObj.comment.id ===
                                action.data.contentId &&
                              action.data.contentType === 'comment'
                                ? (
                                    contentObj.targetObj.comment.stars || []
                                  ).concat(action.data)
                                : contentObj.targetObj.comment.stars
                          }
                        : undefined
                    }
                  : undefined
              }
            : contentObj;
        })
      };
    case 'CHANGE_SPOILER_STATUS':
      return {
        notables: state.notables.map(contentObj => {
          const contentMatches =
            contentObj.contentType === 'subject' &&
            contentObj.contentId === action.subjectId;
          const targetContentMatches =
            contentObj.targetObj?.subject?.id === action.subjectId;
          return contentMatches
            ? {
                ...contentObj,
                secretShown: action.shown
              }
            : {
                ...contentObj,
                secretShown: targetContentMatches
                  ? action.shown
                  : contentObj.secretShown,
                targetObj: contentObj.targetObj
                  ? {
                      ...contentObj.targetObj,
                      subject: contentObj.targetObj.subject
                        ? targetContentMatches
                          ? {
                              ...contentObj.targetObj.subject,
                              secretShown: action.shown
                            }
                          : contentObj.targetObj.subject
                        : undefined
                    }
                  : undefined
              };
        })
      };
    case 'DELETE_COMMENT':
      return {
        notables: state.notables.reduce((prev, contentObj) => {
          if (
            contentObj.contentType === 'comment' &&
            (contentObj.contentId === action.commentId ||
              contentObj.commentId === action.commentId ||
              contentObj.replyId === action.commentId)
          ) {
            return prev;
          }
          return prev.concat([
            {
              ...contentObj,
              targetObj: contentObj.targetObj
                ? {
                    ...contentObj.targetObj,
                    comment: contentObj.targetObj.comment
                      ? {
                          ...contentObj.targetObj.comment,
                          comments: contentObj.targetObj.comment.comments?.filter(
                            comment => comment.id !== action.commentId
                          )
                        }
                      : undefined
                  }
                : undefined,
              childComments: contentObj.childComments?.reduce(
                (prev, comment) => {
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
                },
                []
              )
            }
          ]);
        }, [])
      };
    case 'DELETE_CONTENT':
      return {
        notables: state.notables
          .filter(
            contentObj =>
              contentObj.contentType !== action.contentType ||
              contentObj.contentId !== action.contentId
          )
          .map(contentObj =>
            action.contentType === 'comment'
              ? {
                  ...contentObj,
                  targetObj: contentObj.targetObj
                    ? {
                        ...contentObj.targetObj,
                        comment: contentObj.targetObj.comment
                          ? {
                              ...contentObj.targetObj.comment,
                              comments: contentObj.targetObj.comment.comments?.filter(
                                comment => comment.id !== action.contentId
                              )
                            }
                          : undefined
                      }
                    : undefined,
                  childComments: contentObj.childComments?.reduce(
                    (prev, comment) => {
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
                    },
                    []
                  )
                }
              : contentObj
          )
      };
    case 'EDIT_COMMENT':
      return {
        notables: state.notables.map(contentObj => {
          return contentObj.id === action.commentId &&
            contentObj.contentType === 'comment'
            ? {
                ...contentObj,
                content: action.editedComment
              }
            : {
                ...contentObj,
                targetObj: contentObj.targetObj
                  ? {
                      ...contentObj.targetObj,
                      comment: contentObj.targetObj.comment
                        ? contentObj.targetObj.comment.id === action.commentId
                          ? {
                              ...contentObj.targetObj.comment,
                              content: action.editedComment
                            }
                          : {
                              ...contentObj.targetObj.comment,
                              comments: (
                                contentObj.targetObj.comment.comments || []
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
                childComments: contentObj.childComments?.map(comment => {
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
    case 'EDIT_CONTENT':
      return {
        notables: state.notables.map(contentObj => {
          const contentMatches =
            contentObj.contentType === action.contentType &&
            contentObj.contentId === action.contentId;
          const rootContentMatches =
            contentObj.rootType === action.contentType &&
            contentObj.rootId === action.contentId;
          return contentMatches
            ? {
                ...contentObj,
                ...action.data
              }
            : rootContentMatches
            ? {
                ...contentObj,
                rootObj: {
                  ...contentObj.rootObj,
                  ...action.data
                }
              }
            : {
                ...contentObj,
                targetObj: contentObj.targetObj
                  ? {
                      ...contentObj.targetObj,
                      [action.contentType]: contentObj.targetObj[
                        action.contentType
                      ]
                        ? contentObj.targetObj[action.contentType].id ===
                          action.contentId
                          ? {
                              ...contentObj.targetObj[action.data.contentType],
                              ...action.data
                            }
                          : contentObj.targetObj[action.contentType]
                        : undefined
                    }
                  : undefined,
                childComments:
                  action.contentType === 'comment'
                    ? contentObj.childComments?.map(comment => {
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
                    : contentObj.childComments
              };
        })
      };
    case 'EDIT_REWARD_COMMENT':
      return {
        notables: state.notables.map(contentObj => {
          return {
            ...contentObj,
            stars: contentObj.stars
              ? contentObj.stars.map(star => ({
                  ...star,
                  rewardComment:
                    star.id === action.id ? action.text : star.rewardComment
                }))
              : [],
            childComments: (contentObj.childComments || []).map(comment => ({
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
            targetObj: contentObj.targetObj
              ? {
                  ...contentObj.targetObj,
                  comment: contentObj.targetObj.comment
                    ? {
                        ...contentObj.targetObj.comment,
                        stars: contentObj.targetObj.comment.stars
                          ? contentObj.targetObj.comment.stars.map(star => ({
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
    case 'INIT_CONTENT':
      return {
        notables: state.notables.map(contentObj => {
          return contentObj.feedId === action.feedId
            ? { ...contentObj, ...action.content }
            : contentObj;
        })
      };
    case 'LIKE_CONTENT':
      return {
        notables: state.notables.map(contentObj => ({
          ...contentObj,
          likes:
            contentObj.contentType === action.contentType &&
            contentObj.id === action.contentId
              ? action.likes
              : contentObj.likes,
          rootObj: contentObj.rootObj
            ? {
                ...contentObj.rootObj,
                likes:
                  contentObj.rootType === action.contentType &&
                  contentObj.rootId === action.contentId
                    ? action.likes
                    : contentObj.rootObj.likes
              }
            : undefined,
          targetObj: contentObj.targetObj
            ? {
                ...contentObj.targetObj,
                comment:
                  contentObj.targetObj.comment &&
                  contentObj.targetObj.comment.id === action.contentId &&
                  action.contentType === 'comment'
                    ? {
                        ...contentObj.targetObj.comment,
                        likes: action.likes
                      }
                    : contentObj.targetObj.comment
              }
            : undefined,
          childComments:
            action.contentType === 'comment'
              ? (contentObj.childComments || []).map(comment =>
                  comment.id === action.contentId
                    ? { ...comment, likes: action.likes }
                    : {
                        ...comment,
                        replies: (comment.replies || []).map(reply =>
                          reply.id === action.contentId
                            ? { ...reply, likes: action.likes }
                            : reply
                        )
                      }
                )
              : contentObj.childComments
        }))
      };
    case 'LOAD':
      return { notables: action.notables };
    case 'LOAD_COMMENTS':
      return {
        notables:
          action.data.comments.length === 0
            ? state.notables
            : state.notables.map(contentObj => {
                return contentObj.feedId === action.feedId
                  ? {
                      ...contentObj,
                      commentsLoadMoreButton: action.data.loadMoreButton,
                      childComments: action.data.comments
                    }
                  : contentObj;
              })
      };
    case 'LOAD_MORE':
      return { notables: state.notables.concat(action.notables) };
    case 'LOAD_MORE_COMMENTS':
      return {
        notables: state.notables.map(contentObj => {
          return contentObj.feedId === action.feedId
            ? {
                ...contentObj,
                commentsLoadMoreButton: action.loadMoreButton,
                childComments:
                  action.contentType === 'comment'
                    ? action.comments.concat(contentObj.childComments || [])
                    : (contentObj.childComments || []).concat(action.comments)
              }
            : contentObj;
        })
      };
    case 'LOAD_MORE_REPLIES':
      return {
        notables: state.notables.map(contentObj => {
          return contentObj.feedId === action.data.feedId
            ? {
                ...contentObj,
                childComments: contentObj.childComments.map(comment => {
                  return comment.id === action.data.commentId
                    ? {
                        ...comment,
                        replies: action.data.replies.concat(comment.replies),
                        loadMoreButton: action.data.loadMoreButton
                      }
                    : comment;
                })
              }
            : contentObj;
        })
      };
    case 'LOAD_REPLIES_OF_REPLY':
      return {
        notables: state.notables.map(contentObj => ({
          ...contentObj,
          childComments: contentObj.childComments?.map(comment => {
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
        }))
      };
    case 'LOAD_TAGS':
      return {
        notables: state.notables.map(notable => ({
          ...notable,
          tags:
            notable.contentType === action.contentType &&
            notable.contentId === action.contentId
              ? action.tags
              : notable.tags
        }))
      };
    case 'SET_REWARD_LEVEL':
      return {
        notables: state.notables.map(contentObj => {
          return contentObj.contentType === action.contentType &&
            contentObj.id === action.contentId
            ? {
                ...contentObj,
                rewardLevel: action.rewardLevel
              }
            : {
                ...contentObj,
                rootObj: contentObj.rootObj
                  ? contentObj.rootType === action.contentType &&
                    contentObj.rootId === action.contentId
                    ? {
                        ...contentObj.rootObj,
                        rewardLevel: action.rewardLevel
                      }
                    : contentObj.rootObj
                  : undefined,
                targetObj: contentObj.targetObj
                  ? contentObj.targetObj.subject &&
                    contentObj.subjectId === action.contentId
                    ? {
                        ...contentObj.targetObj,
                        subject: {
                          ...contentObj.targetObj.subject,
                          rewardLevel: action.rewardLevel
                        }
                      }
                    : contentObj.targetObj
                  : undefined
              };
        })
      };
    case 'SHOW_COMMENTS':
      return {
        ...state,
        notables: state.notables.map(contentObj =>
          contentObj.feedId === action.feedId
            ? { ...contentObj, commentsShown: action.shown }
            : contentObj
        )
      };
    case 'SHOW_TC_REPLY_INPUT':
      return {
        ...state,
        notables: state.notables.map(contentObj =>
          contentObj.feedId === action.feedId
            ? {
                ...contentObj,
                targetObj: {
                  ...contentObj.targetObj,
                  replyInputShown: true
                }
              }
            : contentObj
        )
      };
    case 'UPLOAD_COMMENT':
      return {
        notables: state.notables.map(contentObj => {
          if (
            (contentObj.contentType === 'comment' &&
              contentObj.id === action.commentId) ||
            (contentObj.contentType !== 'comment' &&
              !action.commentId &&
              contentObj.contentType === action.contentType &&
              contentObj.id === action.contentId)
          ) {
            return {
              ...contentObj,
              childComments:
                contentObj.contentType === 'comment'
                  ? (contentObj.childComments || []).concat([action.comment])
                  : [action.comment].concat(contentObj.childComments || [])
            };
          } else {
            return {
              ...contentObj,
              childComments: (contentObj.childComments || []).map(
                childComment => {
                  let match = false;
                  if (childComment.id === action.commentId) {
                    match = true;
                  } else {
                    for (let reply of childComment.replies || []) {
                      if (reply.id === action.commentId) {
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
                }
              )
            };
          }
        })
      };
    case 'UPLOAD_REPLY':
      return {
        notables: state.notables.map(contentObj => {
          return contentObj.feedId === action.data.feedId
            ? {
                ...contentObj,
                childComments: contentObj.childComments.map(comment => {
                  let match = false;
                  if (comment.id === action.commentId) {
                    match = true;
                  } else {
                    for (let reply of comment.replies || []) {
                      if (reply.id === action.commentId) {
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
                })
              }
            : contentObj;
        })
      };
    case 'UPLOAD_TARGET_COMMENT':
      return {
        notables: state.notables.map(contentObj => {
          return {
            ...contentObj,
            targetObj:
              contentObj.feedId === action.feedId
                ? {
                    ...contentObj.targetObj,
                    comment: {
                      ...contentObj.targetObj.comment,
                      comments: [action.data].concat(
                        contentObj.targetObj.comment.comments || []
                      )
                    }
                  }
                : contentObj.targetObj
          };
        })
      };
    default:
      throw new Error();
  }
}
