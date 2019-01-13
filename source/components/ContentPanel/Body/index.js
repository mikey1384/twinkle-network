import PropTypes from 'prop-types';
import React, { Component } from 'react';
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
import DifficultyModal from 'components/Modals/DifficultyModal';
import { determineXpButtonDisabled } from 'helpers';
import {
  deleteContent,
  editContent,
  loadComments
} from 'helpers/requestHelpers';

class Body extends Component {
  static propTypes = {
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
    type: PropTypes.string,
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
    onLoadRepliesOfReply: PropTypes.func.isRequired,
    onReplySubmit: PropTypes.func.isRequired,
    onSetDifficulty: PropTypes.func,
    onShowComments: PropTypes.func.isRequired,
    onStarVideo: PropTypes.func
  };

  state = {
    autoFocusWhenCommentShown: false,
    rewardExplanation: '',
    difficultyModalShown: false,
    edited: false,
    isEditing: false,
    userListModalShown: false,
    commentsShown: false,
    confirmModalShown: false,
    twoStarSelected: false,
    xpRewardInterfaceShown: false
  };

  mounted = false;

  async componentDidMount() {
    const {
      autoExpand,
      onShowComments,
      commentsLoadLimit,
      contentObj: { type, contentId }
    } = this.props;
    this.mounted = true;
    if (autoExpand) {
      const data = await loadComments({
        type: type,
        id: contentId,
        limit: commentsLoadLimit
      });
      if (this.mounted) {
        if (data) onShowComments(data);
        this.setState({ commentsShown: true });
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (this.mounted) {
      if (
        prevProps.contentObj.id !== this.props.contentObj.id ||
        prevProps.type !== this.props.type
      ) {
        this.setState({ commentsShown: false });
      }
      if (prevProps.contentObj.content !== this.props.contentObj.content) {
        this.setState({ edited: true });
      }
      if (prevProps.myId !== this.props.myId) {
        this.setState({ xpRewardInterfaceShown: false });
      }
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const {
      contentObj,
      contentObj: {
        actualDescription,
        actualTitle,
        contentId,
        difficulty,
        feedId,
        numChildComments,
        discussionId,
        replyId,
        title,
        commentId,
        childComments = [],
        commentsLoadMoreButton = false,
        isStarred,
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
      commentsLoadLimit,
      inputAtBottom,
      myId,
      attachedVideoShown,
      onAddTags,
      onAddTagToContents,
      onAttachStar,
      onCommentSubmit,
      onDeleteComment,
      onEditComment,
      onEditRewardComment,
      onLikeContent,
      onLoadMoreComments,
      onLoadMoreReplies,
      onLoadTags,
      onLoadRepliesOfReply,
      onReplySubmit,
      onSetDifficulty
    } = this.props;
    const {
      autoFocusWhenCommentShown,
      edited,
      userListModalShown,
      confirmModalShown,
      commentsShown,
      difficultyModalShown,
      isEditing,
      xpRewardInterfaceShown
    } = this.state;

    const userCanEditThis =
      (canEdit || canDelete) && authLevel > uploader.authLevel;
    const userCanStarThis = canStar && authLevel > uploader.authLevel;
    const editButtonShown = myId === uploader.id || userCanEditThis;
    return (
      <ErrorBoundary>
        <div>
          {confirmModalShown && (
            <ConfirmModal
              onConfirm={this.onDeleteContent}
              onHide={() => this.setState({ confirmModalShown: false })}
              title={`Remove ${type.charAt(0).toUpperCase() + type.slice(1)}`}
            />
          )}
          {type === 'comment' && attachedVideoShown && (
            <VideoPlayer
              stretch
              autoplay
              isStarred={!!rootObj.isStarred}
              byUser={!!rootObj.byUser}
              title={rootObj.title}
              style={{ marginBottom: '1rem' }}
              uploader={rootObj.uploader}
              hasHqThumb={rootObj.hasHqThumb}
              videoId={rootId}
              videoCode={rootObj.content}
            />
          )}
          {type === 'comment' && (commentId || replyId || discussionId) && (
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
            onEditContent={this.onEditContent}
            onEditDismiss={() => this.setState({ isEditing: false })}
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
                  {type !== 'discussion' && (
                    <>
                      <LikeButton
                        contentType={type}
                        contentId={contentId}
                        key="likeButton"
                        onClick={this.onLikeClick}
                        liked={this.determineUserLikedThis(likes)}
                        small
                      />
                      <Button
                        transparent
                        key="commentButton"
                        style={{ marginLeft: '1rem' }}
                        onClick={this.onCommentButtonClick}
                      >
                        <Icon icon="comment-alt" />
                        <span style={{ marginLeft: '0.7rem' }}>
                          {type === 'video' || type === 'url'
                            ? 'Comment'
                            : type === 'question'
                            ? 'Respond'
                            : 'Reply'}
                        </span>
                        {numChildComments > 0 && !commentsShown && (
                          <span style={{ marginLeft: '0.5rem' }}>
                            ({numChildComments})
                          </span>
                        )}
                      </Button>
                    </>
                  )}
                  {type === 'discussion' && (
                    <Button transparent onClick={this.onCommentButtonClick}>
                      <Icon icon="comment-alt" />
                      <span style={{ marginLeft: '0.7rem' }}>Answer</span>
                      {!!numChildComments &&
                        numChildComments > 0 &&
                        !commentsShown && (
                          <span style={{ marginLeft: '0.5rem' }}>
                            ({numChildComments})
                          </span>
                        )}
                    </Button>
                  )}
                  {editButtonShown && (
                    <DropdownButton
                      transparent
                      direction="right"
                      style={{ marginLeft: '0.5rem', display: 'inline-block' }}
                      size={type !== 'discussion' ? 'sm' : null}
                      text="Edit"
                      menuProps={this.renderEditMenuItems()}
                    />
                  )}
                  {canStar && userCanStarThis && myId !== uploader.id && (
                    <Button
                      love
                      disabled={this.determineXpButtonDisabled()}
                      style={{ marginLeft: '1rem' }}
                      onClick={() =>
                        this.setState({ xpRewardInterfaceShown: true })
                      }
                    >
                      <Icon icon="certificate" />
                      <span style={{ marginLeft: '0.7rem' }}>
                        {this.determineXpButtonDisabled() || 'Reward'}
                      </span>
                    </Button>
                  )}
                </div>
                <div className="right">
                  {canStar && type === 'video' && (
                    <div style={{ position: 'relative' }}>
                      <StarButton
                        byUser={!!contentObj.byUser}
                        contentId={contentObj.id}
                        isStarred={!!isStarred}
                        onToggleStarred={this.onToggleStarred}
                        onToggleByUser={this.onToggleByUser}
                        uploader={uploader}
                      />
                    </div>
                  )}
                  {canEditDifficulty &&
                    (type === 'question' || type === 'discussion') && (
                      <StarButton
                        isStarred={!!difficulty}
                        onClick={() =>
                          this.setState({ difficultyModalShown: true })
                        }
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
                  onLinkClick={() =>
                    this.setState({ userListModalShown: true })
                  }
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
              difficulty={
                contentObj.byUser
                  ? 5
                  : rootObj.difficulty ||
                    (targetObj.discussion || {}).difficulty
              }
              uploaderId={uploader.id}
              stars={stars}
              onRewardSubmit={data => {
                this.setState({ xpRewardInterfaceShown: false });
                onAttachStar(data);
              }}
            />
          )}
          <RewardStatus
            contentType={type}
            difficulty={
              contentObj.byUser
                ? 5
                : rootObj.difficulty || (targetObj.discussion || {}).difficulty
            }
            onCommentEdit={onEditRewardComment}
            stars={stars}
            type={type}
          />
          <Comments
            autoFocus={autoFocusWhenCommentShown}
            autoExpand={autoExpand}
            comments={childComments}
            commentsLoadLimit={commentsLoadLimit}
            commentsShown={commentsShown}
            contentId={contentId}
            inputAreaInnerRef={ref => (this.CommentInputArea = ref)}
            inputAtBottom={inputAtBottom}
            loadMoreButton={commentsLoadMoreButton}
            loadMoreComments={data =>
              onLoadMoreComments({ data, contentType: type, feedId })
            }
            inputTypeLabel={
              type === 'comment'
                ? 'reply'
                : type === 'question'
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
            onLoadMoreReplies={data => onLoadMoreReplies(data, feedId)}
            onPreviewClick={this.onExpandComments}
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
              onHide={() => this.setState({ userListModalShown: false })}
              title={`People who liked this ${type}`}
              users={likes}
              description="(You)"
            />
          )}
          {difficultyModalShown && (
            <DifficultyModal
              type={type}
              contentId={contentId}
              difficulty={difficulty}
              onSubmit={data => {
                onSetDifficulty(data);
                this.setState({ difficultyModalShown: false });
              }}
              onHide={() => this.setState({ difficultyModalShown: false })}
            />
          )}
        </div>
      </ErrorBoundary>
    );
  }

  renderEditMenuItems = () => {
    const {
      canDelete,
      canEdit,
      myId,
      contentObj: { uploader }
    } = this.props;
    const editMenuItems = [];
    if (myId === uploader.id || canEdit) {
      editMenuItems.push({
        label: 'Edit',
        onClick: () => this.setState({ isEditing: true })
      });
    }
    if (myId === uploader.id || canDelete) {
      editMenuItems.push({
        label: 'Remove',
        onClick: () => this.setState({ confirmModalShown: true })
      });
    }
    return editMenuItems;
  };

  determineUserLikedThis = likes => {
    const { myId } = this.props;
    let userLikedThis = false;
    for (let i = 0; i < likes.length; i++) {
      if (likes[i].id === myId) userLikedThis = true;
    }
    return userLikedThis;
  };

  determineXpButtonDisabled = () => {
    const {
      contentObj: { byUser, stars, rootObj = {}, targetObj = {} },
      myId
    } = this.props;
    const { xpRewardInterfaceShown } = this.state;
    return determineXpButtonDisabled({
      stars,
      difficulty: byUser
        ? 5
        : rootObj.difficulty || (targetObj.discussion || {}).difficulty,
      myId,
      xpRewardInterfaceShown
    });
  };

  onCommentButtonClick = async data => {
    const { commentsShown } = this.state;
    if (!commentsShown) {
      await this.onExpandComments();
    }
    this.CommentInputArea.focus();
  };

  onDeleteContent = async() => {
    const {
      contentObj: { type, id },
      dispatch,
      onDeleteContent
    } = this.props;
    await deleteContent({ type, id, dispatch });
    onDeleteContent({ type, contentId: id });
  };

  onEditContent = async params => {
    const {
      dispatch,
      onEditContent,
      contentObj: { type, contentId }
    } = this.props;
    const data = await editContent({ params, dispatch });
    if (data) onEditContent({ data, contentType: type, contentId });
  };

  onExpandComments = async() => {
    const {
      commentsLoadLimit,
      contentObj: { type, contentId, feedId },
      onShowComments
    } = this.props;
    const data = await loadComments({
      type,
      id: contentId,
      limit: commentsLoadLimit
    });
    if (data) onShowComments(data, feedId);
    this.setState({ commentsShown: true });
  };

  onLikeClick = async likes => {
    const {
      contentObj: { type, contentId },
      onLikeContent
    } = this.props;
    const { commentsShown } = this.state;
    onLikeContent({ likes, type, contentId });
    if (!commentsShown) {
      this.onExpandComments();
    }
  };

  onToggleByUser = byUser => {
    const {
      contentObj: { contentId },
      onByUserStatusChange
    } = this.props;
    onByUserStatusChange({ byUser, contentId });
  };

  onToggleStarred = () => {
    const {
      contentObj: { contentId },
      onStarVideo
    } = this.props;
    onStarVideo(contentId);
  };
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
