import PropTypes from 'prop-types';
import React, {
  memo,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
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
import ConfirmModal from 'components/Modals/ConfirmModal';
import LongText from 'components/Texts/LongText';
import RewardStatus from 'components/RewardStatus';
import HiddenComment from 'components/HiddenComment';
import XPRewardInterface from 'components/XPRewardInterface';
import SubjectLink from './SubjectLink';
import Icon from 'components/Icon';
import { Link } from 'react-router-dom';
import { commentContainer } from './Styles';
import { withRouter } from 'react-router';
import { timeSince } from 'helpers/timeStampHelpers';
import { useContentState, useMyState } from 'helpers/hooks';
import { determineXpButtonDisabled, scrollElementToCenter } from 'helpers';
import { useAppContext, useContentContext } from 'contexts';
import LocalContext from './Context';

Comment.propTypes = {
  comment: PropTypes.shape({
    commentId: PropTypes.number,
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
  history: PropTypes.object.isRequired,
  innerRef: PropTypes.func,
  isPreview: PropTypes.bool,
  parent: PropTypes.object
};

function Comment({
  comment,
  history,
  innerRef,
  isPreview,
  parent,
  comment: { replies = [], targetObj = {}, likes = [], stars = [], uploader }
}) {
  const {
    requestHelpers: { checkIfUserResponded, editContent }
  } = useAppContext();
  const { authLevel, canDelete, canEdit, canStar, userId } = useMyState();
  const {
    actions: {
      onChangeSpoilerStatus,
      onSetIsEditing,
      onSetXpRewardInterfaceShown
    }
  } = useContentContext();
  const { deleted, isEditing, xpRewardInterfaceShown } = useContentState({
    contentType: 'comment',
    contentId: comment.id
  });
  const subjectState = useContentState({
    contentType: 'subject',
    contentId: targetObj?.subject?.id
  });
  const {
    onAttachStar,
    onDelete,
    onEditDone,
    onLikeClick,
    onLoadMoreReplies,
    onReplySubmit,
    onRewardCommentEdit
  } = useContext(LocalContext);
  const [userListModalShown, setUserListModalShown] = useState(false);
  const [confirmModalShown, setConfirmModalShown] = useState(false);
  const [prevReplies, setPrevReplies] = useState(replies);
  const [replying, setReplying] = useState(false);
  const [rewardLevel, setRewardLevel] = useState(
    determineRewardLevel({ parent, targetObj })
  );
  const ReplyInputAreaRef = useRef(null);
  const ReplyRefs = {};
  const mounted = useRef(true);

  useEffect(() => {
    if (replying && replies.length > prevReplies.length) {
      setReplying(false);
      scrollElementToCenter(ReplyRefs[replies[replies.length - 1].id]);
    }
    setPrevReplies(replies);
  }, [replies]);

  useEffect(() => {
    setRewardLevel(determineRewardLevel({ parent, targetObj }));
  }, [parent, targetObj]);

  const userIsUploader = uploader.id === userId;
  const userIsHigherAuth = authLevel > uploader.authLevel;
  const userCanEditThis = (canEdit || canDelete) && userIsHigherAuth;
  const editButtonShown = userIsUploader || userCanEditThis;
  const editMenuItems = [];
  if (userIsUploader || canEdit) {
    editMenuItems.push({
      label: 'Edit',
      onClick: () =>
        onSetIsEditing({
          contentId: comment.id,
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
  useEffect(() => {
    onSetXpRewardInterfaceShown({
      contentType: 'comment',
      contentId: comment.id,
      shown:
        xpRewardInterfaceShown && userIsHigherAuth && canStar && !userIsUploader
    });
  }, [userId]);

  const isCommentForContentSubject =
    parent.contentType !== 'subject' &&
    !parent.subjectId &&
    targetObj &&
    targetObj.subject;
  const hasSecretAnswer = targetObj?.subject?.secretAnswer;
  const secretShown =
    subjectState.secretShown || targetObj?.subject?.uploader?.id === userId;
  const isHidden = hasSecretAnswer && !secretShown;

  useEffect(() => {
    mounted.current = true;
    if (mounted.current) {
      if (userId && targetObj?.subject && !subjectState.spoilerStatusChecked) {
        checkSecretShown();
      }
      if (!userId) {
        onChangeSpoilerStatus({
          shown: false,
          subjectId: targetObj?.subject?.id,
          checked: false
        });
      }
    }

    async function checkSecretShown() {
      if (hasSecretAnswer && !secretShown) {
        const { responded } = await checkIfUserResponded(
          targetObj?.subject?.id
        );
        if (mounted.current) {
          onChangeSpoilerStatus({
            shown: responded,
            subjectId: targetObj?.subject?.id,
            checked: true
          });
        }
      }
    }

    return function cleanUp() {
      mounted.current = false;
    };
  }, [userId]);

  return useMemo(
    () =>
      !deleted ? (
        <>
          <div
            style={isPreview ? { cursor: 'pointer' } : {}}
            className={commentContainer}
            ref={innerRef}
          >
            <div className="content-wrapper">
              <aside>
                <ProfilePic
                  style={{ height: '5rem', width: '5rem' }}
                  userId={uploader?.id}
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
                    <Link to={`/comments/${comment.id}`}>
                      {parent.contentType === 'user' ? 'messag' : 'comment'}
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
                  {isEditing ? (
                    <EditTextArea
                      contentType="comment"
                      contentId={comment.id}
                      text={comment.content}
                      onCancel={() =>
                        onSetIsEditing({
                          contentId: comment.id,
                          contentType: 'comment',
                          isEditing: false
                        })
                      }
                      onEditDone={handleEditDone}
                    />
                  ) : (
                    <div>
                      {isCommentForContentSubject && (
                        <SubjectLink subject={targetObj.subject} />
                      )}
                      {isHidden ? (
                        <HiddenComment
                          onClick={() =>
                            history.push(`/subjects/${targetObj?.subject?.id}`)
                          }
                        />
                      ) : (
                        <LongText className="comment__content">
                          {comment.content}
                        </LongText>
                      )}
                      {!isPreview && !isHidden && (
                        <>
                          <div className="comment__buttons">
                            <LikeButton
                              contentType="comment"
                              contentId={comment.id}
                              onClick={likeClick}
                              likes={likes}
                            />
                            <Button
                              transparent
                              style={{ marginLeft: '1rem' }}
                              onClick={onReplyButtonClick}
                            >
                              <Icon icon="comment-alt" />
                              <span style={{ marginLeft: '1rem' }}>Reply</span>
                            </Button>
                            {canStar && userIsHigherAuth && !userIsUploader && (
                              <Button
                                color="pink"
                                style={{ marginLeft: '0.7rem' }}
                                onClick={() =>
                                  onSetXpRewardInterfaceShown({
                                    contentId: comment.id,
                                    contentType: 'comment',
                                    shown: true
                                  })
                                }
                                disabled={determineXpButtonDisabled({
                                  rewardLevel: determineRewardLevel({
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
                                    rewardLevel: determineRewardLevel({
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
                            onLinkClick={() => setUserListModalShown(true)}
                          />
                        </>
                      )}
                    </div>
                  )}
                </div>
                {!isPreview && xpRewardInterfaceShown && (
                  <XPRewardInterface
                    rewardLevel={determineRewardLevel({ parent, targetObj })}
                    stars={stars}
                    contentType="comment"
                    contentId={comment.id}
                    uploaderId={uploader.id}
                    onRewardSubmit={data => {
                      onSetXpRewardInterfaceShown({
                        contentId: comment.id,
                        contentType: 'comment',
                        shown: false
                      });
                      onAttachStar({
                        data,
                        contentId: comment.id,
                        contentType: 'comment'
                      });
                    }}
                  />
                )}
                {!isPreview && (
                  <RewardStatus
                    rewardLevel={rewardLevel}
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
                {!isPreview && !isHidden && (
                  <>
                    <ReplyInputArea
                      innerRef={ReplyInputAreaRef}
                      style={{
                        marginTop:
                          stars.length > 0 || comment.likes.length > 0
                            ? '0.5rem'
                            : '1rem'
                      }}
                      onSubmit={submitReply}
                      parent={parent}
                      numReplies={replies.length}
                      rootCommentId={comment.commentId}
                      targetCommentId={comment.id}
                    />
                    <Replies
                      subject={targetObj.subject || {}}
                      userId={userId}
                      replies={replies}
                      comment={comment}
                      parent={parent}
                      onLoadMoreReplies={onLoadMoreReplies}
                      onReplySubmit={onReplySubmit}
                      ReplyRefs={ReplyRefs}
                    />
                  </>
                )}
              </section>
            </div>
            {userListModalShown && (
              <UserListModal
                onHide={() => setUserListModalShown(false)}
                title="People who liked this comment"
                users={comment.likes}
                description="(You)"
              />
            )}
          </div>
          {confirmModalShown && (
            <ConfirmModal
              onHide={() => setConfirmModalShown(false)}
              title="Remove Comment"
              onConfirm={() => onDelete(comment.id)}
            />
          )}
        </>
      ) : null,
    [
      deleted,
      editMenuItems,
      isCommentForContentSubject,
      isEditing,
      isHidden,
      userId,
      userListModalShown,
      confirmModalShown,
      rewardLevel,
      xpRewardInterfaceShown
    ]
  );

  function determineRewardLevel({ parent, targetObj }) {
    if (parent.contentType === 'subject' && parent.rewardLevel > 0) {
      return parent.rewardLevel;
    }
    if (parent.rootType === 'subject' && parent.rootObj?.rewardLevel > 0) {
      return parent.rootObj.rewardLevel;
    }
    if (parent.contentType === 'video' || parent.contentType === 'url') {
      if (targetObj.subject?.rewardLevel) {
        return targetObj.subject?.rewardLevel;
      }
      if (parent.rewardLevel > 0) {
        return 1;
      }
    }
    if (parent.rootType === 'video' || parent.rootType === 'url') {
      if (targetObj.subject?.rewardLevel) {
        return targetObj.subject?.rewardLevel;
      }
      if (parent.rootObj?.rewardLevel > 0) {
        return 1;
      }
    }
    return 0;
  }

  async function handleEditDone(editedComment) {
    await editContent({
      editedComment,
      contentId: comment.id,
      contentType: 'comment'
    });
    onEditDone({ editedComment, commentId: comment.id });
    onSetIsEditing({
      contentId: comment.id,
      contentType: 'comment',
      isEditing: false
    });
  }

  function likeClick(likes) {
    onLikeClick({ commentId: comment.id, likes });
  }

  function onReplyButtonClick() {
    ReplyInputAreaRef.current.focus();
  }

  async function submitReply(reply) {
    setReplying(true);
    await onReplySubmit(reply);
  }
}

export default withRouter(memo(Comment));
