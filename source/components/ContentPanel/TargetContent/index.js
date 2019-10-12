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
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import HiddenComment from 'components/HiddenComment';
import Icon from 'components/Icon';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';
import { timeSince } from 'helpers/timeStampHelpers';
import { determineXpButtonDisabled, isMobile } from 'helpers';
import { css } from 'emotion';
import { withRouter } from 'react-router';
import { useAppContext, useContentContext } from 'contexts';

TargetContent.propTypes = {
  className: PropTypes.string,
  contentId: PropTypes.number,
  contentType: PropTypes.string,
  history: PropTypes.object.isRequired,
  profilePicId: PropTypes.number,
  rootObj: PropTypes.object,
  rootType: PropTypes.string.isRequired,
  onShowTCReplyInput: PropTypes.func.isRequired,
  style: PropTypes.object,
  targetObj: PropTypes.object
};

function TargetContent({
  className,
  contentId,
  contentType,
  history,
  rootObj,
  profilePicId,
  rootType,
  onShowTCReplyInput,
  style,
  targetObj,
  targetObj: {
    comment,
    comment: { comments = [] } = {},
    replyInputShown,
    subject,
    type
  }
}) {
  const {
    user: {
      state: { authLevel, canStar, userId, username }
    },
    requestHelpers: { uploadComment }
  } = useAppContext();
  const {
    state,
    actions: { onSetXpRewardInterfaceShown }
  } = useContentContext();
  const commentState = state['comment' + comment.id] || {};
  const { xpRewardInterfaceShown } = commentState;
  const subjectState = state['subject' + subject?.id] || {};
  const [userListModalShown, setUserListModalShown] = useState(false);
  const [mouseEntered, setMouseEntered] = useState(false);
  const InputFormRef = useRef(null);
  const {
    onAttachStar,
    onDeleteComment,
    onEditComment,
    onEditRewardComment,
    onLikeContent,
    onUploadTargetComment
  } = useContext(LocalContext);
  let userLikedThis = false;
  let userIsUploader;
  let userCanRewardThis;
  let uploader = {};
  const hasSecretAnswer = subject?.secretAnswer;
  const secretShown =
    subjectState.secretShown || subject?.uploader?.id === userId;

  if (comment && !comment.notFound) {
    uploader = comment.uploader;
    for (let i = 0; i < comment.likes.length; i++) {
      if (comment.likes[i].id === userId) userLikedThis = true;
    }
    userIsUploader = userId === comment.uploader.id;
    userCanRewardThis =
      !userIsUploader && canStar && authLevel > comment.uploader.authLevel;
  }

  useEffect(() => {
    onSetXpRewardInterfaceShown({
      contentType: 'comment',
      contentId: comment.id,
      shown: xpRewardInterfaceShown && userCanRewardThis
    });
  }, [userId]);

  const contentHidden = hasSecretAnswer && !secretShown;

  return useMemo(
    () => (
      <ErrorBoundary
        onTouchStart={() => setMouseEntered(true)}
        onMouseEnter={() => setMouseEntered(true)}
        className={`${className} ${css`
          font-size: 1.6rem;
          white-space: pre-wrap;
          overflow-wrap: break-word;
          word-break: break-word;
          border-radius: ${borderRadius};
          border: 1px solid ${Color.darkerBorderGray()};
          padding: 2rem 0 1rem 0;
          margin-top: ${mouseEntered ? '-0.5rem' : '-2rem'};
          line-height: 1.5;
          background: ${Color.whiteGray()};
          transition: background 0.5s, margin-top 0.5s;
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
        `}`}
        style={style}
      >
        <div>
          {comment &&
            (comment.notFound ? (
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
                          onClick={() =>
                            history.push(`/subjects/${subject.id}`)
                          }
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
                            marginBottom:
                              comment.likes.length > 0 ? '0.5rem' : 0
                          }}
                        >
                          <LikeButton
                            contentType="comment"
                            contentId={comment.id}
                            onClick={handleLikeClick}
                            liked={userLikedThis}
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
                            disabled={xpButtonDisabled()}
                            onClick={() =>
                              onSetXpRewardInterfaceShown({
                                contentType: 'comment',
                                contentId: comment.id,
                                shown: true
                              })
                            }
                          >
                            <Icon icon="certificate" />
                            <span style={{ marginLeft: '0.7rem' }}>
                              {xpButtonDisabled() || 'Reward'}
                            </span>
                          </Button>
                        )}
                      </div>
                    </ErrorBoundary>
                  )}
                </div>
                {xpRewardInterfaceShown && (
                  <XPRewardInterface
                    contentType={'comment'}
                    contentId={comment.id}
                    rewardLevel={determineRewardLevel({
                      rootObj,
                      rootType,
                      subject
                    })}
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
                  rewardLevel={determineRewardLevel({
                    rootObj,
                    rootType,
                    subject
                  })}
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
                    parent={{ contentType: 'comment', id: comment.id }}
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
    ),
    [
      commentState,
      subjectState,
      history,
      profilePicId,
      targetObj,
      userId,
      userListModalShown,
      mouseEntered,
      userLikedThis,
      userIsUploader,
      userCanRewardThis,
      uploader,
      secretShown
    ]
  );

  function xpButtonDisabled() {
    return determineXpButtonDisabled({
      rewardLevel: determineRewardLevel({ rootObj, rootType, subject }),
      stars: comment.stars,
      myId: userId,
      xpRewardInterfaceShown
    });
  }

  function determineRewardLevel({ rootType, rootObj, subject }) {
    const rootRewardLevel =
      rootType === 'video' || rootType === 'url'
        ? rootObj.rewardLevel > 0
          ? 1
          : 0
        : rootObj.rewardLevel;
    return subject?.rewardLevel || rootRewardLevel;
  }

  function handleLikeClick(likes) {
    if (comments.length === 0) {
      onShowTCReplyInput({ contentId, contentType });
      InputFormRef.current.focus();
    }
    onLikeContent({ likes, contentType: 'comment', contentId: comment.id });
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
        id: rootObj.id
      },
      rootCommentId: comment.commentId,
      targetCommentId: comment.id
    });
    onUploadTargetComment({ ...data, contentId, contentType });
  }
}

export default withRouter(TargetContent);
