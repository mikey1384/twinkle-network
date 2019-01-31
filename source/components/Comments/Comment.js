import PropTypes from 'prop-types';
import React, { Component } from 'react';
import withContext from 'components/Wrappers/withContext';
import Context from './Context';
import { timeSince } from 'helpers/timeStampHelpers';
import DropdownButton from 'components/Buttons/DropdownButton';
import Likers from 'components/Likers';
import UserListModal from 'components/Modals/UserListModal';
import Replies from './Replies';
import ReplyInputArea from './Replies/ReplyInputArea';
import EditTextArea from 'components/Texts/EditTextArea';
import UsernameText from 'components/Texts/UsernameText';
import ProfilePic from 'components/ProfilePic';
import Button from 'components/Button';
import LikeButton from 'components/Buttons/LikeButton';
import { determineXpButtonDisabled, scrollElementToCenter } from 'helpers';
import ConfirmModal from 'components/Modals/ConfirmModal';
import LongText from 'components/Texts/LongText';
import { commentContainer } from './Styles';
import RewardStatus from 'components/RewardStatus';
import XPRewardInterface from 'components/XPRewardInterface';
import { Link } from 'react-router-dom';
import { editContent } from 'helpers/requestHelpers';
import { connect } from 'react-redux';
import SubjectLink from './SubjectLink';
import Icon from 'components/Icon';

class Comment extends Component {
  static propTypes = {
    onAttachStar: PropTypes.func.isRequired,
    authLevel: PropTypes.number,
    canDelete: PropTypes.bool,
    canEdit: PropTypes.bool,
    canStar: PropTypes.bool,
    comment: PropTypes.shape({
      content: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      likes: PropTypes.array.isRequired,
      profilePicId: PropTypes.number,
      replies: PropTypes.array,
      replyId: PropTypes.number,
      stars: PropTypes.array,
      targetObj: PropTypes.object,
      targetUserName: PropTypes.string,
      targetUserId: PropTypes.number,
      timeStamp: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      uploader: PropTypes.object.isRequired
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
    innerRef: PropTypes.func,
    isPreview: PropTypes.bool,
    onEditDone: PropTypes.func.isRequired,
    onLoadMoreReplies: PropTypes.func.isRequired,
    onLikeClick: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onRewardCommentEdit: PropTypes.func.isRequired,
    onReplySubmit: PropTypes.func.isRequired,
    parent: PropTypes.object,
    userId: PropTypes.number
  };

  Replies = {};

  state = {
    onEdit: false,
    replying: false,
    userListModalShown: false,
    confirmModalShown: false,
    xpRewardInterfaceShown: false
  };

  componentDidUpdate(prevProps) {
    const {
      comment: { replies = [] }
    } = this.props;
    const { replying } = this.state;
    if (
      replying &&
      prevProps.comment.replies &&
      replies.length > prevProps.comment.replies.length
    ) {
      this.setState({ replying: false });
      scrollElementToCenter(this.Replies[replies[replies.length - 1].id]);
    }
  }

  render() {
    const {
      onEdit,
      userListModalShown,
      confirmModalShown,
      xpRewardInterfaceShown
    } = this.state;
    const {
      authLevel,
      canDelete,
      canEdit,
      canStar,
      comment,
      comment: {
        replies = [],
        targetObj = {},
        likes = [],
        stars = [],
        uploader
      },
      innerRef,
      isPreview,
      onAttachStar,
      onLoadMoreReplies,
      onDelete,
      onRewardCommentEdit,
      userId,
      parent
    } = this.props;
    const userIsUploader = uploader.id === userId;
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
      <div
        style={isPreview ? { cursor: 'pointer' } : {}}
        className={commentContainer}
        ref={ref => {
          this.Comment = ref;
          innerRef(ref);
        }}
      >
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
                menuProps={editMenuItems}
              />
            </div>
          )}
          <section>
            <div>
              <UsernameText className="username" user={uploader} />{' '}
              <small className="timestamp">
                <Link to={`/comments/${comment.id}`}>
                  {parent.type === 'user' ? 'messag' : 'comment'}
                  ed {timeSince(comment.timeStamp)}
                </Link>
              </small>
            </div>
            <div>
              {comment.targetUserId &&
                !!comment.replyId &&
                comment.replyId !== parent.id && (
                  <span className="to">
                    to:{' '}
                    <UsernameText
                      user={{
                        username: comment.targetUserName,
                        id: comment.targetUserId
                      }}
                    />
                  </span>
                )}
              {onEdit ? (
                <EditTextArea
                  autoFocus
                  text={comment.content}
                  onCancel={() => this.setState({ onEdit: false })}
                  onEditDone={this.onEditDone}
                />
              ) : (
                <div>
                  {parent.type !== 'subject' &&
                    !parent.subjectId &&
                    targetObj &&
                    targetObj.subject && (
                      <SubjectLink subject={targetObj.subject} />
                    )}
                  <LongText className="comment__content">
                    {comment.content}
                  </LongText>
                  {!isPreview && (
                    <>
                      <div className="comment__buttons">
                        <LikeButton
                          contentType="comment"
                          contentId={comment.id}
                          onClick={this.onLikeClick}
                          liked={userLikedThis}
                        />
                        <Button
                          transparent
                          style={{ marginLeft: '1rem' }}
                          onClick={this.onReplyButtonClick}
                        >
                          <Icon icon="comment-alt" />
                          <span style={{ marginLeft: '1rem' }}>Reply</span>
                        </Button>
                        {canStar && userCanEditThis && !userIsUploader && (
                          <Button
                            love
                            style={{ marginLeft: '0.7rem' }}
                            onClick={() =>
                              this.setState({ xpRewardInterfaceShown: true })
                            }
                            disabled={determineXpButtonDisabled({
                              difficulty: this.determineDifficulty({
                                parent,
                                targetObj
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
                                  targetObj
                                }),
                                myId: userId,
                                xpRewardInterfaceShown,
                                stars
                              }) || 'Reward'}
                            </span>
                          </Button>
                        )}
                      </div>
                      <Likers
                        className="comment__likes"
                        userId={userId}
                        likes={comment.likes}
                        onLinkClick={() =>
                          this.setState({ userListModalShown: true })
                        }
                      />
                    </>
                  )}
                </div>
              )}
            </div>
            {xpRewardInterfaceShown && (
              <XPRewardInterface
                difficulty={this.determineDifficulty({ parent, targetObj })}
                stars={stars}
                contentType="comment"
                contentId={comment.id}
                uploaderId={uploader.id}
                onRewardSubmit={data => {
                  this.setState({ xpRewardInterfaceShown: false });
                  onAttachStar(data);
                }}
              />
            )}
            {!isPreview && (
              <RewardStatus
                difficulty={this.determineDifficulty({ parent, targetObj })}
                noMarginForEditButton
                onCommentEdit={onRewardCommentEdit}
                style={{
                  fontSize: '1.5rem',
                  marginTop: comment.likes.length > 0 ? '0.5rem' : '1rem'
                }}
                stars={stars}
                uploaderName={uploader.username}
              />
            )}
            {!isPreview && (
              <>
                <ReplyInputArea
                  innerRef={ref => (this.ReplyInputArea = ref)}
                  style={{
                    marginTop:
                      stars.length > 0 || comment.likes.length > 0
                        ? '0.5rem'
                        : '1rem'
                  }}
                  onSubmit={this.onReplySubmit}
                  numReplies={replies.length}
                  rootCommentId={comment.commentId}
                  targetCommentId={comment.id}
                />
                <Replies
                  subject={targetObj.subject || {}}
                  innerRef={({ ref, replyId }) => (this.Replies[replyId] = ref)}
                  Replies={this.Replies}
                  userId={userId}
                  replies={replies}
                  comment={comment}
                  parent={parent}
                  onLoadMoreReplies={onLoadMoreReplies}
                  onReplySubmit={this.onReplySubmit}
                />
              </>
            )}
          </section>
        </div>
        {userListModalShown && (
          <UserListModal
            onHide={() => this.setState({ userListModalShown: false })}
            title="People who liked this comment"
            users={comment.likes}
            description="(You)"
          />
        )}
        {confirmModalShown && (
          <ConfirmModal
            onHide={() => this.setState({ confirmModalShown: false })}
            title="Remove Comment"
            onConfirm={() => onDelete(comment.id)}
          />
        )}
      </div>
    );
  }

  determineDifficulty = ({ parent, targetObj }) => {
    const rootDifficulty =
      (parent.type !== 'video' ? parent.difficulty : 0) ||
      (parent.rootType !== 'video' ? parent.rootObj?.difficulty : 0);
    return (
      rootDifficulty ||
      targetObj.subject?.difficulty ||
      ((parent.type === 'video' && parent.difficulty > 0) ||
      (parent.rootType === 'video' && parent.rootObj?.difficulty > 0)
        ? 1
        : 0)
    );
  };

  onEditDone = async editedComment => {
    const { dispatch, comment, onEditDone } = this.props;
    await editContent({
      params: { editedComment, contentId: comment.id, type: 'comment' },
      dispatch
    });
    onEditDone({ editedComment, commentId: comment.id });
    this.setState({ onEdit: false });
  };

  onLikeClick = likes => {
    const { comment, onLikeClick } = this.props;
    onLikeClick({ commentId: comment.id, likes });
  };

  onReplyButtonClick = () => {
    this.ReplyInputArea.focus();
  };

  onReplySubmit = async reply => {
    const { onReplySubmit } = this.props;
    this.setState({ replying: true });
    await onReplySubmit(reply);
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
)(withContext({ Component: Comment, Context }));
