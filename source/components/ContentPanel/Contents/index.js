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
import { determineXpButtonDisabled } from 'helpers/domHelpers'

class Contents extends Component {
  static propTypes = {
    attachedVideoShown: PropTypes.bool,
    authLevel: PropTypes.number,
    canDelete: PropTypes.bool,
    canEdit: PropTypes.bool,
    contentObj: PropTypes.object.isRequired,
    canStar: PropTypes.bool,
    methods: PropTypes.object.isRequired,
    myId: PropTypes.number
  }

  state = {
    autoFocusWhenCommentShown: false,
    rewardExplanation: '',
    edited: false,
    isEditing: false,
    userListModalShown: false,
    clickListenerState: false,
    commentsShown: false,
    confirmModalShown: false,
    twoStarSelected: false,
    xpRewardInterfaceShown: false
  }

  componentDidUpdate(prevProps) {
    if (prevProps.contentObj.contentId !== this.props.contentObj.contentId) {
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
      contentObj: {
        uploaderId,
        content,
        contentLikers = [],
        contentId,
        type,
        discussionId,
        hasHqThumb,
        isStarred,
        videoViews,
        numChildComments = 0,
        numChildReplies = 0,
        replyId,
        commentId,
        childComments = [],
        commentsLoadMoreButton = false,
        rootId,
        rootType,
        contentTitle,
        contentDescription,
        rootContent,
        rootContentIsStarred,
        thumbUrl,
        actualTitle,
        actualDescription,
        siteUrl,
        uploaderAuthLevel,
        stars
      },
      authLevel,
      canDelete,
      canEdit,
      canStar,
      contentObj,
      methods,
      myId,
      attachedVideoShown
    } = this.props
    const {
      autoFocusWhenCommentShown,
      edited,
      userListModalShown,
      clickListenerState,
      confirmModalShown,
      commentsShown,
      isEditing,
      xpRewardInterfaceShown
    } = this.state
    let userLikedThis = false
    for (let i = 0; i < contentLikers.length; i++) {
      if (contentLikers[i].userId === myId) userLikedThis = true
    }

    const userIsUploader = myId === uploaderId
    const userCanEditThis =
      (canEdit || canDelete) && authLevel > uploaderAuthLevel
    const userCanStarThis = canStar && authLevel > uploaderAuthLevel
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
              isStarred={!!rootContentIsStarred}
              title={contentTitle}
              style={{ marginBottom: '1em' }}
              hasHqThumb={hasHqThumb}
              videoId={rootId}
              videoCode={rootContent}
            />
          )}
        {type === 'comment' &&
          (commentId || replyId || discussionId) && (
            <TargetContent
              contentObj={contentObj}
              myId={myId}
              methods={methods.TargetContent}
            />
          )}
        <MainContent
          contentId={contentId}
          content={content}
          contentDescription={contentDescription}
          contentTitle={contentTitle}
          hasHqThumb={hasHqThumb}
          isEditing={isEditing}
          isStarred={!!isStarred}
          onEditContent={methods.onContentEdit}
          onEditDismiss={() => this.setState({ isEditing: false })}
          rootId={rootId}
          rootContent={rootContent}
          rootContentIsStarred={!!rootContentIsStarred}
          rootType={rootType}
          urlRelated={
            edited ? {} : { thumbUrl, actualTitle, actualDescription, siteUrl }
          }
          type={type}
        />
        {!isEditing && (
          <div className="bottom-interface">
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
                        : numChildReplies > 0 && !commentsShown
                          ? `(${numChildReplies})`
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
              </div>
              <div className="right">
                {videoViews > 10 &&
                  type === 'video' && (
                    <div
                      style={{
                        fontWeight: 'bold',
                        fontSize: '2rem'
                      }}
                    >
                      {videoViews} view{`${videoViews > 1 ? 's' : ''}`}
                    </div>
                  )}
                {canStar &&
                  type === 'video' && (
                    <StarButton
                      isStarred={!!isStarred}
                      onClick={this.onStarButtonClick}
                      style={{ marginLeft: '1rem' }}
                    />
                  )}
                {type === 'comment' &&
                  canStar &&
                  userCanStarThis &&
                  !userIsUploader && (
                    <Button
                      love
                      disabled={this.determineXpButtonDisabled()}
                      onClick={() =>
                        this.setState({ xpRewardInterfaceShown: true })
                      }
                    >
                      <span className="glyphicon glyphicon-star" />{' '}
                      {this.determineXpButtonDisabled() || 'Reward Stars'}
                    </Button>
                  )}
              </div>
            </div>
            <Likers
              className="content-panel__likers"
              userId={myId}
              likes={contentLikers}
              onLinkClick={() => this.setState({ userListModalShown: true })}
            />
          </div>
        )}
        {xpRewardInterfaceShown && (
          <XPRewardInterface
            contentType={type}
            contentId={contentId}
            uploaderId={uploaderId}
            stars={stars}
            onRewardSubmit={data => {
              this.setState({ xpRewardInterfaceShown: false })
              methods.attachStar(data)
            }}
          />
        )}
        {type === 'comment' && (
          <RewardStatus
            onCommentEdit={methods.onRewardCommentEdit}
            stars={stars}
          />
        )}
        {commentsShown && (
          <PanelComments
            autoFocus={autoFocusWhenCommentShown}
            style={{ padding: '1rem' }}
            clickListenerState={clickListenerState}
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
            users={contentLikers}
            description="(You)"
          />
        )}
      </div>
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

  onCommentButtonClick = () => {
    const {
      contentObj: { type, rootType, contentId, commentId },
      methods
    } = this.props
    const { clickListenerState, commentsShown } = this.state
    const isReply = !!commentId
    if (!commentsShown) {
      this.setState({ commentsShown: true, autoFocusWhenCommentShown: true })
      return methods.showFeedComments({
        rootType,
        type,
        contentId,
        commentLength: 0,
        isReply
      })
    }
    this.setState({ clickListenerState: !clickListenerState })
  }

  onLikeClick = () => {
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
