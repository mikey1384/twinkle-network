import React, {
  memo,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import PropTypes from 'prop-types';
import LocalContext from '../Context';
import LikeButton from 'components/Buttons/LikeButton';
import StarButton from 'components/Buttons/StarButton';
import Button from 'components/Button';
import Likers from 'components/Likers';
import UserListModal from 'components/Modals/UserListModal';
import VideoPlayer from 'components/VideoPlayer';
import Comments from 'components/Comments';
import MainContent from './MainContent';
import DropdownButton from 'components/Buttons/DropdownButton';
import ConfirmModal from 'components/Modals/ConfirmModal';
import XPRewardInterface from 'components/XPRewardInterface';
import RewardStatus from 'components/RewardStatus';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import Icon from 'components/Icon';
import { css } from 'emotion';
import { mobileMaxWidth } from 'constants/css';
import {
  determineXpButtonDisabled,
  isMobile,
  scrollElementToCenter
} from 'helpers';
import { addCommasToNumber } from 'helpers/stringHelpers';
import { useContentState, useMyState } from 'helpers/hooks';
import { useAppContext, useContentContext } from 'contexts';

Body.propTypes = {
  autoExpand: PropTypes.bool,
  attachedVideoShown: PropTypes.bool,
  contentObj: PropTypes.object.isRequired,
  commentsShown: PropTypes.bool,
  inputAtBottom: PropTypes.bool,
  numPreviewComments: PropTypes.number,
  onChangeSpoilerStatus: PropTypes.func.isRequired
};

function Body({
  attachedVideoShown,
  autoExpand,
  commentsShown,
  contentObj,
  contentObj: {
    commentsLoaded,
    contentId,
    rewardLevel,
    id,
    numChildComments,
    childComments = [],
    commentsLoadMoreButton = false,
    likes = [],
    previewLoaded,
    rootId,
    rootType,
    stars = [],
    rootObj = {},
    targetObj = {},
    contentType,
    uploader = {},
    views
  },
  inputAtBottom,
  numPreviewComments,
  onChangeSpoilerStatus
}) {
  const {
    requestHelpers: { deleteContent, loadComments }
  } = useAppContext();
  const {
    authLevel,
    canDelete,
    canEdit,
    canEditRewardLevel,
    canStar,
    userId
  } = useMyState();
  const {
    actions: { onSetIsEditing, onSetXpRewardInterfaceShown }
  } = useContentContext();
  const {
    isEditing,
    secretAnswer,
    secretShown,
    xpRewardInterfaceShown
  } = useContentState({
    contentType,
    contentId
  });
  const { secretShown: rootSecretShown } = useContentState({
    contentId: rootId,
    contentType: rootType
  });
  const { secretShown: subjectSecretShown } = useContentState({
    contentId: targetObj.subject?.id,
    contentType: 'subject'
  });
  const contentSecretHidden = !(
    !secretAnswer ||
    secretShown ||
    uploader.id === userId
  );
  const targetSubjectSecretHidden = !(
    subjectSecretShown || targetObj.subject?.uploader.id === userId
  );
  const rootObjSecretHidden = !(
    rootSecretShown || rootObj.uploader.id === userId
  );
  const secretHidden =
    contentType === 'subject'
      ? contentSecretHidden
      : targetObj.subject?.secretAnswer
      ? targetSubjectSecretHidden
      : rootObjSecretHidden;

  const {
    commentsLoadLimit,
    onAttachStar,
    onByUserStatusChange,
    onCommentSubmit,
    onDeleteComment,
    onDeleteContent,
    onEditComment,
    onEditRewardComment,
    onLoadComments,
    onLikeContent,
    onLoadMoreComments,
    onLoadMoreReplies,
    onLoadRepliesOfReply,
    onReplySubmit,
    onSetCommentsShown,
    onSetRewardLevel
  } = useContext(LocalContext);
  const [userListModalShown, setUserListModalShown] = useState(false);
  const [confirmModalShown, setConfirmModalShown] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const mounted = useRef(true);
  const prevContent = useRef('');
  const CommentInputAreaRef = useRef(null);
  const RewardInterfaceRef = useRef(null);

  useEffect(() => {
    mounted.current = true;
    if (!commentsLoaded && !(numPreviewComments > 0 && previewLoaded)) {
      loadInitialComments(numPreviewComments);
    }

    async function loadInitialComments(numPreviewComments) {
      if (!numPreviewComments) {
        setLoadingComments(true);
      }
      const data = await loadComments({
        contentType,
        contentId,
        limit: numPreviewComments || commentsLoadLimit
      });
      if (mounted.current) {
        onLoadComments({
          ...data,
          contentId,
          contentType,
          isPreview: numPreviewComments > 0
        });
        setLoadingComments(false);
      }
    }
    return function cleanUp() {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    prevContent.current = contentObj.content;
  }, [contentObj.content]);

  const userCanEditThis =
    (canEdit || canDelete) && authLevel > uploader.authLevel;
  const userCanRewardThis =
    canStar && authLevel > uploader.authLevel && userId !== uploader.id;
  const editButtonShown = userId === uploader.id || userCanEditThis;
  useEffect(() => {
    onSetXpRewardInterfaceShown({
      contentType,
      contentId,
      shown: xpRewardInterfaceShown && userCanRewardThis
    });
  }, [userId]);

  return useMemo(() => {
    return (
      <ErrorBoundary>
        <div>
          {contentType === 'comment' && attachedVideoShown && (
            <VideoPlayer
              stretch
              autoplay
              rewardLevel={rootObj.rewardLevel}
              byUser={!!rootObj.byUser}
              title={rootObj.title}
              style={{ marginBottom: '1rem' }}
              uploader={rootObj.uploader}
              hasHqThumb={rootObj.hasHqThumb}
              videoId={rootId}
              videoCode={rootObj.content}
            />
          )}
          <MainContent
            contentId={contentId}
            contentType={contentType}
            secretHidden={secretHidden}
            myId={userId}
            onClickSecretAnswer={onCommentButtonClick}
          />
          {!isEditing && !secretHidden && (
            <div
              className="bottom-interface"
              style={{
                marginBottom:
                  likes.length > 0 &&
                  !(stars.length > 0) &&
                  !commentsShown &&
                  !xpRewardInterfaceShown &&
                  '0.5rem'
              }}
            >
              <div className="buttons-bar">
                <div className="left">
                  <LikeButton
                    contentType={contentType}
                    contentId={contentId}
                    likes={likes}
                    key="likeButton"
                    onClick={onLikeClick}
                    small
                  />
                  <Button
                    transparent
                    key="commentButton"
                    style={{ marginLeft: '1rem' }}
                    onClick={onCommentButtonClick}
                  >
                    <Icon icon="comment-alt" />
                    <span style={{ marginLeft: '0.7rem' }}>
                      {contentType === 'video' || contentType === 'url'
                        ? 'Comment'
                        : contentType === 'subject'
                        ? 'Respond'
                        : 'Reply'}
                    </span>
                    {numChildComments > 0 && !commentsShown && !autoExpand && (
                      <span style={{ marginLeft: '0.5rem' }}>
                        ({numChildComments})
                      </span>
                    )}
                  </Button>
                  {editButtonShown && (
                    <DropdownButton
                      transparent
                      direction="right"
                      style={{ marginLeft: '0.5rem', display: 'inline-block' }}
                      size={contentType !== 'subject' ? 'sm' : null}
                      text="Edit"
                      menuProps={renderEditMenuItems()}
                    />
                  )}
                  {userCanRewardThis && (
                    <Button
                      color="pink"
                      disabled={xpButtonDisabled()}
                      style={{ marginLeft: '1rem' }}
                      onClick={handleSetXpRewardInterfaceShown}
                    >
                      <Icon icon="certificate" />
                      <span style={{ marginLeft: '0.7rem' }}>
                        {xpButtonDisabled() || 'Reward'}
                      </span>
                    </Button>
                  )}
                </div>
                <div
                  className="right"
                  style={{ position: 'relative', marginRight: 0 }}
                >
                  {canEditRewardLevel &&
                    (contentType === 'subject' || contentType === 'video') && (
                      <StarButton
                        byUser={!!contentObj.byUser}
                        contentId={contentObj.id}
                        rewardLevel={rewardLevel}
                        onSetRewardLevel={onSetRewardLevel}
                        onToggleByUser={onToggleByUser}
                        contentType={contentType}
                        uploader={uploader}
                      />
                    )}
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '0.5rem',
                  marginBottom: '0.5rem'
                }}
              >
                <Likers
                  className="content-panel__likes"
                  userId={userId}
                  likes={likes}
                  onLinkClick={() => setUserListModalShown(true)}
                />
                {views > 10 && contentType === 'video' && (
                  <div
                    style={{
                      fontWeight: 'bold',
                      fontSize: '1.7rem'
                    }}
                  >
                    {addCommasToNumber(views)} view
                    {`${views > 1 ? 's' : ''}`}
                  </div>
                )}
              </div>
            </div>
          )}
          {xpRewardInterfaceShown && (
            <XPRewardInterface
              innerRef={RewardInterfaceRef}
              contentType={contentType}
              contentId={contentId}
              rewardLevel={determineRewardLevel({
                contentObj,
                rootObj,
                rootType,
                targetObj
              })}
              uploaderId={uploader.id}
              stars={stars}
              onRewardSubmit={data => {
                onSetXpRewardInterfaceShown({
                  contentType,
                  contentId,
                  shown: false
                });
                onAttachStar({ data, contentId, contentType });
              }}
            />
          )}
          <RewardStatus
            contentType={contentType}
            rewardLevel={determineRewardLevel({
              contentObj,
              rootObj,
              rootType,
              targetObj
            })}
            onCommentEdit={onEditRewardComment}
            stars={stars}
            className={css`
              margin-top: ${secretHidden && rewardLevel ? '1rem' : ''};
              margin-left: -1px;
              margin-right: -1px;
              @media (max-width: ${mobileMaxWidth}) {
                margin-left: 0px;
                margin-right: 0px;
              }
            `}
          />
          <Comments
            autoFocus={false}
            autoExpand={
              (autoExpand && !secretHidden) ||
              (contentType === 'subject' && secretHidden)
            }
            comments={childComments}
            commentsLoadLimit={commentsLoadLimit}
            commentsShown={commentsShown && !secretHidden}
            contentId={contentId}
            inputAreaInnerRef={CommentInputAreaRef}
            inputAtBottom={inputAtBottom}
            loadMoreButton={commentsLoadMoreButton}
            inputTypeLabel={contentType === 'comment' ? 'reply' : 'comment'}
            isLoading={loadingComments}
            numPreviews={numPreviewComments}
            onAttachStar={onAttachStar}
            onCommentSubmit={handleCommentSubmit}
            onDelete={onDeleteComment}
            onEditDone={onEditComment}
            onLikeClick={({ commentId, likes }) =>
              onLikeContent({
                likes,
                contentId: commentId,
                contentType: 'comment'
              })
            }
            onLoadMoreComments={onLoadMoreComments}
            onLoadMoreReplies={onLoadMoreReplies}
            onPreviewClick={handleExpandComments}
            onLoadRepliesOfReply={onLoadRepliesOfReply}
            onReplySubmit={onReplySubmit}
            onRewardCommentEdit={onEditRewardComment}
            parent={contentObj}
            commentsHidden={secretHidden}
            style={{
              padding: '0 1rem',
              paddingBottom:
                childComments.length > 0 || commentsShown ? '0.5rem' : 0
            }}
            userId={userId}
          />
          {userListModalShown && (
            <UserListModal
              onHide={() => setUserListModalShown(false)}
              title={`People who liked this ${contentType}`}
              users={likes}
              description="(You)"
            />
          )}
        </div>
        {confirmModalShown && (
          <ConfirmModal
            onConfirm={deleteThisContent}
            onHide={() => setConfirmModalShown(false)}
            title={`Remove ${contentType.charAt(0).toUpperCase() +
              contentType.slice(1)}`}
          />
        )}
      </ErrorBoundary>
    );
  }, [
    isEditing,
    loadingComments,
    contentObj,
    attachedVideoShown,
    commentsShown,
    userId,
    userListModalShown,
    confirmModalShown,
    xpRewardInterfaceShown,
    editButtonShown,
    secretHidden
  ]);

  function determineRewardLevel({ contentObj, rootType, rootObj, targetObj }) {
    const rootRewardLevel =
      rootType === 'video' || rootType === 'url'
        ? rootObj.rewardLevel > 0
          ? 1
          : 0
        : rootObj.rewardLevel;
    return contentObj.byUser
      ? 5
      : targetObj.subject?.rewardLevel || rootRewardLevel;
  }

  async function handleCommentSubmit(params) {
    onCommentSubmit(params);
    if (contentObj.secretAnswer) {
      if (contentType === 'subject') {
        if (!commentsShown) {
          await handleExpandComments();
        }
        onChangeSpoilerStatus({ shown: true, subjectId: contentObj.id });
      }
    }
  }

  function handleSetXpRewardInterfaceShown() {
    onSetXpRewardInterfaceShown({
      contentType,
      contentId,
      shown: true
    });
    setTimeout(() => scrollElementToCenter(RewardInterfaceRef.current), 0);
  }

  function renderEditMenuItems() {
    const editMenuItems = [];
    if (userId === uploader.id || canEdit) {
      editMenuItems.push({
        label: 'Edit',
        onClick: () =>
          onSetIsEditing({ contentId, contentType, isEditing: true })
      });
    }
    if (userId === uploader.id || canDelete) {
      editMenuItems.push({
        label: 'Remove',
        onClick: () => setConfirmModalShown(true)
      });
    }
    return editMenuItems;
  }

  function xpButtonDisabled() {
    return determineXpButtonDisabled({
      stars,
      rewardLevel: determineRewardLevel({
        contentObj,
        rootObj,
        rootType,
        targetObj
      }),
      myId: userId,
      xpRewardInterfaceShown
    });
  }

  async function onCommentButtonClick() {
    if (!commentsShown) {
      await handleExpandComments();
    }
    if (!isMobile(navigator)) {
      CommentInputAreaRef.current.focus();
    }
    scrollElementToCenter(CommentInputAreaRef.current);
  }

  async function deleteThisContent() {
    await deleteContent({ contentType, id });
    if (contentType === 'comment') {
      onDeleteComment(id);
    } else {
      onDeleteContent({ contentType, contentId: id });
    }
  }

  async function handleExpandComments() {
    const data = await loadComments({
      contentType,
      contentId,
      limit: commentsLoadLimit
    });
    onLoadComments({ ...data, contentId, contentType });
    onSetCommentsShown({ contentId, contentType });
  }

  async function onLikeClick() {
    if (!commentsShown) {
      await handleExpandComments();
      if (Number(numChildComments) === 0 && !isMobile(navigator)) {
        CommentInputAreaRef.current.focus();
      }
    }
  }

  function onToggleByUser(byUser) {
    onByUserStatusChange({ byUser, contentId, contentType });
  }
}

export default memo(Body);
