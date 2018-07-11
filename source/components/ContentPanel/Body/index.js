import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import Context from '../Context'
import withContext from 'components/Wrappers/withContext'
import LikeButton from 'components/Buttons/LikeButton'
import StarButton from 'components/StarButton'
import Button from 'components/Button'
import Likers from 'components/Likers'
import { connect } from 'react-redux'
import UserListModal from 'components/Modals/UserListModal'
import VideoPlayer from 'components/VideoPlayer'
import Comments from 'components/Comments'
import MainContent from './MainContent'
import TargetContent from './TargetContent'
import DropdownButton from 'components/Buttons/DropdownButton'
import ConfirmModal from 'components/Modals/ConfirmModal'
import XPRewardInterface from 'components/XPRewardInterface'
import RewardStatus from 'components/RewardStatus'
import ErrorBoundary from 'components/Wrappers/ErrorBoundary'
import { determineXpButtonDisabled } from 'helpers/domHelpers'

class Body extends Component {
  static propTypes = {
    autoShowComments: PropTypes.bool,
    attachedVideoShown: PropTypes.bool,
    authLevel: PropTypes.number,
    canDelete: PropTypes.bool,
    canEdit: PropTypes.bool,
    contentObj: PropTypes.object.isRequired,
    canStar: PropTypes.bool,
    inputAtBottom: PropTypes.bool,
    myId: PropTypes.number,
    type: PropTypes.string,
    onAttachStar: PropTypes.func.isRequired,
    onCommentSubmit: PropTypes.func.isRequired,
    onDeleteComment: PropTypes.func.isRequired,
    onDeleteContent: PropTypes.func.isRequired,
    onEditComment: PropTypes.func.isRequired,
    onEditContent: PropTypes.func.isRequired,
    onEditRewardComment: PropTypes.func.isRequired,
    onLikeComment: PropTypes.func.isRequired,
    onLikeContent: PropTypes.func.isRequired,
    onLikeQuestion: PropTypes.func.isRequired,
    onLoadMoreComments: PropTypes.func.isRequired,
    onLoadMoreReplies: PropTypes.func.isRequired,
    onShowComments: PropTypes.func.isRequired,
    onStarVideo: PropTypes.func
  }

  state = {
    autoFocusWhenCommentShown: false,
    rewardExplanation: '',
    edited: false,
    isEditing: false,
    userListModalShown: false,
    commentsLoaded: false,
    commentsShown: false,
    confirmModalShown: false,
    twoStarSelected: false,
    xpRewardInterfaceShown: false
  }

  async componentDidMount() {
    const {
      autoShowComments,
      onShowComments,
      contentObj: { rootType, type, contentId, isReply }
    } = this.props
    if (autoShowComments) {
      this.setState({ commentsShown: true })
      await onShowComments({
        rootType,
        type,
        contentId,
        commentLength: 0,
        isReply
      })
      this.setState({ commentsLoaded: true })
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.contentObj.id !== this.props.contentObj.id ||
      prevProps.type !== this.props.type
    ) {
      this.setState({ commentsShown: false })
    }
    if (prevProps.contentObj.content !== this.props.contentObj.content) {
      this.setState({ edited: true })
    }
    if (prevProps.myId !== this.props.myId) {
      this.setState({ xpRewardInterfaceShown: false })
    }
  }

  render() {
    const {
      contentObj,
      contentObj: {
        actualDescription,
        actualTitle,
        contentId,
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
      autoShowComments,
      authLevel,
      canDelete,
      canEdit,
      canStar,
      inputAtBottom,
      myId,
      attachedVideoShown,
      onAttachStar,
      onCommentSubmit,
      onDeleteComment,
      onDeleteContent,
      onEditComment,
      onEditContent,
      onEditRewardComment,
      onLikeComment,
      onLoadMoreReplies
    } = this.props
    const {
      autoFocusWhenCommentShown,
      edited,
      userListModalShown,
      confirmModalShown,
      commentsLoaded,
      commentsShown,
      isEditing,
      xpRewardInterfaceShown
    } = this.state
    let userLikedThis = false
    for (let i = 0; i < likes.length; i++) {
      if (likes[i].userId === myId) userLikedThis = true
    }

    const userIsUploader = myId === uploader.id
    const userCanEditThis =
      (canEdit || canDelete) && authLevel > uploader.authLevel
    const userCanStarThis = canStar && authLevel > uploader.authLevel
    const editButtonShown = userIsUploader || userCanEditThis
    const editMenuItems = []
    if (userIsUploader || canEdit) {
      editMenuItems.push({
        label: 'Edit',
        onClick: () => this.setState({ isEditing: true })
      })
    }
    if (userIsUploader || canDelete) {
      editMenuItems.push({
        label: 'Remove',
        onClick: () => this.setState({ confirmModalShown: true })
      })
    }
    return (
      <ErrorBoundary>
        <div>
          {confirmModalShown && (
            <ConfirmModal
              onConfirm={() => onDeleteContent({ type, contentId })}
              onHide={() => this.setState({ confirmModalShown: false })}
              title={`Remove ${type.charAt(0).toUpperCase() + type.slice(1)}`}
            />
          )}
          {type === 'comment' &&
            attachedVideoShown && (
              <VideoPlayer
                stretch
                autoplay
                isStarred={!!rootObj.isStarred}
                title={rootObj.title}
                style={{ marginBottom: '1rem' }}
                hasHqThumb={rootObj.hasHqThumb}
                videoId={rootId}
                videoCode={rootObj.content}
              />
            )}
          {type === 'comment' &&
            (commentId || replyId || discussionId) && (
              <TargetContent
                targetObj={targetObj}
                rootObj={rootObj}
                myId={myId}
                rootId={rootId}
                rootType={rootType}
                panelId={feedId}
              />
            )}
          <MainContent
            contentId={contentId}
            contentObj={contentObj}
            type={type}
            contentTitle={title || rootObj.title}
            isEditing={isEditing}
            onEditContent={onEditContent}
            onEditDismiss={() => this.setState({ isEditing: false })}
            rootObj={rootObj}
            rootType={rootType}
            urlRelated={
              edited
                ? {}
                : { thumbUrl, actualTitle, actualDescription, siteUrl }
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
                    <Fragment>
                      <LikeButton
                        key="likeButton"
                        onClick={this.onLikeClick}
                        liked={userLikedThis}
                        small
                      />
                      <Button
                        transparent
                        key="commentButton"
                        style={{ marginLeft: '1rem' }}
                        onClick={this.onCommentButtonClick}
                      >
                        <span className="glyphicon glyphicon-comment" />&nbsp;
                        {type === 'video' || type === 'url'
                          ? 'Comment'
                          : type === 'question'
                            ? 'Answer'
                            : 'Reply'}&nbsp;
                        {numChildComments > 0 && !commentsShown
                          ? `(${numChildComments})`
                          : ''}
                      </Button>
                    </Fragment>
                  )}
                  {type === 'discussion' && (
                    <Button transparent onClick={this.onCommentButtonClick}>
                      <span className="glyphicon glyphicon-comment" />&nbsp;
                      Answer{!!numChildComments &&
                      numChildComments > 0 &&
                      !commentsShown
                        ? ` (${numChildComments})`
                        : ''}
                    </Button>
                  )}
                  {editButtonShown && (
                    <DropdownButton
                      transparent
                      direction="right"
                      shape="button"
                      style={{ marginLeft: '0.5rem', display: 'inline-block' }}
                      size={type !== 'discussion' ? 'sm' : null}
                      text="Edit"
                      menuProps={editMenuItems}
                    />
                  )}
                  {canStar &&
                    userCanStarThis &&
                    (type !== 'discussion' && type !== 'question') &&
                    !userIsUploader && (
                      <Button
                        love
                        disabled={this.determineXpButtonDisabled()}
                        style={{ marginLeft: '1rem' }}
                        onClick={() =>
                          this.setState({ xpRewardInterfaceShown: true })
                        }
                      >
                        <span className="glyphicon glyphicon-star" />{' '}
                        {this.determineXpButtonDisabled() || 'Reward'}
                      </Button>
                    )}
                </div>
                <div className="right">
                  {canStar &&
                    type === 'video' && (
                      <StarButton
                        isStarred={!!isStarred}
                        onClick={this.onStarButtonClick}
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
                {views > 10 &&
                  type === 'video' && (
                    <div
                      style={{
                        fontWeight: 'bold',
                        fontSize: '1.7rem'
                      }}
                    >
                      {views} view{`${views > 1 ? 's' : ''}`}
                    </div>
                  )}
              </div>
            </div>
          )}
          {xpRewardInterfaceShown && (
            <XPRewardInterface
              contentType={type}
              contentId={contentId}
              uploaderId={uploader.id}
              stars={stars}
              onRewardSubmit={data => {
                this.setState({ xpRewardInterfaceShown: false })
                onAttachStar(data)
              }}
            />
          )}
          <RewardStatus
            contentType={type}
            onCommentEdit={onEditRewardComment}
            stars={stars}
            uploaderName={uploader.username}
          />
          {commentsShown && (
            <Comments
              autoFocus={autoFocusWhenCommentShown}
              autoShowComments={autoShowComments}
              comments={childComments}
              commentsLoaded={commentsLoaded}
              contentId={contentId}
              inputAreaInnerRef={ref => {
                this.CommentInputArea = ref
              }}
              inputAtBottom={inputAtBottom}
              loadMoreButton={commentsLoadMoreButton}
              loadMoreComments={this.loadMoreComments}
              inputTypeLabel={
                type === 'comment'
                  ? 'reply'
                  : type === 'question'
                    ? 'answer'
                    : 'comment'
              }
              onAttachStar={onAttachStar}
              onCommentSubmit={onCommentSubmit}
              onDelete={onDeleteComment}
              onEditDone={onEditComment}
              onLikeClick={onLikeComment}
              onLoadMoreReplies={onLoadMoreReplies}
              onReplySubmit={onCommentSubmit}
              onRewardCommentEdit={onEditRewardComment}
              parent={contentObj}
              style={{ padding: '1rem', paddingTop: 0 }}
              userId={myId}
            />
          )}
          {userListModalShown && (
            <UserListModal
              onHide={() => this.setState({ userListModalShown: false })}
              title={`People who liked this ${type}`}
              users={likes}
              description="(You)"
            />
          )}
        </div>
      </ErrorBoundary>
    )
  }

  determineXpButtonDisabled = () => {
    const {
      contentObj: { stars },
      myId
    } = this.props
    const { xpRewardInterfaceShown } = this.state
    return determineXpButtonDisabled({ stars, myId, xpRewardInterfaceShown })
  }

  loadMoreComments = async({ lastCommentId, type, rootType, contentId }) => {
    const {
      contentObj: { commentId },
      onLoadMoreComments
    } = this.props
    await onLoadMoreComments({
      lastCommentId,
      type,
      contentId,
      isReply: !!commentId,
      rootType
    })
  }

  onCommentButtonClick = async() => {
    const {
      contentObj: { type, rootType, contentId, commentId },
      onShowComments
    } = this.props
    const { commentsShown } = this.state
    const isReply = !!commentId
    if (!commentsShown) {
      this.setState({ commentsShown: true, autoFocusWhenCommentShown: true })
      await onShowComments({
        rootType,
        type,
        contentId,
        commentLength: 0,
        isReply
      })
      this.setState({ commentsLoaded: true })
    }
    this.CommentInputArea.focus()
  }

  onLikeClick = async() => {
    const {
      contentObj: { contentId, type, rootType, commentId },
      onLikeComment,
      onLikeQuestion,
      onShowComments,
      onLikeContent
    } = this.props
    const { commentsShown } = this.state
    const isReply = !!commentId
    switch (type) {
      case 'comment':
        onLikeComment(contentId)
        break
      case 'question':
        onLikeQuestion(contentId)
        break
      default:
        onLikeContent(contentId, rootType)
    }
    if (!commentsShown) {
      this.setState({ commentsShown: true })
      onShowComments({
        rootType,
        type,
        contentId,
        commentLength: 0,
        isReply
      })
    }
  }

  onStarButtonClick = () => {
    const {
      contentObj: { contentId },
      onStarVideo
    } = this.props
    onStarVideo(contentId)
  }
}

export default connect(state => ({
  authLevel: state.UserReducer.authLevel,
  canDelete: state.UserReducer.canDelete,
  canEdit: state.UserReducer.canEdit,
  canStar: state.UserReducer.canStar
}))(withContext({ Component: Body, Context }))
