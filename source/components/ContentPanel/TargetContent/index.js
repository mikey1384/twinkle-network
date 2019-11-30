import React, { useEffect, useMemo, useRef, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import LocalContext from '../Context';
import UsernameText from 'components/Texts/UsernameText';
import Button from 'components/Button';
import LikeButton from 'components/Buttons/LikeButton';
import Likers from 'components/Likers';
import UserListModal from 'components/Modals/UserListModal';
import InputForm from 'components/Forms/InputForm';
import Comment from './Comment';
import LongText from 'components/Texts/LongText';
import ContentLink from 'components/ContentLink';
import RewardStatus from 'components/RewardStatus';
import XPRewardInterface from 'components/XPRewardInterface';
import ErrorBoundary from 'components/ErrorBoundary';
import HiddenComment from 'components/HiddenComment';
import Icon from 'components/Icon';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import { timeSince } from 'helpers/timeStampHelpers';
import { determineXpButtonDisabled, isMobile } from 'helpers';
import { useContentState, useMyState } from 'helpers/hooks';
import { useAppContext, useContentContext } from 'contexts';
import { useHistory } from 'react-router-dom';

TargetContent.propTypes = {
  className: PropTypes.string,
  contentId: PropTypes.number,
  contentType: PropTypes.string,
  rootObj: PropTypes.object,
  rootType: PropTypes.string.isRequired,
  onShowTCReplyInput: PropTypes.func.isRequired,
  style: PropTypes.object,
  targetObj: PropTypes.object
};

export default function TargetContent({
  className,
  contentId,
  contentType,
  rootObj,
  rootType,
  onShowTCReplyInput,
  style,
  targetObj: {
    comment,
    comment: { comments = [] } = {},
    replyInputShown,
    subject,
    type
  }
}) {
  const history = useHistory();
  const {
    requestHelpers: { uploadComment }
  } = useAppContext();
  const { authLevel, canStar, profilePicId, userId, username } = useMyState();
  const {
    actions: { onSetXpRewardInterfaceShown }
  } = useContentContext();
  const {
    onAttachStar,
    onDeleteComment,
    onEditComment,
    onEditRewardComment,
    onUploadTargetComment
  } = useContext(LocalContext);
  const { xpRewardInterfaceShown } = useContentState({
    contentType: 'comment',
    contentId: comment.id
  });
  const subjectState = useContentState({
    contentType: 'subject',
    contentId: subject?.id
  });
  const [userListModalShown, setUserListModalShown] = useState(false);
  const InputFormRef = useRef(null);
  const RewardInterfaceRef = useRef(null);
  const userCanRewardThis = useMemo(() => {
    let userIsUploader;
    if (comment && !comment.notFound) {
      userIsUploader = userId === comment.uploader.id;
    }
    let canRewardThis;
    if (comment && !comment.notFound) {
      canRewardThis =
        !userIsUploader && canStar && authLevel > comment.uploader.authLevel;
    }
    return canRewardThis;
  }, [authLevel, canStar, comment, userId]);

  const uploader = useMemo(() => {
    let result = {};
    if (comment && !comment.notFound) {
      result = comment.uploader;
    }
    return result;
  }, [comment]);

  const finalRewardLevel = useMemo(() => {
    const rootRewardLevel =
      rootType === 'video' || rootType === 'url'
        ? rootObj.rewardLevel > 0
          ? 1
          : 0
        : rootObj.rewardLevel;
    return subject?.rewardLevel || rootRewardLevel;
  }, [rootObj.rewardLevel, rootType, subject]);

  const xpButtonDisabled = useMemo(
    () =>
      determineXpButtonDisabled({
        rewardLevel: finalRewardLevel,
        stars: comment.stars || [],
        myId: userId,
        xpRewardInterfaceShown
      }),
    [comment, finalRewardLevel, userId, xpRewardInterfaceShown]
  );

  useEffect(() => {
    onSetXpRewardInterfaceShown({
      contentType: 'comment',
      contentId: comment.id,
      shown: xpRewardInterfaceShown && userCanRewardThis
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
  const contentHidden = useMemo(() => {
    const hasSecretAnswer = subject?.secretAnswer;
    const secretShown =
      subjectState.secretShown || subject?.uploader?.id === userId;
    return hasSecretAnswer && !secretShown;
  }, [subject, subjectState.secretShown, userId]);

  return (
    <ErrorBoundary
      className={`${className} ${css`
        font-size: 1.6rem;
        white-space: pre-wrap;
        overflow-wrap: break-word;
        word-break: break-word;
        border-radius: ${borderRadius};
        border: 1px solid ${Color.darkerBorderGray()};
        padding: 2rem 0 1rem 0;
        line-height: 1.5;
        background: ${Color.whiteGray()};
        margin-top: -1rem;
        transition: background 0.5s;
        .buttons {
          margin-top: 2rem;
          display: flex;
          width: 100%;
          justify-content: space-between;
          @media (max-width: ${mobileMaxWidth}) {
            button,
            span {
              font-size: 1rem;
            }
          }
        }
        .detail-block {
          display: flex;
          justify-content: space-between;
        }
        .timestamp {
          color: ${Color.gray()};
          font-size: 1.2rem;
        }
        &:hover {
          background: #fff;
        }
        @media (max-width: ${mobileMaxWidth}) {
          border-left: 0;
          border-right: 0;
        }
      `}`}
      style={style}
    >
      <div>
        {comment &&
          (comment.notFound || comment.deleted ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <span>Comment removed / no longer available</span>
            </div>
          ) : (
            <div style={{ marginTop: 0 }}>
              <div style={{ padding: '0 1rem' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div className="detail-block">
                    <div>
                      <UsernameText
                        user={comment.uploader}
                        color={Color.blue()}
                      />{' '}
                      <ContentLink
                        content={{
                          id: comment.id,
                          title: `${
                            type === 'reply'
                              ? 'replied'
                              : type === 'comment'
                              ? 'commented'
                              : 'responded'
                          }:`
                        }}
                        contentType="comment"
                        style={{ color: Color.green() }}
                      />
                    </div>
                    <div>
                      <span className="timestamp">
                        ({timeSince(comment.timeStamp)})
                      </span>
                    </div>
                  </div>
                  <div style={{ marginTop: '1rem' }}>
                    {contentHidden ? (
                      <HiddenComment
                        onClick={() => history.push(`/subjects/${subject.id}`)}
                      />
                    ) : (
                      <LongText>{comment.content}</LongText>
                    )}
                  </div>
                </div>
                {!contentHidden && (
                  <ErrorBoundary className="buttons">
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          marginBottom: comment.likes.length > 0 ? '0.5rem' : 0
                        }}
                      >
                        <LikeButton
                          contentType="comment"
                          contentId={comment.id}
                          onClick={handleLikeClick}
                          likes={comment.likes}
                          small
                        />
                        <Button
                          style={{ marginLeft: '1rem' }}
                          transparent
                          onClick={onReplyClick}
                        >
                          <Icon icon="comment-alt" />
                          <span style={{ marginLeft: '0.7rem' }}>Reply</span>
                        </Button>
                      </div>
                      <Likers
                        className={css`
                          font-weight: bold;
                          color: ${Color.darkerGray()};
                          font-size: 1.2rem;
                          line-height: 1;
                        `}
                        userId={userId}
                        likes={comment.likes}
                        onLinkClick={() => setUserListModalShown(true)}
                      />
                    </div>
                    <div>
                      {canStar && userCanRewardThis && (
                        <Button
                          color="pink"
                          disabled={!!xpButtonDisabled}
                          onClick={handleSetXpRewardInterfaceShown}
                        >
                          <Icon icon="certificate" />
                          <span style={{ marginLeft: '0.7rem' }}>
                            {xpButtonDisabled || 'Reward'}
                          </span>
                        </Button>
                      )}
                    </div>
                  </ErrorBoundary>
                )}
              </div>
              {xpRewardInterfaceShown && (
                <XPRewardInterface
                  innerRef={RewardInterfaceRef}
                  contentType={'comment'}
                  contentId={comment.id}
                  rewardLevel={finalRewardLevel}
                  uploaderId={comment.uploader.id}
                  stars={comment.stars}
                  onRewardSubmit={data => {
                    onSetXpRewardInterfaceShown({
                      contentType: 'comment',
                      contentId: comment.id,
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
              <RewardStatus
                className={css`
                  margin-left: -1px;
                  margin-right: -1px;
                  @media (max-width: ${mobileMaxWidth}) {
                    margin-left: 0px;
                    margin-right: 0px;
                  }
                `}
                style={{
                  marginTop:
                    comment.likes.length > 0 || xpRewardInterfaceShown
                      ? '0.5rem'
                      : '1rem'
                }}
                rewardLevel={finalRewardLevel}
                onCommentEdit={onEditRewardComment}
                stars={comment.stars}
                uploaderName={uploader.username}
              />
              {replyInputShown && !contentHidden && (
                <InputForm
                  innerRef={InputFormRef}
                  style={{
                    marginTop: comment.likes.length > 0 ? '0.5rem' : '1rem',
                    padding: '0 1rem'
                  }}
                  onSubmit={onSubmit}
                  parent={{ contentType: 'comment', contentId: comment.id }}
                  rows={4}
                  placeholder={`Write a reply...`}
                />
              )}
              {comments.length > 0 && (
                <div style={{ padding: '0 1rem' }}>
                  {comments.map(comment => (
                    <Comment
                      key={comment.id}
                      comment={comment}
                      username={username}
                      userId={userId}
                      profilePicId={profilePicId}
                      onDelete={onDeleteComment}
                      onEditDone={onEditComment}
                    />
                  ))}
                </div>
              )}
              {userListModalShown && (
                <UserListModal
                  onHide={() => setUserListModalShown(false)}
                  title="People who liked this comment"
                  users={comment.likes}
                  description="(You)"
                />
              )}
            </div>
          ))}
      </div>
    </ErrorBoundary>
  );

  function handleLikeClick() {
    if (comments.length === 0) {
      onShowTCReplyInput({ contentId, contentType });
      if (!isMobile(navigator)) {
        InputFormRef.current.focus();
      }
    }
  }

  function handleSetXpRewardInterfaceShown() {
    onSetXpRewardInterfaceShown({
      contentType: 'comment',
      contentId: comment.id,
      shown: true
    });
  }

  function onReplyClick() {
    if (!replyInputShown) onShowTCReplyInput({ contentId, contentType });
    if (!isMobile(navigator)) {
      setTimeout(() => InputFormRef.current.focus(), 0);
    }
  }

  async function onSubmit(content) {
    const data = await uploadComment({
      content,
      parent: {
        contentType: rootType,
        contentId: rootObj.id
      },
      targetCommentId: comment.id
    });
    onUploadTargetComment({ ...data, contentId, contentType });
  }
}
