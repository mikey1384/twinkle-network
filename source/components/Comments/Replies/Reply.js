import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import withContext from 'components/Wrappers/withContext';
import Context from '../Context';
import { timeSince } from 'helpers/timeStampHelpers';
import DropdownButton from 'components/Buttons/DropdownButton';
import EditTextArea from 'components/Texts/EditTextArea';
import Likers from 'components/Likers';
import UserListModal from 'components/Modals/UserListModal';
import UsernameText from 'components/Texts/UsernameText';
import ProfilePic from 'components/ProfilePic';
import Button from 'components/Button';
import LikeButton from 'components/Buttons/LikeButton';
import ReplyInputArea from './ReplyInputArea';
import { determineXpButtonDisabled } from 'helpers';
import ConfirmModal from 'components/Modals/ConfirmModal';
import LongText from 'components/Texts/LongText';
import { commentContainer } from '../Styles';
import RewardStatus from 'components/RewardStatus';
import XPRewardInterface from 'components/XPRewardInterface';
import Icon from 'components/Icon';
import { Link } from 'react-router-dom';
import { editContent, loadReplies } from 'helpers/requestHelpers';
import { connect } from 'react-redux';

class Reply extends Component {
  static propTypes = {
    authLevel: PropTypes.number,
    canDelete: PropTypes.bool,
    canEdit: PropTypes.bool,
    canStar: PropTypes.bool,
    comment: PropTypes.shape({
      id: PropTypes.number.isRequired
    }),
    discussion: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    innerRef: PropTypes.func,
    onAttachStar: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEditDone: PropTypes.func.isRequired,
    onRewardCommentEdit: PropTypes.func.isRequired,
    onLikeClick: PropTypes.func.isRequired,
    onLoadRepliesOfReply: PropTypes.func,
    onReply: PropTypes.func.isRequired,
    parent: PropTypes.object.isRequired,
    reply: PropTypes.shape({
      content: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      likes: PropTypes.array,
      originType: PropTypes.string,
      profilePicId: PropTypes.number,
      targetUserId: PropTypes.number,
      targetUserName: PropTypes.string,
      timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      uploader: PropTypes.object.isRequired
    }),
    userId: PropTypes.number
  };

  state = {
    onEdit: false,
    userListModalShown: false,
    confirmModalShown: false,
    xpRewardInterfaceShown: false,
    replyButtonClicked: false
  };

  render() {
    const {
      comment,
      authLevel,
      canDelete,
      canEdit,
      canStar,
      discussion,
      innerRef = () => {},
      onAttachStar,
      onDelete,
      onRewardCommentEdit,
      onReply,
      parent,
      reply,
      reply: { likes = [], stars = [], uploader },
      userId
    } = this.props;
    const {
      onEdit,
      userListModalShown,
      confirmModalShown,
      clickListenerState,
      replyButtonClicked,
      xpRewardInterfaceShown
    } = this.state;
    const userIsUploader = userId === uploader.id;
    const userCanEditThis =
      (canEdit || canDelete) && authLevel > uploader.authLevel;
    const editButtonShown = userIsUploader || userCanEditThis;
    const editMenuItems = [];
    if (userIsUploader || canEdit) {
      editMenuItems.push({
        label: 'Edit',
        onClick: () => this.setState({ onEdit: true })
      });
    }
    if (userIsUploader || canDelete) {
      editMenuItems.push({
        label: 'Remove',
        onClick: () => this.setState({ confirmModalShown: true })
      });
    }
    let userLikedThis = false;
    for (let i = 0; i < likes.length; i++) {
      if (likes[i].id === userId) userLikedThis = true;
    }
    return (
      <div className={commentContainer} ref={innerRef}>
        <div className="content-wrapper">
          <aside>
            <ProfilePic
              style={{ height: '5rem', width: '5rem' }}
              userId={uploader.id}
              profilePicId={uploader.profilePicId}
            />
          </aside>
          {editButtonShown && !onEdit && (
            <div className="dropdown-wrapper">
              <DropdownButton
                snow
                direction="left"
                opacity={0.8}
                menuProps={[
                  {
                    label: 'Edit',
                    onClick: () => this.setState({ onEdit: true })
                  },
                  {
                    label: 'Remove',
                    onClick: () => this.setState({ confirmModalShown: true })
                  }
                ]}
              />
            </div>
          )}
          <section>
            <div>
              <UsernameText className="username" user={uploader} />{' '}
              <small className="timestamp">
                <Link to={`/comments/${reply.id}`}>
                  replied {timeSince(reply.timeStamp)}
                </Link>
              </small>
            </div>
            <div>
              {((reply.targetObj || {}).comment || {}).uploader &&
                !!reply.replyId &&
                reply.replyId !== comment.id && (
                  <ErrorBoundary>
                    <span className="to">
                      to:{' '}
                      <UsernameText user={reply.targetObj.comment.uploader} />
                    </span>
                  </ErrorBoundary>
                )}
              {onEdit ? (
                <EditTextArea
                  autoFocus
                  text={reply.content}
                  onCancel={() => this.setState({ onEdit: false })}
                  onEditDone={this.onEditDone}
                />
              ) : (
                <div>
                  <LongText className="comment__content">
                    {reply.content}
                  </LongText>
                  <div className="comment__buttons">
                    <LikeButton
                      contentId={reply.id}
                      contentType="comment"
                      onClick={this.onLikeClick}
                      liked={userLikedThis}
                      small
                    />
                    <Button
                      transparent
                      style={{ marginLeft: '1rem' }}
                      onClick={this.onReplyButtonClick}
                    >
                      <Icon icon="comment-alt" />
                      <span style={{ marginLeft: '0.7rem' }}>
                        {reply.numReplies > 1 &&
                        !replyButtonClicked &&
                        parent.type === 'comment'
                          ? 'Replies'
                          : 'Reply'}
                        {reply.numReplies > 0 &&
                        !replyButtonClicked &&
                        parent.type === 'comment'
                          ? ` (${reply.numReplies})`
                          : ''}
                      </span>
                    </Button>
                    {canStar && userCanEditThis && !userIsUploader && (
                      <Button
                        love
                        style={{ marginLeft: '1rem' }}
                        onClick={() =>
                          this.setState({ xpRewardInterfaceShown: true })
                        }
                        disabled={determineXpButtonDisabled({
                          difficulty: this.determineDifficulty({
                            parent,
                            discussion
                          }),
                          myId: userId,
                          xpRewardInterfaceShown,
                          stars
                        })}
                      >
                        <Icon icon="certificate" />
                        <span style={{ marginLeft: '0.7rem' }}>
                          {determineXpButtonDisabled({
                            difficulty: this.determineDifficulty({
                              parent,
                              discussion
                            }),
                            myId: userId,
                            xpRewardInterfaceShown,
                            stars
                          }) || 'Reward'}
                        </span>
                      </Button>
                    )}
                  </div>
                  <small>
                    <Likers
                      className="comment__likes"
                      userId={userId}
                      likes={reply.likes}
                      onLinkClick={() =>
                        this.setState({ userListModalShown: true })
                      }
                    />
                  </small>
                </div>
              )}
            </div>
            {xpRewardInterfaceShown && (
              <XPRewardInterface
                difficulty={this.determineDifficulty({ parent, discussion })}
                stars={stars}
                contentType="comment"
                contentId={reply.id}
                uploaderId={uploader.id}
                onRewardSubmit={data => {
                  this.setState({ xpRewardInterfaceShown: false });
                  onAttachStar(data);
                }}
              />
            )}
            <RewardStatus
              noMarginForEditButton
              difficulty={this.determineDifficulty({ parent, discussion })}
              onCommentEdit={onRewardCommentEdit}
              style={{
                fontSize: '1.5rem',
                marginTop: reply.likes.length > 0 ? '0.5rem' : '1rem'
              }}
              stars={stars}
              uploaderName={uploader.username}
            />
            <ReplyInputArea
              innerRef={ref => {
                this.ReplyInputArea = ref;
              }}
              style={{
                marginTop:
                  stars.length > 0 || reply.likes.length > 0 ? '0.5rem' : '1rem'
              }}
              onSubmit={onReply}
              clickListenerState={clickListenerState}
              rootCommentId={reply.commentId}
              targetCommentId={reply.id}
            />
          </section>
        </div>
        {userListModalShown && (
          <UserListModal
            onHide={() => this.setState({ userListModalShown: false })}
            title="People who liked this reply"
            users={reply.likes}
            description="(You)"
          />
        )}
        {confirmModalShown && (
          <ConfirmModal
            onHide={() => this.setState({ confirmModalShown: false })}
            title="Remove Reply"
            onConfirm={() => onDelete(reply.id)}
          />
        )}
      </div>
    );
  }

  determineDifficulty = ({ parent, discussion }) => {
    const rootDifficulty =
      (parent.type !== 'video' ? parent.difficulty : 0) ||
      (parent.rootType !== 'video' ? parent.rootObj?.difficulty : 0);
    return (
      rootDifficulty ||
      discussion?.difficulty ||
      ((parent.type === 'video' && parent.difficulty > 0) ||
      (parent.rootType === 'video' && parent.rootObj?.difficulty > 0)
        ? 1
        : 0)
    );
  };

  onEditDone = async editedReply => {
    const { dispatch, onEditDone, reply } = this.props;
    await editContent({
      params: {
        editedComment: editedReply,
        contentId: reply.id,
        type: 'comment'
      },
      dispatch
    });
    onEditDone({ editedComment: editedReply, commentId: reply.id });
    this.setState({ onEdit: false });
  };

  onLikeClick = likes => {
    const { reply, onLikeClick } = this.props;
    onLikeClick({ commentId: reply.id, likes });
  };

  onReplyButtonClick = async() => {
    const {
      parent,
      reply: { commentId, id, numReplies }
    } = this.props;
    const { replyButtonClicked } = this.state;
    const { onLoadRepliesOfReply } = this.props;
    this.setState({ replyButtonClicked: true });
    this.ReplyInputArea.focus();
    if (
      numReplies.length > 0 &&
      !replyButtonClicked &&
      parent.type === 'comment'
    ) {
      const { replies } = await loadReplies({
        commentId: id
      });
      if (replies.length > 0) {
        onLoadRepliesOfReply({ replies, commentId, replyId: id });
      }
    }
  };
}

export default connect(
  state => ({
    authLevel: state.UserReducer.authLevel,
    canDelete: state.UserReducer.canDelete,
    canEdit: state.UserReducer.canEdit,
    canStar: state.UserReducer.canStar
  }),
  dispatch => ({ dispatch })
)(withContext({ Component: Reply, Context }));
