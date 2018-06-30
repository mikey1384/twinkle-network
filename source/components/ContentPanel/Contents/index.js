import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import LikeButton from 'components/Buttons/LikeButton'
import StarButton from 'components/StarButton'
import Button from 'components/Button'
import Likers from 'components/Likers'
import { connect } from 'react-redux'
import UserListModal from 'components/Modals/UserListModal'
import VideoPlayer from 'components/VideoPlayer'
import PanelComments from 'components/PanelComments'
import MainContent from './MainContent'
import TargetContent from './TargetContent'
import DropdownButton from 'components/Buttons/DropdownButton'
import ConfirmModal from 'components/Modals/ConfirmModal'
import XPRewardInterface from 'components/XPRewardInterface'
import RewardStatus from 'components/RewardStatus'
import ErrorBoundary from 'components/Wrappers/ErrorBoundary'
import { determineXpButtonDisabled } from 'helpers/domHelpers'

class Contents extends Component {
  static propTypes = {
    autoShowComments: PropTypes.bool,
    attachedVideoShown: PropTypes.bool,
    authLevel: PropTypes.number,
    canDelete: PropTypes.bool,
    canEdit: PropTypes.bool,
    contentObj: PropTypes.object.isRequired,
    canStar: PropTypes.bool,
    inputAtBottom: PropTypes.bool,
    methods: PropTypes.object.isRequired,
    myId: PropTypes.number,
    type: PropTypes.string
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
      contentObj: { rootType, type, contentId, isReply },
      methods
    } = this.props
    if (autoShowComments) {
      this.setState({ commentsShown: true })
      await methods.showFeedComments({
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
      methods,
      myId,
      attachedVideoShown
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
              onConfirm={() => methods.onContentDelete({ type, contentId })}
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
                contentAvailable={!!targetObj.type}
                targetObj={targetObj}
                rootObj={rootObj}
                myId={myId}
                methods={methods.TargetContent}
                rootId={rootId}
                rootType={rootType}
                panelId={contentId}
              />
            )}
          <MainContent
            contentId={contentId}
            contentObj={contentObj}
            type={type}
            contentTitle={title || rootObj.title}
            isEditing={isEditing}
            onEditContent={methods.onContentEdit}
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
                methods.attachStar(data)
              }}
            />
          )}
          <RewardStatus
            contentType={type}
            onCommentEdit={methods.onRewardCommentEdit}
            stars={stars}
            uploaderName={uploader.username}
          />
          {commentsShown && (
            <PanelComments
              autoFocus={autoFocusWhenCommentShown}
              autoShowComments={autoShowComments}
              commentsLoaded={commentsLoaded}
              inputAreaInnerRef={ref => {
                this.CommentInputArea = ref
              }}
              inputAtBottom={inputAtBottom}
              style={{ padding: '1rem', paddingTop: 0 }}
              inputTypeLabel={
                type === 'comment'
                  ? 'reply'
                  : type === 'question'
                    ? 'answer'
                    : 'comment'
              }
              comments={childComments}
              loadMoreButton={commentsLoadMoreButton}
              userId={myId}
              loadMoreComments={this.loadMoreComments}
              contentId={contentId}
              type={type}
              parent={{
                id: contentId,
                type,
                rootId,
                rootType,
                discussionId,
                commentId,
                replyId
              }}
              onSubmit={methods.onCommentSubmit}
              commentActions={methods.commentActions}
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
      methods,
      contentObj: { commentId }
    } = this.props
    await methods.loadMoreComments({
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
      methods
    } = this.props
    const { commentsShown } = this.state
    const isReply = !!commentId
    if (!commentsShown) {
      this.setState({ commentsShown: true, autoFocusWhenCommentShown: true })
      await methods.showFeedComments({
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
      methods
    } = this.props
    const { commentsShown } = this.state
    const isReply = !!commentId
    switch (type) {
      case 'comment':
        methods.onLikeCommentClick(contentId)
        break
      case 'question':
        methods.onLikeQuestionClick(contentId)
        break
      default:
        methods.onLikeContentClick(contentId, rootType)
    }
    if (!commentsShown) {
      this.setState({ commentsShown: true })
      methods.showFeedComments({
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
      methods,
      contentObj: { contentId }
    } = this.props
    methods.feedVideoStar(contentId)
  }
}

export default connect(state => ({
  authLevel: state.UserReducer.authLevel,
  canDelete: state.UserReducer.canDelete,
  canEdit: state.UserReducer.canEdit,
  canStar: state.UserReducer.canStar
}))(Contents)
