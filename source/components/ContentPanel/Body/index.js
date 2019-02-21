import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import Context from '../Context';
import withContext from 'components/Wrappers/withContext';
import LikeButton from 'components/Buttons/LikeButton';
import StarButton from 'components/Buttons/StarButton';
import Button from 'components/Button';
import Likers from 'components/Likers';
import { connect } from 'react-redux';
import UserListModal from 'components/Modals/UserListModal';
import VideoPlayer from 'components/VideoPlayer';
import Comments from 'components/Comments';
import MainContent from './MainContent';
import TargetContent from './TargetContent';
import DropdownButton from 'components/Buttons/DropdownButton';
import ConfirmModal from 'components/Modals/ConfirmModal';
import XPRewardInterface from 'components/XPRewardInterface';
import RewardStatus from 'components/RewardStatus';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import Icon from 'components/Icon';
import { determineXpButtonDisabled, scrollElementToCenter } from 'helpers';
import {
  deleteContent,
  editContent,
  loadComments
} from 'helpers/requestHelpers';

Body.propTypes = {
  autoExpand: PropTypes.bool,
  attachedVideoShown: PropTypes.bool,
  authLevel: PropTypes.number,
  canDelete: PropTypes.bool,
  canEdit: PropTypes.bool,
  canEditDifficulty: PropTypes.bool,
  contentObj: PropTypes.object.isRequired,
  canStar: PropTypes.bool,
  commentsLoadLimit: PropTypes.number,
  dispatch: PropTypes.func.isRequired,
  inputAtBottom: PropTypes.bool,
  myId: PropTypes.number,
  onAddTags: PropTypes.func,
  onAddTagToContents: PropTypes.func,
  onAttachStar: PropTypes.func.isRequired,
  onByUserStatusChange: PropTypes.func,
  onCommentSubmit: PropTypes.func.isRequired,
  onDeleteComment: PropTypes.func.isRequired,
  onDeleteContent: PropTypes.func.isRequired,
  onEditComment: PropTypes.func.isRequired,
  onEditContent: PropTypes.func.isRequired,
  onEditRewardComment: PropTypes.func.isRequired,
  onLikeContent: PropTypes.func.isRequired,
  onLoadMoreComments: PropTypes.func.isRequired,
  onLoadMoreReplies: PropTypes.func.isRequired,
  onLoadTags: PropTypes.func,
  onLoadRepliesOfReply: PropTypes.func,
  onReplySubmit: PropTypes.func.isRequired,
  onSetDifficulty: PropTypes.func,
  onShowComments: PropTypes.func.isRequired
};

function Body({
  onShowComments,
  commentsLoadLimit,
  contentObj,
  contentObj: {
    actualDescription,
    actualTitle,
    contentId,
    difficulty,
    feedId,
    id,
    numChildComments,
    subjectId,
    replyId,
    title,
    commentId,
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
    type,
    uploader = {},
    views
  },
  autoExpand,
  authLevel,
  canDelete,
  canEdit,
  canEditDifficulty,
  canStar,
  dispatch,
  inputAtBottom,
  myId,
  attachedVideoShown,
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
  onLikeContent,
  onLoadMoreComments,
  onLoadMoreReplies,
  onLoadTags,
  onLoadRepliesOfReply,
  onReplySubmit,
  onSetDifficulty
}) {
  const [edited, setEdited] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userListModalShown, setUserListModalShown] = useState(false);
  const [commentsShown, setCommentsShown] = useState(false);
  const [confirmModalShown, setConfirmModalShown] = useState(false);
  const [xpRewardInterfaceShown, setXpRewardInterfaceShown] = useState(false);
  const CommentInputAreaRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    if (autoExpand && !commentsShown) {
      loadInitialComments();
    }

    async function loadInitialComments() {
      const data = await loadComments({
        type: type,
        id: contentId,
        limit: commentsLoadLimit
      });
      if (mounted) {
        onShowComments(data);
        setCommentsShown(true);
      }
    }
    return () => (mounted = false);
  }, []);

  useEffect(() => {
    setCommentsShown(false);
  }, [contentObj.id, type]);

  useEffect(() => {
    setEdited(true);
  }, [contentObj.content]);

  useEffect(() => {
    setXpRewardInterfaceShown(false);
  }, [myId]);

  const userCanEditThis =
    (canEdit || canDelete) && authLevel > uploader.authLevel;
  const userCanRewardThis = canStar && authLevel > uploader.authLevel;
  const editButtonShown = myId === uploader.id || userCanEditThis;

  return (
    <ErrorBoundary>
      <div>
        {confirmModalShown && (
          <ConfirmModal
            onConfirm={deleteThisContent}
            onHide={() => setConfirmModalShown(false)}
            title={`Remove ${type.charAt(0).toUpperCase() + type.slice(1)}`}
          />
        )}
        {type === 'comment' && attachedVideoShown && (
          <VideoPlayer
            stretch
            autoplay
            difficulty={rootObj.difficulty}
            byUser={!!rootObj.byUser}
            title={rootObj.title}
            style={{ marginBottom: '1rem' }}
            uploader={rootObj.uploader}
            hasHqThumb={rootObj.hasHqThumb}
            videoId={rootId}
            videoCode={rootObj.content}
          />
        )}
        {type === 'comment' && (commentId || replyId || subjectId) && (
          <TargetContent
            targetObj={targetObj}
            rootObj={rootObj}
            myId={myId}
            rootId={rootId}
            rootType={rootType}
            feedId={feedId}
          />
        )}
        <MainContent
          contentId={contentId}
          contentObj={contentObj}
          type={type}
          contentTitle={title || rootObj.title}
          onAddTags={onAddTags}
          onAddTagToContents={onAddTagToContents}
          isEditing={isEditing}
          onEditContent={editThisContent}
          onEditDismiss={() => setIsEditing(false)}
          onLoadTags={onLoadTags}
          rootObj={rootObj}
          rootType={rootType}
          urlRelated={
            edited
              ? {}
              : {
                  thumbUrl: thumbUrl || rootObj.thumbUrl,
                  actualTitle: actualTitle || rootObj.actualTitle,
                  actualDescription:
                    actualDescription || rootObj.actualDescription,
                  siteUrl: siteUrl || rootObj.siteUrl
                }
          }
        />
        {!isEditing && (
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
                  contentType={type}
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
                    {type === 'video' || type === 'url'
                      ? 'Comment'
                      : type === 'subject'
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
                    size={type !== 'subject' ? 'sm' : null}
                    text="Edit"
                    menuProps={renderEditMenuItems()}
                  />
                )}
                {userCanRewardThis && myId !== uploader.id && (
                  <Button
                    love
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
              <div className="right" style={{ position: 'relative' }}>
                {canEditDifficulty &&
                  (type === 'subject' || type === 'video') && (
                    <StarButton
                      byUser={!!contentObj.byUser}
                      contentId={contentObj.id}
                      difficulty={difficulty}
                      onSetDifficulty={onSetDifficulty}
                      onToggleByUser={onToggleByUser}
                      type={type}
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
              {views > 10 && type === 'video' && (
                <div
                  style={{
                    fontWeight: 'bold',
                    fontSize: '1.7rem'
                  }}
                >
                  {views} view
                  {`${views > 1 ? 's' : ''}`}
                </div>
              )}
            </div>
          </div>
        )}
        {xpRewardInterfaceShown && (
          <XPRewardInterface
            contentType={type}
            contentId={contentId}
            difficulty={determineDifficulty({
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
          contentType={type}
          difficulty={determineDifficulty({
            contentObj,
            rootObj,
            rootType,
            targetObj
          })}
          onCommentEdit={onEditRewardComment}
          stars={stars}
          type={type}
        />
        <Comments
          autoFocus={false}
          autoExpand={autoExpand}
          comments={childComments}
          commentsLoadLimit={commentsLoadLimit}
          commentsShown={commentsShown}
          contentId={contentId}
          inputAreaInnerRef={CommentInputAreaRef}
          inputAtBottom={inputAtBottom}
          loadMoreButton={commentsLoadMoreButton}
          inputTypeLabel={
            type === 'comment'
              ? 'reply'
              : type === 'subject'
              ? 'respond'
              : 'comment'
          }
          numPreviews={1}
          onAttachStar={onAttachStar}
          onCommentSubmit={onCommentSubmit}
          onDelete={onDeleteComment}
          onEditDone={onEditComment}
          onLikeClick={({ commentId, likes }) =>
            onLikeContent({ likes, contentId: commentId, type: 'comment' })
          }
          onLoadMoreComments={data =>
            onLoadMoreComments({ data, contentType: type, feedId })
          }
          onLoadMoreReplies={data => onLoadMoreReplies(data, feedId)}
          onPreviewClick={onExpandComments}
          onLoadRepliesOfReply={onLoadRepliesOfReply}
          onReplySubmit={onReplySubmit}
          onRewardCommentEdit={onEditRewardComment}
          parent={contentObj}
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
            title={`People who liked this ${type}`}
            users={likes}
            description="(You)"
          />
        )}
      </div>
    </ErrorBoundary>
  );

  function determineDifficulty({ contentObj, rootType, rootObj, targetObj }) {
    const rootDifficulty =
      rootType === 'video'
        ? rootObj.difficulty > 0
          ? 1
          : 0
        : rootObj.difficulty;
    return contentObj.byUser
      ? 5
      : targetObj.subject?.difficulty || rootDifficulty;
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
      difficulty: determineDifficulty({
        contentObj,
        rootObj,
        rootType,
        targetObj
      }),
      myId,
      xpRewardInterfaceShown
    });
  }

  async function onCommentButtonClick(data) {
    if (!commentsShown) {
      await onExpandComments();
    }
    CommentInputAreaRef.current.focus();
    scrollElementToCenter(CommentInputAreaRef.current);
  }

  async function deleteThisContent() {
    await deleteContent({ type, id, dispatch });
    onDeleteContent({ type, contentId: id });
  }

  async function editThisContent(params) {
    const data = await editContent({ params, dispatch });
    onEditContent({ data, contentType: type, contentId });
  }

  async function onExpandComments() {
    const data = await loadComments({
      type,
      id: contentId,
      limit: commentsLoadLimit
    });
    onShowComments(data, feedId);
    setCommentsShown(true);
  }

  async function onLikeClick(likes) {
    onLikeContent({ likes, type, contentId });
    if (!commentsShown) {
      onExpandComments();
    }
  }

  function onToggleByUser(byUser) {
    onByUserStatusChange({ byUser, contentId });
  }
}

export default connect(
  state => ({
    authLevel: state.UserReducer.authLevel,
    canDelete: state.UserReducer.canDelete,
    canEdit: state.UserReducer.canEdit,
    canEditDifficulty: state.UserReducer.canEditDifficulty,
    canStar: state.UserReducer.canStar
  }),
  dispatch => ({ dispatch })
)(withContext({ Component: Body, Context }));
