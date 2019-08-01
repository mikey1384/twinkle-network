import PropTypes from 'prop-types';
import React, { useContext, useRef, useState } from 'react';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import Context from '../Context';
import DropdownButton from 'components/Buttons/DropdownButton';
import EditTextArea from 'components/Texts/EditTextArea';
import Icon from 'components/Icon';
import Likers from 'components/Likers';
import UserListModal from 'components/Modals/UserListModal';
import UsernameText from 'components/Texts/UsernameText';
import ProfilePic from 'components/ProfilePic';
import Button from 'components/Button';
import LikeButton from 'components/Buttons/LikeButton';
import ReplyInputArea from './ReplyInputArea';
import ConfirmModal from 'components/Modals/ConfirmModal';
import LongText from 'components/Texts/LongText';
import RewardStatus from 'components/RewardStatus';
import XPRewardInterface from 'components/XPRewardInterface';
import { commentContainer } from '../Styles';
import { connect } from 'react-redux';
import { determineXpButtonDisabled } from 'helpers';
import { editContent, loadReplies } from 'helpers/requestHelpers';
import { Link } from 'react-router-dom';
import { timeSince } from 'helpers/timeStampHelpers';

Reply.propTypes = {
  authLevel: PropTypes.number,
  canDelete: PropTypes.bool,
  canEdit: PropTypes.bool,
  canStar: PropTypes.bool,
  comment: PropTypes.shape({
    id: PropTypes.number.isRequired
  }),
  subject: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  innerRef: PropTypes.func,
  deleteReply: PropTypes.func.isRequired,
  loadRepliesOfReply: PropTypes.func,
  parent: PropTypes.object.isRequired,
  reply: PropTypes.shape({
    commentId: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    likes: PropTypes.array,
    numReplies: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    originType: PropTypes.string,
    profilePicId: PropTypes.number,
    replyId: PropTypes.number,
    stars: PropTypes.array,
    targetObj: PropTypes.object,
    targetUserId: PropTypes.number,
    targetUserName: PropTypes.string,
    timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    uploader: PropTypes.object.isRequired
  }),
  submitReply: PropTypes.func.isRequired,
  userId: PropTypes.number
};

function Reply({
  comment,
  authLevel,
  canDelete,
  canEdit,
  canStar,
  dispatch,
  innerRef = () => {},
  deleteReply,
  loadRepliesOfReply,
  parent,
  reply,
  reply: { commentId, id, numReplies, likes = [], stars = [], uploader },
  submitReply,
  subject,
  userId
}) {
  const {
    onAttachStar,
    onEditDone,
    onLikeClick,
    onRewardCommentEdit
  } = useContext(Context);
  const [onEdit, setOnEdit] = useState(false);
  const [userListModalShown, setUserListModalShown] = useState(false);
  const [confirmModalShown, setConfirmModalShown] = useState(false);
  const [xpRewardInterfaceShown, setXpRewardInterfaceShown] = useState(false);
  const [replyButtonClicked, setReplyButtonClicked] = useState(false);
  const ReplyInputAreaRef = useRef(null);

  const userIsUploader = userId === uploader.id;
  const userIsHigherAuth = authLevel > uploader.authLevel;
  const userCanEditThis = (canEdit || canDelete) && userIsHigherAuth;
  const editButtonShown = userIsUploader || userCanEditThis;
  const editMenuItems = [];

  if (userIsUploader || canEdit) {
    editMenuItems.push({
      label: 'Edit',
      onClick: () => setOnEdit(true)
    });
  }
  if (userIsUploader || canDelete) {
    editMenuItems.push({
      label: 'Remove',
      onClick: () => setConfirmModalShown(true)
    });
  }
  let userLikedThis = false;
  for (let i = 0; i < likes.length; i++) {
    if (likes[i].id === userId) userLikedThis = true;
  }

  return (
    <ErrorBoundary>
      <div className={commentContainer} ref={ref => innerRef(ref)}>
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
                skeuomorphic
                color="darkerGray"
                direction="left"
                opacity={0.8}
                menuProps={[
                  {
                    label: 'Edit',
                    onClick: () => setOnEdit(true)
                  },
                  {
                    label: 'Remove',
                    onClick: () => setConfirmModalShown(true)
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
              {reply.targetObj?.comment?.uploader &&
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
                  onCancel={() => setOnEdit(false)}
                  onEditDone={editDone}
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
                      onClick={likeClick}
                      liked={userLikedThis}
                      small
                    />
                    <Button
                      transparent
                      style={{ marginLeft: '1rem' }}
                      onClick={replyButtonClick}
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
                    {canStar && userIsHigherAuth && !userIsUploader && (
                      <Button
                        color="pink"
                        style={{ marginLeft: '1rem' }}
                        onClick={() => setXpRewardInterfaceShown(true)}
                        disabled={determineXpButtonDisabled({
                          difficulty: determineDifficulty({
                            parent,
                            subject
                          }),
                          myId: userId,
                          xpRewardInterfaceShown,
                          stars
                        })}
                      >
                        <Icon icon="certificate" />
                        <span style={{ marginLeft: '0.7rem' }}>
                          {determineXpButtonDisabled({
                            difficulty: determineDifficulty({
                              parent,
                              subject
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
                      onLinkClick={() => setUserListModalShown(true)}
                    />
                  </small>
                </div>
              )}
            </div>
            {xpRewardInterfaceShown && (
              <XPRewardInterface
                difficulty={determineDifficulty({ parent, subject })}
                stars={stars}
                contentType="comment"
                contentId={reply.id}
                uploaderId={uploader.id}
                onRewardSubmit={data => {
                  setXpRewardInterfaceShown(false);
                  onAttachStar(data);
                }}
              />
            )}
            <RewardStatus
              noMarginForEditButton
              difficulty={determineDifficulty({ parent, subject })}
              onCommentEdit={onRewardCommentEdit}
              style={{
                fontSize: '1.5rem',
                marginTop: reply.likes.length > 0 ? '0.5rem' : '1rem'
              }}
              stars={stars}
              uploaderName={uploader.username}
            />
            <ReplyInputArea
              innerRef={ReplyInputAreaRef}
              style={{
                marginTop:
                  stars.length > 0 || reply.likes.length > 0 ? '0.5rem' : '1rem'
              }}
              onSubmit={submitReply}
              rootCommentId={reply.commentId}
              targetCommentId={reply.id}
            />
          </section>
        </div>
        {userListModalShown && (
          <UserListModal
            onHide={() => setUserListModalShown(false)}
            title="People who liked this reply"
            users={reply.likes}
            description="(You)"
          />
        )}
        {confirmModalShown && (
          <ConfirmModal
            onHide={() => setConfirmModalShown(false)}
            title="Remove Reply"
            onConfirm={() => deleteReply(reply.id)}
          />
        )}
      </div>
    </ErrorBoundary>
  );

  function determineDifficulty({ parent, subject }) {
    if (parent.type === 'subject' && parent.difficulty > 0) {
      return parent.difficulty;
    }
    if (parent.rootType === 'subject' && parent.rootObj?.difficulty > 0) {
      return parent.rootObj.difficulty;
    }
    if (parent.type === 'video' || parent.type === 'url') {
      if (subject?.difficulty) {
        return subject?.difficulty;
      }
      if (parent.difficulty > 0) {
        return 1;
      }
    }
    if (parent.rootType === 'video' || parent.rootType === 'url') {
      if (subject?.difficulty) {
        return subject?.difficulty;
      }
      if (parent.rootObj?.difficulty > 0) {
        return 1;
      }
    }
    return 0;
  }

  async function editDone(editedReply) {
    await editContent({
      params: {
        editedComment: editedReply,
        contentId: reply.id,
        type: 'comment'
      },
      dispatch
    });
    onEditDone({ editedComment: editedReply, commentId: reply.id });
    setOnEdit(false);
  }

  function likeClick(likes) {
    onLikeClick({ commentId: reply.id, likes });
  }

  async function replyButtonClick() {
    setReplyButtonClicked(true);
    ReplyInputAreaRef.current.focus();
    if (numReplies > 0 && !replyButtonClicked && parent.type === 'comment') {
      const { replies } = await loadReplies({
        commentId: id
      });
      if (replies.length > 0) {
        loadRepliesOfReply({ replies, commentId, replyId: id });
      }
    }
  }
}

export default connect(
  state => ({
    authLevel: state.UserReducer.authLevel,
    canDelete: state.UserReducer.canDelete,
    canEdit: state.UserReducer.canEdit,
    canStar: state.UserReducer.canStar
  }),
  dispatch => ({ dispatch })
)(Reply);
