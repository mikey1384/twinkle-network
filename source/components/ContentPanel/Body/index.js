import React, { useContext, useEffect, useRef, useState } from 'react';
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
import { useAppContext } from 'context';

Body.propTypes = {
  autoExpand: PropTypes.bool,
  attachedVideoShown: PropTypes.bool,
  contentObj: PropTypes.object.isRequired,
  commentsHidden: PropTypes.bool,
  commentsShown: PropTypes.bool,
  inputAtBottom: PropTypes.bool,
  myId: PropTypes.number,
  onChangeSpoilerStatus: PropTypes.func.isRequired,
  secretShown: PropTypes.bool
};

export default function Body({
  attachedVideoShown,
  autoExpand,
  commentsHidden,
  commentsShown,
  contentObj,
  contentObj: {
    actualDescription,
    actualTitle,
    contentId,
    rewardLevel,
    feedId,
    id,
    numChildComments,
    title,
    childComments = [],
    commentsLoadMoreButton = false,
    likes = [],
    rootId,
    rootType,
    siteUrl,
    stars = [],
    rootObj = {},
    targetObj = {},
    thumbUrl,
    contentType,
    uploader = {},
    views
  },
  inputAtBottom,
  myId,
  onChangeSpoilerStatus,
  secretShown
}) {
  const {
    user: {
      state: { authLevel, canDelete, canEdit, canEditRewardLevel, canStar }
    },
    requestHelpers: { deleteContent, editContent, loadComments }
  } = useAppContext();
  const {
    commentsLoadLimit,
    onAddTags,
    onAddTagToContents,
    onAttachStar,
    onByUserStatusChange,
    onCommentSubmit,
    onDeleteComment,
    onDeleteContent,
    onEditComment,
    onEditContent,
    onEditRewardComment,
    onLoadComments,
    onLikeContent,
    onLoadMoreComments,
    onLoadMoreReplies,
    onLoadTags,
    onLoadRepliesOfReply,
    onReplySubmit,
    onSetCommentsHidden,
    onSetCommentsShown,
    onSetRewardLevel
  } = useContext(LocalContext);
  const [edited, setEdited] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userListModalShown, setUserListModalShown] = useState(false);
  const [confirmModalShown, setConfirmModalShown] = useState(false);
  const [xpRewardInterfaceShown, setXpRewardInterfaceShown] = useState(false);
  const mounted = useRef(true);
  const prevContent = useRef('');
  const CommentInputAreaRef = useRef(null);

  useEffect(() => {
    setXpRewardInterfaceShown(false);
  }, [myId]);

  useEffect(() => {
    mounted.current = true;
    if (autoExpand && !commentsShown) {
      loadInitialComments();
    }

    async function loadInitialComments() {
      const data = await loadComments({
        contentType,
        contentId,
        limit: commentsLoadLimit
      });
      if (mounted.current) {
        onLoadComments({ ...data, contentId, contentType });
        onSetCommentsShown({ contentId, contentType });
      }
    }
    return function cleanUp() {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    const contentSecretHidden =
      !!contentObj.secretAnswer &&
      !secretShown &&
      contentObj.uploader.id !== myId;
    const rootContentSecretHidden =
      !!rootObj.secretAnswer && !secretShown && rootObj.uploader.id !== myId;
    const subjectSecretHidden =
      !!targetObj?.subject?.secretAnswer &&
      !secretShown &&
      targetObj?.subject?.uploader.id !== myId;
    onSetCommentsHidden(
      contentSecretHidden || rootContentSecretHidden || subjectSecretHidden
    );
  }, [contentObj.id, secretShown, myId]);

  useEffect(() => {
    if (prevContent.current && prevContent.current !== contentObj.content) {
      setEdited(true);
    }
    prevContent.current = contentObj.content;
  }, [contentObj.content]);

  const userCanEditThis =
    (canEdit || canDelete) && authLevel > uploader.authLevel;
  const userCanRewardThis = canStar && authLevel > uploader.authLevel;
  const editButtonShown = myId === uploader.id || userCanEditThis;
  const secretLocked = contentType === 'comment' && commentsHidden;
  const urlRelated = edited
    ? {}
    : {
        thumbUrl: thumbUrl || rootObj.thumbUrl,
        actualTitle: actualTitle || rootObj.actualTitle,
        actualDescription: actualDescription || rootObj.actualDescription,
        siteUrl: siteUrl || rootObj.siteUrl
      };

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
          changeSpoilerStatus={onChangeSpoilerStatus}
          contentId={contentId}
          contentObj={contentObj}
          contentType={contentType}
          commentsHidden={commentsHidden}
          contentTitle={title || rootObj.title}
          onAddTags={onAddTags}
          onAddTagToContents={onAddTagToContents}
          isEditing={isEditing}
          myId={myId}
          onEditContent={editThisContent}
          onEditDismiss={() => setIsEditing(false)}
          onClickSecretAnswer={onCommentButtonClick}
          onLoadTags={onLoadTags}
          rootObj={rootObj}
          rootType={rootType}
          secretAnswerShown={secretShown}
          targetObj={targetObj}
          urlRelated={urlRelated}
        />
        {!isEditing && !commentsHidden && (
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
                  key="likeButton"
                  onClick={onLikeClick}
                  liked={determineUserLikedThis(likes)}
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
                  {numChildComments > 0 && !commentsShown && (
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
                {userCanRewardThis && myId !== uploader.id && (
                  <Button
                    color="pink"
                    disabled={xpButtonDisabled()}
                    style={{ marginLeft: '1rem' }}
                    onClick={() => setXpRewardInterfaceShown(true)}
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
                userId={myId}
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
              setXpRewardInterfaceShown(false);
              onAttachStar(data);
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
            margin-top: ${commentsHidden && rewardLevel ? '1rem' : ''};
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
            (autoExpand && !secretLocked) ||
            (contentType === 'subject' && commentsHidden)
          }
          comments={childComments}
          commentsLoadLimit={commentsLoadLimit}
          commentsShown={commentsShown && !secretLocked}
          contentId={contentId}
          inputAreaInnerRef={CommentInputAreaRef}
          inputAtBottom={inputAtBottom}
          loadMoreButton={commentsLoadMoreButton}
          inputTypeLabel={contentType === 'comment' ? 'reply' : 'comment'}
          numPreviews={1}
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
          onLoadMoreComments={data =>
            onLoadMoreComments({ data, contentType, feedId })
          }
          onLoadMoreReplies={data =>
            onLoadMoreReplies({ ...data, contentType, contentId })
          }
          onPreviewClick={onExpandComments}
          onLoadRepliesOfReply={onLoadRepliesOfReply}
          onReplySubmit={onReplySubmit}
          onRewardCommentEdit={onEditRewardComment}
          parent={contentObj}
          commentsHidden={commentsHidden}
          style={{
            padding: '0 1rem',
            paddingBottom:
              childComments.length > 0 || commentsShown ? '0.5rem' : 0
          }}
          userId={myId}
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
          await onExpandComments();
        }
        onChangeSpoilerStatus({ shown: true, subjectId: contentObj.id });
      }
    }
  }

  function renderEditMenuItems() {
    const editMenuItems = [];
    if (myId === uploader.id || canEdit) {
      editMenuItems.push({
        label: 'Edit',
        onClick: () => setIsEditing(true)
      });
    }
    if (myId === uploader.id || canDelete) {
      editMenuItems.push({
        label: 'Remove',
        onClick: () => setConfirmModalShown(true)
      });
    }
    return editMenuItems;
  }

  function determineUserLikedThis(likes) {
    let userLikedThis = false;
    for (let i = 0; i < likes.length; i++) {
      if (likes[i].id === myId) userLikedThis = true;
    }
    return userLikedThis;
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
      myId,
      xpRewardInterfaceShown
    });
  }

  async function onCommentButtonClick() {
    if (!commentsShown) {
      await onExpandComments();
    }
    if (!isMobile(navigator)) {
      CommentInputAreaRef.current.focus();
    }
    scrollElementToCenter(CommentInputAreaRef.current);
  }

  async function deleteThisContent() {
    await deleteContent({ contentType, id });
    onDeleteContent({ contentType, contentId: id });
  }

  async function editThisContent(params) {
    const data = await editContent({ params });
    onEditContent({ data, contentType, contentId });
  }

  async function onExpandComments() {
    const data = await loadComments({
      contentType,
      contentId,
      limit: commentsLoadLimit
    });
    onLoadComments({ ...data, contentId, contentType });
    onSetCommentsShown({ contentId, contentType });
  }

  async function onLikeClick(likes) {
    onLikeContent({ likes, contentType, contentId });
    if (!commentsShown) {
      await onExpandComments();
      if (Number(numChildComments) === 0 && !isMobile(navigator)) {
        CommentInputAreaRef.current.focus();
      }
    }
  }

  function onToggleByUser(byUser) {
    onByUserStatusChange({ byUser, contentId });
  }
}
