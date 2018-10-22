import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SectionPanel from 'components/SectionPanel';
import Bio from 'components/Texts/Bio';
import ContactItems from './ContactItems';
import Comments from 'components/Comments';
import { connect } from 'react-redux';
import { loadComments } from 'helpers/requestHelpers';
import { processedStringWithURL } from 'helpers/stringHelpers';
import { profileThemes } from 'constants/defaultValues';
import { Color } from 'constants/css';

class Home extends Component {
  static propTypes = {
    profile: PropTypes.shape({
      email: PropTypes.string,
      profileTheme: PropTypes.string,
      statusColor: PropTypes.string,
      statusMsg: PropTypes.string,
      youtube: PropTypes.string
    }).isRequired,
    userId: PropTypes.number
  };

  state = {
    comments: [],
    commentsLoadMoreButton: false
  };

  async componentDidMount() {
    const {
      profile: { id }
    } = this.props;
    try {
      const { comments, loadMoreButton } = await loadComments({
        id,
        type: 'user',
        limit: 5
      });
      this.setState({
        comments,
        commentsLoadMoreButton: loadMoreButton
      });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const {
      profile,
      profile: {
        email,
        id,
        profileTheme,
        statusMsg,
        profileFirstRow,
        profileSecondRow,
        profileThirdRow,
        username,
        youtube
      },
      userId
    } = this.props;
    const { comments, commentsLoadMoreButton } = this.state;
    return (
      <div>
        <SectionPanel
          headerStyle={profileThemes[profileTheme]}
          title="Bio"
          loaded={true}
          loadMoreButtonShown={false}
        >
          {statusMsg && (
            <>
              <div
                style={{
                  fontSize: '2rem',
                  textAlign: 'center',
                  paddingBottom: '2rem'
                }}
                dangerouslySetInnerHTML={{
                  __html: processedStringWithURL(statusMsg)
                }}
              />
              {(profileFirstRow || profileSecondRow || profileThirdRow) && (
                <hr
                  style={{
                    padding: '1px',
                    background: '#fff',
                    borderTop: `2px solid ${Color.lightGray()}`,
                    borderBottom: `2px solid ${Color.lightGray()}`
                  }}
                />
              )}
            </>
          )}
          {(profileFirstRow || profileSecondRow || profileThirdRow) && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Bio
                style={{ fontSize: '2rem', marginBottom: '1rem' }}
                firstRow={profileFirstRow}
                secondRow={profileSecondRow}
                thirdRow={profileThirdRow}
              />
            </div>
          )}
        </SectionPanel>
        {false && (
          <SectionPanel
            headerStyle={profileThemes[profileTheme]}
            style={{
              fontSize: '1.7rem'
            }}
            title="Social"
            loaded={true}
            loadMoreButtonShown={false}
          >
            <ContactItems
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
                height: '50%'
              }}
              email={email}
              youtube={youtube}
            />
          </SectionPanel>
        )}
        <SectionPanel
          title="Messages"
          loaded={true}
          style={{ marginBottom: 0 }}
        >
          <Comments
            comments={comments}
            commentsLoadLimit={20}
            commentsShown={true}
            contentId={id}
            inputAreaInnerRef={ref => (this.CommentInputArea = ref)}
            inputTypeLabel={`message to ${username}`}
            loadMoreButton={commentsLoadMoreButton}
            loadMoreComments={this.onLoadMoreComments}
            noInput={id === userId}
            numPreviews={1}
            onAttachStar={this.onAttachStar}
            onCommentSubmit={this.onCommentSubmit}
            onDelete={this.onDeleteComment}
            onEditDone={this.onEditComment}
            onLikeClick={this.onLikeComment}
            onLoadMoreReplies={this.onLoadMoreReplies}
            onPreviewClick={this.onExpandComments}
            onReplySubmit={this.onReplySubmit}
            onRewardCommentEdit={this.onEditRewardComment}
            parent={{ ...profile, type: 'user' }}
            style={{ marginTop: '-1rem' }}
            userId={userId}
          />
        </SectionPanel>
      </div>
    );
  }

  onAttachStar = star => {
    this.setState(state => ({
      comments: state.comments.map(comment => {
        return {
          ...comment,
          stars:
            comment.id === star.contentId
              ? (comment.stars || []).concat(star)
              : comment.stars || [],
          replies: comment.replies.map(reply => ({
            ...reply,
            stars:
              reply.id === star.contentId
                ? (reply.stars || []).concat(star)
                : reply.stars || []
          }))
        };
      })
    }));
  };

  onCommentSubmit = comment => {
    this.setState(state => ({
      comments: [comment].concat(state.comments)
    }));
  };

  onDeleteComment = commentId => {
    this.setState(state => {
      const comments = state.comments.filter(
        comment => comment.id !== commentId
      );
      return {
        comments: comments.map(comment => ({
          ...comment,
          replies: (comment.replies || []).filter(
            reply => reply.id !== commentId
          )
        }))
      };
    });
  };

  onEditComment = ({ editedComment, commentId }) => {
    this.setState(state => {
      return {
        comments: state.comments.map(comment => ({
          ...comment,
          content: comment.id === commentId ? editedComment : comment.content,
          replies: comment.replies
            ? comment.replies.map(
                reply =>
                  reply.id === commentId
                    ? {
                        ...reply,
                        content: editedComment
                      }
                    : reply
              )
            : []
        }))
      };
    });
  };

  onEditRewardComment = ({ id, text }) => {
    this.setState(state => ({
      comments: state.comments.map(comment => ({
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
    }));
  };

  onLikeComment = ({ commentId, likes }) => {
    this.setState(state => {
      return {
        comments: state.comments.map(comment => ({
          ...comment,
          likes: comment.id === commentId ? likes : comment.likes,
          replies: comment.replies
            ? comment.replies.map(
                reply =>
                  reply.id === commentId
                    ? {
                        ...reply,
                        likes
                      }
                    : reply
              )
            : []
        }))
      };
    });
  };

  onLoadMoreComments = ({ comments, loadMoreButton }) => {
    this.setState(state => ({
      comments: state.comments.concat(comments),
      commentsLoadMoreButton: loadMoreButton
    }));
  };

  onLoadMoreReplies = ({ commentId, replies, loadMoreButton }) => {
    this.setState(state => ({
      comments: state.comments.map(comment => ({
        ...comment,
        replies:
          comment.id === commentId
            ? replies.concat(comment.replies)
            : comment.replies,
        loadMoreButton:
          comment.id === commentId ? loadMoreButton : comment.loadMoreButton
      }))
    }));
  };

  onReplySubmit = data => {
    this.setState(state => ({
      comments: state.comments.map(comment => {
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
    }));
  };
}

export default connect(state => ({ userId: state.UserReducer.userId }))(Home);
