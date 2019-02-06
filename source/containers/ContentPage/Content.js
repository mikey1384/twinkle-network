import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContentPanel from 'components/ContentPanel';
import NotFound from 'components/NotFound';
import Loading from 'components/Loading';
import { connect } from 'react-redux';
import request from 'axios';

const { URL } = process.env;

class Content extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    userId: PropTypes.number,
    history: PropTypes.object.isRequired
  };

  state = {
    contentObj: {},
    loaded: false,
    exists: false
  };

  mounted = false;

  async componentDidMount() {
    const {
      match: {
        params: { contentId },
        url
      }
    } = this.props;
    this.mounted = true;
    let type = url.split('/')[1].slice(0, -1);
    try {
      const {
        data: { exists }
      } = await request.get(
        `${URL}/content/check?contentId=${contentId}&type=${type}`
      );
      if (this.mounted) {
        this.setState({
          loaded: true,
          exists,
          contentObj: {
            contentId,
            type
          }
        });
      }
    } catch (error) {
      console.error(error);
      if (this.mounted) {
        this.setState({
          loaded: true,
          exists: false
        });
      }
    }
  }

  async componentDidUpdate(prevProps) {
    const {
      match: {
        params: { contentId },
        url
      }
    } = this.props;
    if (url !== prevProps.match.url) {
      const type = url.split('/')[1].slice(0, -1);
      try {
        const {
          data: { exists }
        } = await request.get(
          `${URL}/content/check?contentId=${contentId}&type=${type}`
        );
        if (this.mounted) {
          this.setState({
            loaded: true,
            exists,
            contentObj: {
              contentId,
              type
            }
          });
        }
      } catch (error) {
        console.error(error);
        if (this.mounted) {
          this.setState({
            loaded: true,
            exists: false
          });
        }
      }
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { userId } = this.props;
    const { contentObj, loaded, exists } = this.state;
    return loaded ? (
      exists ? (
        <ContentPanel
          key={contentObj.type + contentObj.contentId}
          autoExpand
          inputAtBottom={contentObj.type === 'comment'}
          commentsLoadLimit={5}
          contentObj={contentObj}
          userId={userId}
          onAttachStar={this.onAttachStar}
          onCommentSubmit={this.onCommentSubmit}
          onDeleteComment={this.onDeleteComment}
          onDeleteContent={this.onDeleteContent}
          onEditComment={this.onEditComment}
          onEditContent={this.onEditContent}
          onEditRewardComment={this.onEditRewardComment}
          onLikeContent={this.onLikeContent}
          onLoadContent={this.onLoadContent}
          onLoadMoreComments={this.onLoadMoreComments}
          onLoadMoreReplies={this.onLoadMoreReplies}
          onLoadRepliesOfReply={this.onLoadRepliesOfReply}
          onReplySubmit={this.onReplySubmit}
          onSetDifficulty={this.onSetDifficulty}
          onShowComments={this.onShowComments}
          onTargetCommentSubmit={this.onTargetCommentSubmit}
        />
      ) : (
        <NotFound />
      )
    ) : (
      <Loading />
    );
  }

  onAttachStar = data => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        stars:
          data.contentId === state.contentObj.contentId &&
          data.contentType === state.contentObj.type
            ? state.contentObj.stars
              ? state.contentObj.stars.concat(data)
              : [data]
            : state.contentObj.stars || [],
        childComments: (state.contentObj.childComments || []).map(comment => {
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
        targetObj: state.contentObj.targetObj
          ? {
              ...state.contentObj.targetObj,
              comment: state.contentObj.targetObj.comment
                ? {
                    ...state.contentObj.targetObj.comment,
                    stars:
                      state.contentObj.targetObj.comment.id ===
                        data.contentId && data.contentType === 'comment'
                        ? (
                            state.contentObj.targetObj.comment.stars || []
                          ).concat(data)
                        : state.contentObj.targetObj.comment.stars
                  }
                : undefined
            }
          : undefined
      }
    }));
  };

  onCommentSubmit = data => {
    const {
      contentObj: { type }
    } = this.state;
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        childComments:
          type === 'comment'
            ? (state.contentObj.childComments || []).concat([data])
            : [data].concat(state.contentObj.childComments)
      }
    }));
  };

  onReplySubmit = data => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        childComments: state.contentObj.childComments.map(comment => {
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
      }
    }));
  };

  onDeleteComment = commentId => {
    this.setState(state => {
      const comments = (state.contentObj.childComments || []).filter(
        comment => comment.id !== commentId
      );
      return {
        contentObj: {
          ...state.contentObj,
          targetObj: state.contentObj.targetObj
            ? {
                ...state.contentObj.targetObj,
                comment: state.contentObj.targetObj.comment
                  ? {
                      ...state.contentObj.targetObj.comment,
                      comments: state.contentObj.targetObj.comment.comments
                        ? state.contentObj.targetObj.comment.comments.filter(
                            comment => comment.id !== commentId
                          )
                        : []
                    }
                  : undefined
              }
            : undefined,
          childComments: comments.map(comment => ({
            ...comment,
            replies: (comment.replies || []).filter(
              reply => reply.id !== commentId
            )
          }))
        }
      };
    });
  };

  onEditComment = ({ editedComment, commentId }) => {
    this.setState(state => {
      return {
        contentObj: {
          ...state.contentObj,
          childComments: state.contentObj.childComments.map(comment => ({
            ...comment,
            content: comment.id === commentId ? editedComment : comment.content,
            replies: comment.replies
              ? comment.replies.map(reply =>
                  reply.id === commentId
                    ? {
                        ...reply,
                        content: editedComment
                      }
                    : reply
                )
              : []
          })),
          targetObj: state.contentObj.targetObj
            ? {
                ...state.contentObj.targetObj,
                comment: state.contentObj.targetObj.comment
                  ? {
                      ...state.contentObj.targetObj.comment,
                      comments: (
                        state.contentObj.targetObj.comment.comments || []
                      ).map(comment =>
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
        }
      };
    });
  };

  onEditRewardComment = ({ id, text }) => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        stars: state.contentObj.stars
          ? state.contentObj.stars.map(star => ({
              ...star,
              rewardComment: star.id === id ? text : star.rewardComment
            }))
          : [],
        childComments: state.contentObj.childComments
          ? state.contentObj.childComments.map(comment => ({
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
          : [],
        targetObj: state.contentObj.targetObj
          ? {
              ...state.contentObj.targetObj,
              comment: state.contentObj.targetObj.comment
                ? {
                    ...state.contentObj.targetObj.comment,
                    stars: state.contentObj.targetObj.comment.stars
                      ? state.contentObj.targetObj.comment.stars.map(star => ({
                          ...star,
                          rewardComment:
                            star.id === id ? text : star.rewardComment
                        }))
                      : []
                  }
                : undefined
            }
          : undefined
      }
    }));
  };

  onDeleteContent = () => {
    const { history } = this.props;
    history.push('/');
  };

  onEditContent = ({ data }) => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        ...data
      }
    }));
  };

  onLikeContent = ({ likes, type, contentId }) => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        likes:
          state.contentObj.id === contentId && state.contentObj.type === type
            ? likes
            : state.contentObj.likes,
        childComments:
          type === 'comment'
            ? state.contentObj.childComments.map(comment => ({
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
            : state.contentObj.childComments,
        rootObj: state.contentObj.rootObj
          ? {
              ...state.contentObj.rootObj,
              likes:
                state.contentObj.rootId === contentId &&
                state.contentObj.rootType === type
                  ? likes
                  : state.contentObj.rootObj.likes
            }
          : undefined,
        targetObj: state.contentObj.targetObj
          ? {
              ...state.contentObj.targetObj,
              [type]: state.contentObj.targetObj[type]
                ? {
                    ...state.contentObj.targetObj[type],
                    likes:
                      state.contentObj.targetObj[type].id === contentId
                        ? likes
                        : state.contentObj.targetObj[type].likes
                  }
                : undefined
            }
          : undefined
      }
    }));
  };

  onLoadContent = ({ data }) => {
    this.setState(state => ({ contentObj: { ...state.contentObj, ...data } }));
  };

  onLoadMoreComments = ({ data: { comments, loadMoreButton } }) => {
    const {
      contentObj: { type }
    } = this.state;
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        childComments:
          type === 'comment'
            ? comments.concat(state.contentObj.childComments)
            : state.contentObj.childComments.concat(comments),
        commentsLoadMoreButton: loadMoreButton
      }
    }));
  };

  onLoadMoreReplies = ({ commentId, replies, loadMoreButton }) => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        childComments: state.contentObj.childComments.map(comment => ({
          ...comment,
          replies:
            comment.id === commentId
              ? replies.concat(comment.replies)
              : comment.replies,
          loadMoreButton:
            comment.id === commentId ? loadMoreButton : comment.loadMoreButton
        }))
      }
    }));
  };

  onLoadRepliesOfReply = ({ replies, commentId, replyId }) => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        childComments: state.contentObj.childComments.map(comment => {
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
      }
    }));
  };

  onSetDifficulty = ({ difficulty }) => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        difficulty
      }
    }));
  };

  onShowComments = ({ comments, loadMoreButton }) => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        childComments: comments,
        commentsLoadMoreButton: loadMoreButton
      }
    }));
    return Promise.resolve();
  };

  onTargetCommentSubmit = data => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        targetObj: {
          ...state.contentObj.targetObj,
          comment: {
            ...state.contentObj.targetObj.comment,
            comments: [data].concat(
              state.contentObj.targetObj.comment.comments || []
            )
          }
        }
      }
    }));
  };
}

export default connect(state => ({
  userId: state.UserReducer.userId
}))(Content);
