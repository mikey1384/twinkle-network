import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SectionPanel from 'components/SectionPanel';
import Bio from 'components/Texts/Bio';
import BasicInfos from './BasicInfos';
import Comments from 'components/Comments';
import StatusMsg from 'components/UserDetails/StatusMsg';
import StatusInput from 'components/UserDetails/StatusInput';
import RankBar from 'components/RankBar';
import request from 'axios';
import Button from 'components/Button';
import Icon from 'components/Icon';
import ConfirmModal from 'components/Modals/ConfirmModal';
import { removeStatusMsg, updateStatusMsg } from 'redux/actions/UserActions';
import { connect } from 'react-redux';
import { auth, loadComments } from 'helpers/requestHelpers';
import {
  addEmoji,
  finalizeEmoji,
  renderText,
  stringIsEmpty
} from 'helpers/stringHelpers';
import { profileThemes } from 'constants/defaultValues';
import { Color } from 'constants/css';
import { URL } from 'constants/URL';

class Home extends Component {
  static propTypes = {
    profile: PropTypes.shape({
      email: PropTypes.string,
      id: PropTypes.number,
      statusColor: PropTypes.string,
      statusMsg: PropTypes.string,
      username: PropTypes.string.isRequired,
      website: PropTypes.string,
      youtubeName: PropTypes.string,
      youtubeUrl: PropTypes.string
    }).isRequired,
    selectedTheme: PropTypes.string.isRequired,
    userId: PropTypes.number
  };

  constructor({ profile: { statusColor } }) {
    super();
    this.state = {
      comments: [],
      commentsLoadMoreButton: false,
      confirmModalShown: false,
      editedStatusColor: statusColor,
      editedStatusMsg: ''
    };
  }

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
        joinDate,
        lastActive,
        statusMsg,
        profileFirstRow,
        profileSecondRow,
        profileThirdRow,
        statusColor,
        username,
        website,
        youtubeName,
        youtubeUrl
      },
      selectedTheme,
      userId
    } = this.props;
    const {
      comments,
      commentsLoadMoreButton,
      confirmModalShown,
      editedStatusColor,
      editedStatusMsg
    } = this.state;
    const bioExists = profileFirstRow || profileSecondRow || profileThirdRow;
    const usernameColor = Color[selectedTheme]();
    let greeting = `<p>Welcome to <b style="color: ${usernameColor}">${username}</b>'s Profile Page</p>`;
    return (
      <div>
        <SectionPanel
          headerTheme={profileThemes[selectedTheme]}
          title="Welcome"
          loaded
          loadMoreButtonShown={false}
        >
          <div
            style={{
              display: 'flex',
              minHeight: '10rem',
              width: '100%'
            }}
          >
            <div
              style={{
                width: '50%',
                marginRight: '0.5rem'
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}
              >
                {userId === profile.id && (
                  <StatusInput
                    autoFocus
                    innerRef={ref => {
                      this.StatusInput = ref;
                    }}
                    profile={profile}
                    statusColor={editedStatusColor || statusColor}
                    editedStatusMsg={editedStatusMsg}
                    setColor={color =>
                      this.setState({ editedStatusColor: color })
                    }
                    onTextChange={event => {
                      this.setState({
                        editedStatusMsg: addEmoji(
                          renderText(event.target.value)
                        ),
                        ...(!event.target.value
                          ? { editedStatusColor: '' }
                          : {})
                      });
                    }}
                    onCancel={() =>
                      this.setState({
                        editedStatusMsg: '',
                        editedStatusColor: ''
                      })
                    }
                    onStatusSubmit={this.onStatusMsgSubmit}
                  />
                )}
                {(!stringIsEmpty(statusMsg) || editedStatusMsg) && (
                  <StatusMsg
                    style={{
                      fontSize: '1.6rem',
                      width: '100%',
                      marginTop:
                        profile.twinkleXP > 0 || bioExists ? '1rem' : 0,
                      marginBottom:
                        profile.twinkleXP > 0 || bioExists
                          ? userId === profile.id
                            ? '1rem'
                            : '2rem'
                          : 0
                    }}
                    statusColor={editedStatusColor || statusColor || 'logoBlue'}
                    statusMsg={editedStatusMsg || statusMsg}
                  />
                )}
                {userId === profile.id &&
                  !editedStatusMsg &&
                  !stringIsEmpty(statusMsg) && (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <Button
                        transparent
                        style={{
                          marginBottom:
                            profile.twinkleXP > 0 || bioExists ? '1rem' : 0
                        }}
                        onClick={() =>
                          this.setState({ confirmModalShown: true })
                        }
                      >
                        <Icon icon="trash-alt" />
                        <span style={{ marginLeft: '0.7rem' }}>Remove</span>
                      </Button>
                    </div>
                  )}
                {userId !== profile.id &&
                  stringIsEmpty(statusMsg) && (
                    <div
                      style={{
                        marginTop: '-1rem',
                        width: '100%',
                        fontSize: '2rem',
                        display: 'flex',
                        textAlign: 'center',
                        alignItems: 'center'
                      }}
                      dangerouslySetInnerHTML={{ __html: greeting }}
                    />
                  )}
              </div>
            </div>
            <BasicInfos
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
                width: '50%',
                fontSize: '1.7rem',
                marginLeft: '0.5rem',
                marginBottom: '1rem'
              }}
              email={email}
              joinDate={joinDate}
              lastActive={lastActive}
              myId={userId}
              userId={id}
              username={username}
              selectedTheme={selectedTheme}
              website={website}
              youtubeName={youtubeName}
              youtubeUrl={youtubeUrl}
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
        {confirmModalShown && (
          <ConfirmModal
            onConfirm={this.onRemoveStatus}
            onHide={() => this.setState({ confirmModalShown: false })}
            title={`Remove Status Message`}
          />
        )}
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

  onRemoveStatus = async() => {
    const { removeStatusMsg, userId } = this.props;
    await request.delete(`${URL}/user/statusMsg`, auth());
    removeStatusMsg(userId);
    this.setState({ confirmModalShown: false });
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

  onStatusMsgSubmit = async() => {
    const { updateStatusMsg, profile } = this.props;
    const { editedStatusMsg, editedStatusColor } = this.state;
    const statusMsg = finalizeEmoji(editedStatusMsg);
    const statusColor = editedStatusColor || profile.statusColor;
    const { data } = await request.post(
      `${URL}/user/statusMsg`,
      {
        statusMsg,
        statusColor
      },
      auth()
    );
    this.setState({ editedStatusColor: '', editedStatusMsg: '' });
    if (typeof updateStatusMsg === 'function') updateStatusMsg(data);
  };
}

export default connect(
  state => ({ userId: state.UserReducer.userId }),
  { removeStatusMsg, updateStatusMsg }
)(Home);
