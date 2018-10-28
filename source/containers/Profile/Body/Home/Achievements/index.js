import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SectionPanel from 'components/SectionPanel';
import ContentPanel from 'components/ContentPanel';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import MonthlyXp from './MonthlyXp';
import { profileThemes } from 'constants/defaultValues';
import {
  loadNotableContent,
  loadMoreNotableContents
} from 'helpers/requestHelpers';

export default class Achievements extends Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    selectedTheme: PropTypes.string.isRequired,
    myId: PropTypes.number
  };

  mounted = false;

  state = {
    loading: true,
    notables: [],
    loadMoreButton: false
  };

  async componentDidMount() {
    const {
      profile: { id }
    } = this.props;
    this.mounted = true;
    const { results, loadMoreButton } = await loadNotableContent({
      userId: id
    });
    if (this.mounted) {
      this.setState({ notables: results, loadMoreButton, loading: false });
    }
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.profile.id !== this.props.profile.id) {
      const { results, loadMoreButton } = await loadNotableContent({
        userId: this.props.profile.id
      });
      if (this.mounted) {
        this.setState({ notables: results, loadMoreButton, loading: false });
      }
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const {
      profile: { id, username },
      myId,
      selectedTheme
    } = this.props;
    const { loading, loadMoreButton, notables } = this.state;
    return (
      <div>
        <SectionPanel
          headerTheme={profileThemes[selectedTheme]}
          title="Notable Activities"
          loaded={!loading}
        >
          {notables.length === 0 && (
            <div
              style={{ fontSize: '2rem', textAlign: 'center' }}
            >{`${username} hasn't engaged in an activity worth showing here, yet`}</div>
          )}
          {notables?.map(contentObj => (
            <ContentPanel
              key={contentObj.feedId}
              inputAtBottom={contentObj.type === 'comment'}
              commentsLoadLimit={5}
              contentObj={contentObj}
              userId={myId}
              onAttachStar={this.onAttachStar}
              onCommentSubmit={data =>
                this.onCommentSubmit({
                  contentId: contentObj.contentId,
                  contentType: contentObj.type,
                  comment: data
                })
              }
              onDeleteComment={this.onDeleteComment}
              onDeleteContent={this.onDeleteContent}
              onEditComment={this.onEditComment}
              onEditContent={this.onEditContent}
              onEditRewardComment={this.onEditRewardComment}
              onLikeContent={this.onLikeContent}
              onLoadContent={this.onLoadContent}
              onLoadMoreComments={this.onLoadMoreComments}
              onLoadMoreReplies={this.onLoadMoreReplies}
              onReplySubmit={this.onReplySubmit}
              onSetDifficulty={this.onSetDifficulty}
              onShowComments={this.onShowComments}
              onTargetCommentSubmit={this.onTargetCommentSubmit}
            />
          ))}
          {loadMoreButton && (
            <LoadMoreButton
              style={{ fontSize: '1.7rem' }}
              label="Show More"
              transparent
              onClick={this.onShowMoreNotables}
            />
          )}
        </SectionPanel>
        <MonthlyXp headerTheme={profileThemes[selectedTheme]} userId={id} />
      </div>
    );
  }

  onShowMoreNotables = async() => {
    const { notables } = this.state;
    const { profile } = this.props;
    const { results, loadMoreButton } = await loadMoreNotableContents({
      userId: profile.id,
      notables
    });
    this.setState(state => ({
      notables: state.notables.concat(results),
      loadMoreButton
    }));
  };

  onAttachStar = async data => {
    this.setState(state => ({
      notables: state.notables.map(contentObj => {
        return contentObj.contentId === data.contentId
          ? {
              ...contentObj,
              stars:
                data.contentType === contentObj.type
                  ? contentObj.stars
                    ? contentObj.stars.concat(data)
                    : [data]
                  : contentObj.stars || [],
              childComments: contentObj.childComments?.map(comment => {
                return {
                  ...comment,
                  stars:
                    comment.id === data.contentId &&
                    data.contentType === 'comment'
                      ? (comment.stars || []).concat(data)
                      : comment.stars || [],
                  replies: comment.replies.map(reply => ({
                    ...reply,
                    stars:
                      reply.id === data.contentId &&
                      data.contentType === 'comment'
                        ? (reply.stars || []).concat(data)
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
                              data.contentId && data.contentType === 'comment'
                              ? (
                                  contentObj.targetObj.comment.stars || []
                                ).concat(data)
                              : contentObj.targetObj.comment.stars
                        }
                      : undefined
                  }
                : undefined
            }
          : contentObj;
      })
    }));
  };

  onCommentSubmit = ({ contentType, contentId, comment }) => {
    this.setState(state => {
      const commentId = comment.replyId || comment.commentId;
      return {
        notables: state.notables.map(contentObj => {
          if (
            (contentObj.type === 'comment' && contentObj.id === commentId) ||
            (contentObj.type !== 'comment' &&
              !commentId &&
              contentObj.type === contentType &&
              contentObj.id === contentId)
          ) {
            return {
              ...contentObj,
              childComments:
                contentObj.type === 'comment'
                  ? (contentObj.childComments || []).concat([comment])
                  : [comment].concat(contentObj.childComments || [])
            };
          } else {
            return {
              ...contentObj,
              childComments: (contentObj.childComments || []).map(
                childComment => {
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
                      ? childComment.replies.concat([comment])
                      : childComment.replies
                  };
                }
              )
            };
          }
        })
      };
    });
  };

  onDeleteComment = commentId => {
    this.setState(state => {
      return {
        notables: state.notables.reduce((prev, contentObj) => {
          if (
            contentObj.type === 'comment' &&
            (contentObj.contentId === commentId ||
              contentObj.commentId === commentId ||
              contentObj.replyId === commentId)
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
                            comment => comment.id !== commentId
                          )
                        }
                      : undefined
                  }
                : undefined,
              childComments: contentObj.childComments?.reduce(
                (prev, comment) => {
                  if (comment.id === commentId) {
                    return prev;
                  }
                  return prev.concat([
                    {
                      ...comment,
                      replies: comment.replies?.filter(
                        reply => reply.id !== commentId
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
    });
  };

  onDeleteContent = ({ contentId, type }) => {
    this.setState(state => {
      return {
        notables: state.notables
          .filter(
            contentObj =>
              contentObj.type !== type || contentObj.contentId !== contentId
          )
          .map(
            contentObj =>
              type === 'comment'
                ? {
                    ...contentObj,
                    targetObj: contentObj.targetObj
                      ? {
                          ...contentObj.targetObj,
                          comment: contentObj.targetObj.comment
                            ? {
                                ...contentObj.targetObj.comment,
                                comments: contentObj.targetObj.comment.comments?.filter(
                                  comment => comment.id !== contentId
                                )
                              }
                            : undefined
                        }
                      : undefined,
                    childComments: contentObj.childComments?.reduce(
                      (prev, comment) => {
                        if (comment.id === contentId) {
                          return prev;
                        }
                        return prev.concat([
                          {
                            ...comment,
                            replies: comment.replies?.filter(
                              reply => reply.id !== contentId
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
    });
  };

  onEditComment = ({ editedComment, commentId }) => {
    this.setState(state => {
      return {
        notables: state.notables.map(contentObj => {
          return contentObj.id === commentId && contentObj.type === 'comment'
            ? {
                ...contentObj,
                content: editedComment
              }
            : {
                ...contentObj,
                targetObj: contentObj.targetObj
                  ? {
                      ...contentObj.targetObj,
                      comment: contentObj.targetObj.comment
                        ? contentObj.targetObj.comment.id === commentId
                          ? {
                              ...contentObj.targetObj.comment,
                              content: editedComment
                            }
                          : {
                              ...contentObj.targetObj.comment,
                              comments: (
                                contentObj.targetObj.comment.comments || []
                              ).map(
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
                childComments: contentObj.childComments?.map(comment => {
                  return comment.id === commentId
                    ? {
                        ...comment,
                        content: editedComment
                      }
                    : {
                        ...comment,
                        replies: comment.replies?.map(
                          reply =>
                            reply.id === commentId
                              ? {
                                  ...reply,
                                  content: editedComment
                                }
                              : reply
                        )
                      };
                })
              };
        })
      };
    });
  };

  onEditContent = ({ contentId, contentType, data }) => {
    this.setState(state => {
      return {
        ...state,
        notables: state.notables.map(contentObj => {
          const contentMatches =
            contentObj.type === contentType &&
            contentObj.contentId === contentId;
          const rootContentMatches =
            contentObj.rootType === contentType &&
            contentObj.rootId === contentId;
          return contentMatches
            ? {
                ...contentObj,
                ...data
              }
            : rootContentMatches
              ? {
                  ...contentObj,
                  rootObj: {
                    ...contentObj.rootObj,
                    ...data
                  }
                }
              : {
                  ...contentObj,
                  targetObj: contentObj.targetObj
                    ? {
                        ...contentObj.targetObj,
                        [contentType]: contentObj.targetObj[contentType]
                          ? contentObj.targetObj[contentType].id === contentId
                            ? {
                                ...contentObj.targetObj[data.type],
                                ...data
                              }
                            : contentObj.targetObj[contentType]
                          : undefined
                      }
                    : undefined,
                  childComments:
                    contentType === 'comment'
                      ? contentObj.childComments?.map(comment => {
                          return comment.id === contentId
                            ? {
                                ...comment,
                                ...data
                              }
                            : {
                                ...comment,
                                replies: comment.replies?.map(
                                  reply =>
                                    reply.id === contentId
                                      ? {
                                          ...reply,
                                          ...data
                                        }
                                      : reply
                                )
                              };
                        })
                      : contentObj.childComments
                };
        })
      };
    });
  };

  onEditRewardComment = ({ id, text }) => {
    this.setState(state => {
      return {
        notables: state.notables.map(contentObj => {
          return {
            ...contentObj,
            stars: contentObj.stars
              ? contentObj.stars.map(star => ({
                  ...star,
                  rewardComment: star.id === id ? text : star.rewardComment
                }))
              : [],
            childComments: (contentObj.childComments || []).map(comment => ({
              ...comment,
              stars: comment.stars
                ? comment.stars.map(star => ({
                    ...star,
                    rewardComment: star.id === id ? text : star.rewardComment
                  }))
                : [],
              replies: (comment.replies || []).map(reply => ({
                ...reply,
                stars: reply.stars
                  ? reply.stars.map(star => ({
                      ...star,
                      rewardComment: star.id === id ? text : star.rewardComment
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
                                star.id === id ? text : star.rewardComment
                            }))
                          : []
                      }
                    : undefined
                }
              : undefined
          };
        })
      };
    });
  };

  onLikeContent = ({ likes, type, contentId }) => {
    this.setState(state => {
      return {
        notables: state.notables.map(contentObj => ({
          ...contentObj,
          likes:
            contentObj.type === type && contentObj.id === contentId
              ? likes
              : contentObj.likes,
          rootObj: contentObj.rootObj
            ? {
                ...contentObj.rootObj,
                likes:
                  contentObj.rootType === type &&
                  contentObj.rootId === contentId
                    ? likes
                    : contentObj.rootObj.likes
              }
            : undefined,
          targetObj: contentObj.targetObj
            ? {
                ...contentObj.targetObj,
                comment:
                  contentObj.targetObj.comment &&
                  contentObj.targetObj.comment.id === contentId &&
                  type === 'comment'
                    ? {
                        ...contentObj.targetObj.comment,
                        likes
                      }
                    : contentObj.targetObj.comment
              }
            : undefined,
          childComments:
            type === 'comment'
              ? (contentObj.childComments || []).map(
                  comment =>
                    comment.id === contentId
                      ? { ...comment, likes: likes }
                      : {
                          ...comment,
                          replies: (comment.replies || []).map(
                            reply =>
                              reply.id === contentId
                                ? { ...reply, likes: likes }
                                : reply
                          )
                        }
                )
              : contentObj.childComments
        }))
      };
    });
  };

  onLoadContent = async({ data }) => {
    this.setState(state => ({
      notables: state.notables.map(contentObj => {
        return contentObj.contentId === data.id
          ? { ...contentObj, ...data }
          : contentObj;
      })
    }));
  };

  onLoadMoreComments = ({
    data: { comments, loadMoreButton },
    contentType,
    feedId
  }) => {
    this.setState(state => {
      return {
        notables: state.notables.map(contentObj => {
          let match = contentObj.feedId === feedId;
          return match
            ? {
                ...contentObj,
                commentsLoadMoreButton: loadMoreButton,
                childComments:
                  contentType === 'comment'
                    ? comments.concat(contentObj.childComments || [])
                    : (contentObj.childComments || []).concat(comments)
              }
            : contentObj;
        })
      };
    });
  };

  onLoadMoreReplies = ({ data, feedId }) => {
    this.setState(state => {
      return {
        notables: state.notables.map(contentObj => {
          return contentObj.feedId === feedId
            ? {
                ...contentObj,
                childComments: contentObj.childComments.map(comment => {
                  return comment.id === data.commentId
                    ? {
                        ...comment,
                        replies: data.replies.concat(comment.replies),
                        loadMoreButton: data.loadMoreButton
                      }
                    : comment;
                })
              }
            : contentObj;
        })
      };
    });
  };

  onReplySubmit = data => {
    this.setState(state => {
      let commentId = data.replyId || data.commentId;
      return {
        notables: state.notables.map(contentObj => {
          return contentObj.feedId === data.feedId
            ? {
                ...contentObj,
                childComments: contentObj.childComments.map(comment => {
                  let match = false;
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
                      ? comment.replies.concat([data])
                      : comment.replies
                  };
                })
              }
            : contentObj;
        })
      };
    });
  };

  onSetDifficulty = ({ type, contentId, difficulty }) => {
    this.setState(state => {
      return {
        notables: state.notables.map(contentObj => {
          return contentObj.type === type && contentObj.id === contentId
            ? {
                ...contentObj,
                difficulty
              }
            : {
                ...contentObj,
                rootObj: contentObj.rootObj
                  ? contentObj.rootType === type &&
                    contentObj.rootId === contentId
                    ? {
                        ...contentObj.rootObj,
                        difficulty
                      }
                    : contentObj.rootObj
                  : undefined,
                targetObj: contentObj.targetObj
                  ? contentObj.targetObj.discussion &&
                    contentObj.discussionId === contentId
                    ? {
                        ...contentObj.targetObj,
                        discussion: {
                          ...contentObj.targetObj.discussion,
                          difficulty
                        }
                      }
                    : contentObj.targetObj
                  : undefined
              };
        })
      };
    });
  };
  onShowComments = (data, feedId) => {
    this.setState(state => {
      if (data.comments.length === 0) return state;
      return {
        notables: state.notables.map(contentObj => {
          return contentObj.feedId === feedId
            ? {
                ...contentObj,
                commentsLoadMoreButton: data.loadMoreButton,
                childComments: data.comments
              }
            : contentObj;
        })
      };
    });
  };

  onTargetCommentSubmit = (data, feedId) => {
    this.setState(state => {
      return {
        notables: state.notables.map(contentObj => {
          return {
            ...contentObj,
            targetObj:
              contentObj.feedId === feedId
                ? {
                    ...contentObj.targetObj,
                    comment: {
                      ...contentObj.targetObj.comment,
                      comments: [data].concat(
                        contentObj.targetObj.comment.comments || []
                      )
                    }
                  }
                : contentObj.targetObj
          };
        })
      };
    });
  };
}
