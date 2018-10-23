import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SectionPanel from 'components/SectionPanel';
import Bio from 'components/Texts/Bio';
import ContactItems from './ContactItems';
import Comments from 'components/Comments';
import { connect } from 'react-redux';
import { loadComments } from 'helpers/requestHelpers';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { profileThemes } from 'constants/defaultValues';
import { Color } from 'constants/css';
import StatusMsg from 'components/Texts/StatusMsg';
import RankBar from 'components/RankBar';

class Home extends Component {
  static propTypes = {
    profile: PropTypes.shape({
      email: PropTypes.string,
      id: PropTypes.number,
      statusColor: PropTypes.string,
      statusMsg: PropTypes.string,
      username: PropTypes.string.isRequired,
      youtube: PropTypes.string
    }).isRequired,
    selectedTheme: PropTypes.string.isRequired,
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

  async componentDidUpdate(prevProps) {
    if (this.props.profile?.id !== prevProps.profile?.id) {
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
  }

  render() {
    const {
      profile,
      profile: {
        email,
        id,
        statusMsg,
        profileFirstRow,
        profileSecondRow,
        profileThirdRow,
        statusColor,
        username,
        youtube
      },
      selectedTheme,
      userId
    } = this.props;
    const { comments, commentsLoadMoreButton } = this.state;
    const bioExists = profileFirstRow || profileSecondRow || profileThirdRow;
    const usernameColor = Color[selectedTheme]();
    let greeting = `<p>Welcome to <b style="color: ${usernameColor}">${username}</b>'s Profile Page</p>`;
    return (
      <div>
        <SectionPanel
          headerTheme={profileThemes[selectedTheme]}
          title="Welcome"
          loaded={true}
          loadMoreButtonShown={false}
        >
          <div
            style={{
              display: 'flex',
              width: '100%',
              minHeight: '10rem',
              marginTop: stringIsEmpty(statusMsg) ? '-1rem' : 0
            }}
          >
            {!stringIsEmpty(statusMsg) && (
              <StatusMsg
                style={{
                  width: '50%',
                  fontSize: '1.6rem',
                  textAlign: 'center',
                  marginTop: profile.twinkleXP > 0 || bioExists ? '1rem' : 0,
                  marginBottom: profile.twinkleXP > 0 || bioExists ? '2rem' : 0
                }}
                statusColor={statusColor}
                statusMsg={statusMsg}
              />
            )}
            {stringIsEmpty(statusMsg) && (
              <div
                style={{
                  width: '50%',
                  fontSize: '2rem',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                dangerouslySetInnerHTML={{ __html: greeting }}
              />
            )}
            <ContactItems
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
                width: '50%'
              }}
              email={email}
              youtube={youtube}
            />
          </div>
          {profile.twinkleXP > 0 && (
            <RankBar
              profile={profile}
              style={{
                display: 'block',
                marginLeft: '-1rem',
                marginRight: '-1rem',
                borderRadius: 0
              }}
            />
          )}
          {!stringIsEmpty(statusMsg) &&
            !profile.twinkleXP &&
            bioExists && (
              <hr
                style={{
                  padding: '1px',
                  background: '#fff',
                  borderTop: `2px solid ${Color[selectedTheme](0.6)}`,
                  borderBottom: `2px solid ${Color[selectedTheme](0.6)}`
                }}
              />
            )}
          {bioExists && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Bio
                style={{ fontSize: '2rem', marginBottom: '1rem' }}
                firstRow={profileFirstRow}
                secondRow={profileSecondRow}
                thirdRow={profileThirdRow}
              />
            </div>
          )}
          <Comments
            autoFocus
            style={{ marginTop: '1rem' }}
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
