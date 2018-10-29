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
import BioEditModal from 'components/Modals/BioEditModal';
import Achievements from './Achievements';
import DropDownButton from 'components/Buttons/DropdownButton';
import {
  removeStatusMsg,
  updateStatusMsg,
  setGreeting,
  uploadBio
} from 'redux/actions/UserActions';
import { connect } from 'react-redux';
import { auth, loadComments, uploadGreeting } from 'helpers/requestHelpers';
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
    dispatch: PropTypes.func.isRequired,
    profile: PropTypes.shape({
      email: PropTypes.string,
      id: PropTypes.number,
      greeting: PropTypes.string,
      statusColor: PropTypes.string,
      statusMsg: PropTypes.string,
      username: PropTypes.string.isRequired,
      website: PropTypes.string,
      youtubeName: PropTypes.string,
      youtubeUrl: PropTypes.string
    }).isRequired,
    selectedTheme: PropTypes.string.isRequired,
    setGreeting: PropTypes.func.isRequired,
    userId: PropTypes.number
  };

  mounted = false;

  constructor({ profile: { statusColor } }) {
    super();
    this.state = {
      bioEditModalShown: false,
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
    this.mounted = true;
    try {
      const { comments, loadMoreButton } = await loadComments({
        id,
        type: 'user',
        limit: 5
      });
      if (this.mounted) {
        this.setState({
          comments,
          commentsLoadMoreButton: loadMoreButton
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  async componentDidUpdate(prevProps) {
    if (this.props.profile.id !== prevProps.profile.id) {
      const {
        profile: { id, statusColor }
      } = this.props;
      try {
        const { comments, loadMoreButton } = await loadComments({
          id,
          type: 'user',
          limit: 5
        });
        if (this.mounted) {
          this.setState({
            comments,
            commentsLoadMoreButton: loadMoreButton,
            editedStatusColor: statusColor
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const {
      profile,
      profile: {
        email,
        greeting,
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
      bioEditModalShown,
      comments,
      commentsLoadMoreButton,
      confirmModalShown,
      editedStatusColor,
      editedStatusMsg
    } = this.state;
    const bioExists = profileFirstRow || profileSecondRow || profileThirdRow;
    const usernameColor = Color[selectedTheme]();
    let defaultMessage = `<p>Welcome to <b style="color: ${usernameColor}">${username}</b>'s Profile Page</p>`;
    return (
      <div>
        <SectionPanel
          inverted
          loaded
          headerTheme={profileThemes[selectedTheme]}
          title={greeting || 'Welcome!'}
          canEdit={id === userId}
          placeholder="Enter a message for your visitors"
          onEditTitle={this.onEditGreeting}
        >
          <div
            style={{
              display: 'flex',
              minHeight: '10rem',
              width: '100%',
              marginTop: userId !== profile.id ? '-1.5rem' : 0
            }}
          >
            <div
              style={{
                width: 'CALC(50% - 1rem)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginRight: '1rem'
              }}
            >
              <div
                style={{
                  width: '90%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}
              >
                {userId === profile.id && (
                  <StatusInput
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
                        profile.twinkleXP > 0 || bioExists ? '2rem' : 0
                    }}
                    statusColor={editedStatusColor || statusColor || 'logoBlue'}
                    statusMsg={editedStatusMsg || statusMsg}
                  />
                )}
                {userId === profile.id &&
                  !editedStatusMsg &&
                  !stringIsEmpty(statusMsg) && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '-1rem',
                        marginBottom:
                          profile.twinkleXP > 0 || bioExists ? '1rem' : 0
                      }}
                    >
                      <Button
                        transparent
                        onClick={() => {
                          this.setState({ editedStatusMsg: statusMsg });
                          this.StatusInput.focus();
                        }}
                      >
                        <Icon icon="pencil-alt" />
                        <span style={{ marginLeft: '0.7rem' }}>Edit</span>
                      </Button>
                      <Button
                        transparent
                        style={{ marginLeft: '0.5rem' }}
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
                      dangerouslySetInnerHTML={{ __html: defaultMessage }}
                    />
                  )}
              </div>
            </div>
            <BasicInfos
              style={{
                marginTop:
                  userId === profile.id
                    ? greeting.length > 50
                      ? 0
                      : '-7rem'
                    : '-4rem',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
                width: 'CALC(50% - 1rem)',
                fontSize: '1.7rem',
                marginLeft: '1rem',
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
                borderRadius: 0,
                borderRight: 0,
                borderLeft: 0
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
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              {userId === profile.id && (
                <DropDownButton
                  direction="left"
                  opacity={0.7}
                  style={{ right: 0, top: '1rem', position: 'absolute' }}
                  snow
                  menuProps={[
                    {
                      label: 'Edit',
                      onClick: () => this.setState({ bioEditModalShown: true })
                    },
                    {
                      label: 'Remove',
                      onClick: () =>
                        this.uploadBio({
                          firstLine: '',
                          secondLine: '',
                          thirdLine: ''
                        })
                    }
                  ]}
                />
              )}
              <Bio
                style={{ fontSize: '1.6rem', marginBottom: '1rem' }}
                firstRow={profileFirstRow}
                secondRow={profileSecondRow}
                thirdRow={profileThirdRow}
              />
            </div>
          )}
          {!bioExists && profile.id === userId && (
            <div
              style={{
                width: '100%',
                justifyContent: 'center',
                display: 'flex',
                marginTop: '1rem'
              }}
            >
              <Button
                style={{ fontSize: '2rem' }}
                transparent
                onClick={() => this.setState({ bioEditModalShown: true })}
              >
                Add a Bio
              </Button>
            </div>
          )}
        </SectionPanel>
        <Achievements
          profile={profile}
          myId={userId}
          selectedTheme={selectedTheme}
        />
        {confirmModalShown && (
          <ConfirmModal
            onConfirm={this.onRemoveStatus}
            onHide={() => this.setState({ confirmModalShown: false })}
            title={`Remove Status Message`}
          />
        )}
        <SectionPanel
          inverted
          loaded
          headerTheme={profileThemes[selectedTheme]}
          title="Message Board"
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
            userId={userId}
          />
        </SectionPanel>
        {bioEditModalShown && (
          <BioEditModal
            firstLine={profileFirstRow}
            secondLine={profileSecondRow}
            thirdLine={profileThirdRow}
            onSubmit={this.uploadBio}
            onHide={() =>
              this.setState({
                bioEditModalShown: false
              })
            }
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

  onEditGreeting = async greeting => {
    const { dispatch, setGreeting } = this.props;
    await uploadGreeting({ greeting, dispatch });
    setGreeting(greeting);
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

  uploadBio = async params => {
    const { profile, uploadBio } = this.props;
    await uploadBio({ ...params, profileId: profile.id });
    this.setState({
      bioEditModalShown: false
    });
  };
}

export default connect(
  state => ({ userId: state.UserReducer.userId }),
  dispatch => ({
    dispatch,
    uploadBio: params => dispatch(uploadBio(params)),
    removeStatusMsg: userId => dispatch(removeStatusMsg(userId)),
    setGreeting: greeting => dispatch(setGreeting(greeting)),
    updateStatusMsg: data => dispatch(updateStatusMsg(data))
  })
)(Home);
