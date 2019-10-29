import PropTypes from 'prop-types';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import LocalContext from '../Context';
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
import { Link } from 'react-router-dom';
import { determineXpButtonDisabled, scrollElementToCenter } from 'helpers';
import { useContentState, useMyState } from 'helpers/hooks';
import { timeSince } from 'helpers/timeStampHelpers';
import { useAppContext, useContentContext } from 'contexts';

Reply.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.number.isRequired
  }),
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
  rootContent: PropTypes.object,
  subject: PropTypes.object,
  submitReply: PropTypes.func.isRequired
};

export default function Reply({
  comment,
  innerRef = () => {},
  deleteReply,
  loadRepliesOfReply,
  parent,
  reply,
  reply: { likes = [], stars = [], uploader },
  rootContent,
  submitReply,
  subject
}) {
  const {
    requestHelpers: { editContent, loadReplies }
  } = useAppContext();
  const { authLevel, canDelete, canEdit, canStar, userId } = useMyState();
  const {
    actions: { onSetIsEditing, onSetXpRewardInterfaceShown }
  } = useContentContext();
  const { deleted, isEditing, xpRewardInterfaceShown } = useContentState({
    contentType: 'comment',
    contentId: reply.id
  });
  const {
    onAttachStar,
    onEditDone,
    onLikeClick,
    onRewardCommentEdit
  } = useContext(LocalContext);
  const [userListModalShown, setUserListModalShown] = useState(false);
  const [confirmModalShown, setConfirmModalShown] = useState(false);
  const ReplyInputAreaRef = useRef(null);
  const RewardInterfaceRef = useRef(null);
  const userIsUploader = userId === uploader.id;
  const userIsHigherAuth = authLevel > uploader.authLevel;
  const userCanEditThis = (canEdit || canDelete) && userIsHigherAuth;
  const editButtonShown = userIsUploader || userCanEditThis;
  const editMenuItems = [];
  useEffect(() => {
    onSetXpRewardInterfaceShown({
      contentType: 'comment',
      contentId: reply.id,
      shown:
        xpRewardInterfaceShown && userIsHigherAuth && canStar && !userIsUploader
    });
  }, [userId]);
  if (userIsUploader || canEdit) {
    editMenuItems.push({
      label: 'Edit',
      onClick: () =>
        onSetIsEditing({
          contentId: reply.id,
          contentType: 'comment',
          isEditing: true
        })
    });
  }
  if (userIsUploader || canDelete) {
    editMenuItems.push({
      label: 'Remove',
      onClick: () => setConfirmModalShown(true)
    });
  }

  return useMemo(
    () =>
      !deleted ? (
        <ErrorBoundary>
          <div className={commentContainer} ref={innerRef}>
            <div className="content-wrapper">
              <aside>
                <ProfilePic
                  style={{ height: '5rem', width: '5rem' }}
                  userId={uploader.id}
                  profilePicId={uploader.profilePicId}
                />
              </aside>
              {editButtonShown && !isEditing && (
                <div className="dropdown-wrapper">
                  <DropdownButton
                    skeuomorphic
                    color="darkerGray"
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
                          <UsernameText
                            user={reply.targetObj.comment.uploader}
                          />
                        </span>
                      </ErrorBoundary>
                    )}
                  {isEditing ? (
                    <EditTextArea
                      contentId={reply.id}
                      contentType="comment"
                      text={reply.content}
                      onCancel={() =>
                        onSetIsEditing({
                          contentId: reply.id,
                          contentType: 'comment',
                          isEditing: false
                        })
                      }
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
                          likes={likes}
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
                            parent.contentType === 'comment'
                              ? 'Replies'
                              : 'Reply'}
                            {reply.numReplies > 0 &&
                            parent.contentType === 'comment'
                              ? ` (${reply.numReplies})`
                              : ''}
                          </span>
                        </Button>
                        {canStar && userIsHigherAuth && !userIsUploader && (
                          <Button
                            color="pink"
                            style={{ marginLeft: '1rem' }}
                            onClick={handleSetXpRewardInterfaceShown}
                            disabled={determineXpButtonDisabled({
                              rewardLevel: determineRewardLevel({
                                parent,
                                subject,
                                rootContent
                              }),
                              myId: userId,
                              xpRewardInterfaceShown,
                              stars
                            })}
                          >
                            <Icon icon="certificate" />
                            <span style={{ marginLeft: '0.7rem' }}>
                              {determineXpButtonDisabled({
                                rewardLevel: determineRewardLevel({
                                  parent,
                                  subject,
                                  rootContent
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
                    innerRef={RewardInterfaceRef}
                    rewardLevel={determineRewardLevel({
                      parent,
                      subject,
                      rootContent
                    })}
                    stars={stars}
                    contentType="comment"
                    contentId={reply.id}
                    uploaderId={uploader.id}
                    onRewardSubmit={data => {
                      onSetXpRewardInterfaceShown({
                        contentId: reply.id,
                        contentType: 'comment',
                        shown: false
                      });
                      onAttachStar({
                        data,
                        contentId: reply.id,
                        contentType: 'comment'
                      });
                    }}
                  />
                )}
                <RewardStatus
                  noMarginForEditButton
                  rewardLevel={determineRewardLevel({
                    parent,
                    subject,
                    rootContent
                  })}
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
                  onSubmit={submitReply}
                  parent={parent}
                  rootCommentId={reply.commentId}
                  style={{
                    marginTop:
                      stars.length > 0 || reply.likes.length > 0
                        ? '0.5rem'
                        : '1rem'
                  }}
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
      ) : null,
    [
      comment.id,
      deleted,
      isEditing,
      reply,
      subject,
      userId,
      userListModalShown,
      confirmModalShown,
      xpRewardInterfaceShown,
      editMenuItems,
      editButtonShown
    ]
  );

  function determineRewardLevel({ parent, subject, rootContent }) {
    if (parent.contentType === 'subject' && parent.rewardLevel > 0) {
      return parent.rewardLevel;
    }
    if (parent.rootType === 'subject' && rootContent.rewardLevel > 0) {
      return rootContent.rewardLevel;
    }
    if (parent.contentType === 'video' || parent.contentType === 'url') {
      if (subject?.rewardLevel) {
        return subject?.rewardLevel;
      }
      if (parent.rewardLevel > 0) {
        return 1;
      }
    }
    if (parent.rootType === 'video' || parent.rootType === 'url') {
      if (subject?.rewardLevel) {
        return subject?.rewardLevel;
      }
      if (rootContent?.rewardLevel > 0) {
        return 1;
      }
    }
    return 0;
  }

  async function editDone(editedReply) {
    await editContent({
      editedComment: editedReply,
      contentId: reply.id,
      contentType: 'comment'
    });
    onEditDone({ editedComment: editedReply, commentId: reply.id });
    onSetIsEditing({
      contentId: reply.id,
      contentType: 'comment',
      isEditing: false
    });
  }

  function handleSetXpRewardInterfaceShown() {
    onSetXpRewardInterfaceShown({
      contentId: reply.id,
      contentType: 'comment',
      shown: true
    });
    setTimeout(() => scrollElementToCenter(RewardInterfaceRef.current), 0);
  }

  function likeClick(likes) {
    onLikeClick({ commentId: reply.id, likes });
  }

  async function replyButtonClick() {
    ReplyInputAreaRef.current.focus();
    if (reply.numReplies > 0 && parent.contentType === 'comment') {
      const { replies } = await loadReplies({
        commentId: reply.id
      });
      if (replies.length > 0) {
        loadRepliesOfReply({
          replies,
          commentId: reply.commentId,
          replyId: reply.id,
          contentId: parent.contentId,
          contentType: parent.contentType
        });
      }
    }
  }
}
