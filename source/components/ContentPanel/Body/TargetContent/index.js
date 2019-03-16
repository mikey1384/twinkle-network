import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import Context from '../../Context';
import withContext from 'components/Wrappers/withContext';
import UsernameText from 'components/Texts/UsernameText';
import Button from 'components/Button';
import LikeButton from 'components/Buttons/LikeButton';
import Likers from 'components/Likers';
import UserListModal from 'components/Modals/UserListModal';
import InputForm from 'components/Texts/InputForm';
import Comment from './Comment';
import LongText from 'components/Texts/LongText';
import ContentLink from 'components/ContentLink';
import RewardStatus from 'components/RewardStatus';
import XPRewardInterface from 'components/XPRewardInterface';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import Icon from 'components/Icon';
import DifficultyBar from 'components/DifficultyBar';
import { connect } from 'react-redux';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';
import { timeSince } from 'helpers/timeStampHelpers';
import { determineXpButtonDisabled } from 'helpers';
import { uploadComment } from 'helpers/requestHelpers';
import { css } from 'emotion';

TargetContent.propTypes = {
  authLevel: PropTypes.number,
  canStar: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
  feedId: PropTypes.number,
  myId: PropTypes.number,
  onAttachStar: PropTypes.func.isRequired,
  onDeleteComment: PropTypes.func.isRequired,
  onEditComment: PropTypes.func.isRequired,
  onEditRewardComment: PropTypes.func.isRequired,
  onLikeContent: PropTypes.func.isRequired,
  onTargetCommentSubmit: PropTypes.func.isRequired,
  profilePicId: PropTypes.number,
  rootObj: PropTypes.object,
  rootType: PropTypes.string.isRequired,
  targetObj: PropTypes.object,
  username: PropTypes.string
};

function TargetContent({
  authLevel,
  canStar,
  dispatch,
  feedId,
  myId,
  onAttachStar,
  onDeleteComment,
  onEditComment,
  onEditRewardComment,
  onLikeContent,
  onTargetCommentSubmit,
  rootObj,
  profilePicId,
  rootType,
  targetObj: {
    subject,
    comment,
    comment: { comments = [], stars = [] } = {},
    type
  },
  username
}) {
  const [userListModalShown, setUserListModalShown] = useState(false);
  const [replyInputShown, setReplyInputShown] = useState(false);
  const [xpRewardInterfaceShown, setXpRewardInterfaceShown] = useState(false);
  const InputFormRef = useRef(null);

  let userLikedThis = false;
  let userIsUploader;
  let userCanStarThis;
  let uploader = {};
  if (comment && !comment.notFound) {
    uploader = comment.uploader;
    for (let i = 0; i < comment.likes.length; i++) {
      if (comment.likes[i].id === myId) userLikedThis = true;
    }
    userIsUploader = myId === comment.uploader.id;
    userCanStarThis =
      !userIsUploader && canStar && authLevel > comment.uploader.authLevel;
  } else {
    uploader = subject?.uploader || uploader;
  }

  return (
    <ErrorBoundary
      className={css`
        font-size: 1.6rem;
        white-space: pre-wrap;
        overflow-wrap: break-word;
        word-break: break-word;
        border-radius: ${borderRadius};
        border-top: 1px solid ${Color.inputBorderGray()};
        border-bottom: 1px solid ${Color.inputBorderGray()};
        padding-top: 1rem;
        padding-right: 0;
        padding-left: 0;
        background: ${Color.wellGray()};
        margin-bottom: 2rem;
        line-height: 1.5;
        .buttons {
          margin-top: 2rem;
          display: flex;
          width: 100%;
          justify-content: space-between;
        }
        .detail-block {
          display: flex;
          justify-content: space-between;
        }
        .root-content {
          color: ${Color.darkerGray()};
          font-weight: bold;
        }
        .timestamp {
          color: ${Color.gray()};
          font-size: 1.2rem;
        }
      `}
      style={{
        paddingBottom:
          stars &&
          stars.length > 0 &&
          !replyInputShown &&
          !xpRewardInterfaceShown
            ? 0
            : '1rem'
      }}
    >
      <div>
        {subject?.difficulty && (
          <DifficultyBar
            className={css`
              margin-left: -1px;
              margin-right: -1px;
              @media (max-width: ${mobileMaxWidth}) {
                margin-left: 0px;
                margin-right: 0px;
              }
            `}
            style={{
              fontSize: '1.3rem'
            }}
            difficulty={subject.difficulty}
          />
        )}
        {subject &&
          (subject.notFound ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <span>Subject removed / no longer available</span>
            </div>
          ) : (
            <div style={{ padding: '0.5rem 1rem' }}>
              <div
                className={css`
                  display: flex;
                  flex-direction: column;
                `}
              >
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <ContentLink
                      content={{ id: subject.id, title: 'Subject: ' }}
                      type="subject"
                      style={{ color: Color.green() }}
                    />
                  </div>
                  <div>
                    <UsernameText user={subject.uploader} />
                    &nbsp;
                    <span className="timestamp">
                      ({timeSince(subject.timeStamp)})
                    </span>
                  </div>
                </div>
                <div>
                  <span className="root-content">{subject.title}</span>
                </div>
              </div>
              <div>
                {subject.description && (
                  <LongText
                    className={css`
                      margin-top: 1rem;
                    `}
                  >
                    {subject.description}
                  </LongText>
                )}
              </div>
            </div>
          ))}
        {comment &&
          (comment.notFound ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <span>Comment removed / no longer available</span>
            </div>
          ) : (
            <div style={{ marginTop: subject ? '1rem' : 0 }}>
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
                        type="comment"
                        style={{ color: Color.green() }}
                      />
                    </div>
                    <div>
                      <span className="timestamp">
                        ({timeSince(comment.timeStamp)})
                      </span>
                    </div>
                  </div>
                  <LongText style={{ marginTop: '1rem' }}>
                    {comment.content}
                  </LongText>
                </div>
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
                        onClick={onLikeClick}
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
                      className="content-panel__likes"
                      userId={myId}
                      likes={comment.likes}
                      onLinkClick={() => setUserListModalShown(true)}
                    />
                  </div>
                  <div>
                    {canStar && userCanStarThis && (
                      <Button
                        love
                        disabled={xpButtonDisabled()}
                        onClick={() => setXpRewardInterfaceShown(true)}
                      >
                        <Icon icon="certificate" />
                        <span style={{ marginLeft: '0.7rem' }}>
                          {xpButtonDisabled() || 'Reward'}
                        </span>
                      </Button>
                    )}
                  </div>
                </ErrorBoundary>
              </div>
              {xpRewardInterfaceShown && (
                <XPRewardInterface
                  contentType={'comment'}
                  contentId={comment.id}
                  difficulty={determineDifficulty({
                    rootObj,
                    rootType,
                    subject
                  })}
                  uploaderId={comment.uploader.id}
                  stars={comment.stars}
                  onRewardSubmit={data => {
                    setXpRewardInterfaceShown(false);
                    onAttachStar(data);
                  }}
                />
              )}
              <RewardStatus
                difficulty={determineDifficulty({
                  rootObj,
                  rootType,
                  subject
                })}
                onCommentEdit={onEditRewardComment}
                style={{
                  marginTop:
                    comment.likes.length > 0 || xpRewardInterfaceShown
                      ? '0.5rem'
                      : '1rem'
                }}
                stars={comment.stars}
                uploaderName={uploader.username}
              />
              {replyInputShown && (
                <InputForm
                  innerRef={InputFormRef}
                  style={{
                    marginTop: comment.likes.length > 0 ? '0.5rem' : '1rem',
                    padding: '0 1rem'
                  }}
                  autoFocus
                  onSubmit={onSubmit}
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
                      userId={myId}
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

  function xpButtonDisabled() {
    const stars =
      type === 'comment' || type === 'reply' ? comment.stars : subject.stars;
    return determineXpButtonDisabled({
      difficulty: determineDifficulty({ rootObj, rootType, subject }),
      stars,
      myId,
      xpRewardInterfaceShown
    });
  }

  function determineDifficulty({ rootType, rootObj, subject }) {
    const rootDifficulty =
      rootType === 'video'
        ? rootObj.difficulty > 0
          ? 1
          : 0
        : rootObj.difficulty;
    return subject?.difficulty || rootDifficulty;
  }

  function onLikeClick(likes) {
    onLikeContent({ likes, type: 'comment', contentId: comment.id });
  }

  function onReplyClick() {
    if (!replyInputShown) return setReplyInputShown(true);
    InputFormRef.current.focus();
  }

  async function onSubmit(content) {
    const data = await uploadComment({
      content,
      parent: {
        type: rootType,
        id: rootObj.id
      },
      rootCommentId: comment.commentId,
      targetCommentId: comment.id,
      dispatch
    });
    onTargetCommentSubmit(data, feedId);
  }
}

export default connect(
  state => ({
    authLevel: state.UserReducer.authLevel,
    canStar: state.UserReducer.canStar,
    username: state.UserReducer.username,
    profilePicId: state.UserReducer.profilePicId
  }),
  dispatch => ({ dispatch })
)(withContext({ Component: TargetContent, Context }));
