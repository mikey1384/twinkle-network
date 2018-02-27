import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import LikeButton from 'components/LikeButton'
import StarButton from 'components/StarButton'
import Button from 'components/Button'
import Likers from 'components/Likers'
import { connect } from 'react-redux'
import UserListModal from 'components/Modals/UserListModal'
import VideoPlayer from 'components/VideoPlayer'
import PanelComments from 'components/PanelComments'
import MainContent from './MainContent'
import TargetContent from './TargetContent'
import DropdownButton from 'components/DropdownButton'
import ConfirmModal from 'components/Modals/ConfirmModal'

class Contents extends Component {
  static propTypes = {
    attachedVideoShown: PropTypes.bool,
    contentObj: PropTypes.object.isRequired,
    isCreator: PropTypes.bool.isRequired,
    methods: PropTypes.object.isRequired,
    myId: PropTypes.number
  }

  state = {
    autoFocusWhenCommentShown: false,
    isEditing: false,
    userListModalShown: false,
    clickListenerState: false,
    commentsShown: false,
    confirmModalShown: false
  }

  componentDidUpdate(prevProps) {
    if (prevProps.contentObj.contentId !== this.props.contentObj.contentId) {
      this.setState({ commentsShown: false })
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
        siteUrl
      },
      contentObj,
      isCreator,
      methods,
      myId,
      attachedVideoShown
    } = this.props
    const {
      autoFocusWhenCommentShown,
      userListModalShown,
      clickListenerState,
      confirmModalShown,
      commentsShown,
      isEditing
    } = this.state
    let userLikedThis = false
    for (let i = 0; i < contentLikers.length; i++) {
      if (contentLikers[i].userId === myId) userLikedThis = true
    }
    const canEdit = myId === uploaderId || isCreator
    return (
      <div>
        {confirmModalShown && (
          <ConfirmModal
            onConfirm={() => methods.onContentDelete({ type, contentId })}
            onHide={() => this.setState({ confirmModalShown: false })}
            title={`Remove ${type.charAt(0).toUpperCase() + type.slice(1)}`}
          />
        )}
        <div>
          {type === 'comment' &&
            attachedVideoShown && (
              <VideoPlayer
                autoplay
                isStarred={!!rootContentIsStarred}
                title={contentTitle}
                style={{ marginBottom: '1em' }}
                containerClassName="embed-responsive embed-responsive-16by9"
                className="embed-responsive-item"
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
            urlRelated={{ thumbUrl, actualTitle, actualDescription, siteUrl }}
            type={type}
          />
        </div>
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
                      style={{ marginLeft: '0.5rem' }}
                      onClick={this.onCommentButtonClick}
                    >
                      <span className="glyphicon glyphicon-comment" />&nbsp;
                      {type === 'video' || type === 'url'
                        ? 'Comment'
                        : type === 'question' ? 'Answer' : 'Reply'}&nbsp;
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
                {canEdit && (
                  <DropdownButton
                    transparent
                    direction="right"
                    shape="button"
                    style={{ marginLeft: '0.5rem', display: 'inline-block' }}
                    size={type !== 'discussion' ? 'sm' : null}
                    text="Edit"
                    menuProps={[
                      {
                        label: 'Edit',
                        onClick: () => this.setState({ isEditing: true })
                      },
                      {
                        label: 'Remove',
                        onClick: () =>
                          this.setState({ confirmModalShown: true })
                      }
                    ]}
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
                {isCreator &&
                  type === 'video' && (
                    <StarButton
                      isStarred={!!isStarred}
                      onClick={this.onStarButtonClick}
                      style={{ marginLeft: '1rem' }}
                    />
                  )}
              </div>
            </div>
            <Likers
              className="likers"
              userId={myId}
              likes={contentLikers}
              onLinkClick={() => this.setState({ userListModalShown: true })}
            />
          </div>
        )}
        {commentsShown && (
          <PanelComments
            autoFocus={autoFocusWhenCommentShown}
            style={{ marginTop: '1rem' }}
            clickListenerState={clickListenerState}
            inputTypeLabel={
              type === 'comment'
                ? 'reply'
                : type === 'question' ? 'answer' : 'comment'
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

  loadMoreComments = async({ lastCommentId, type, rootType, contentId }) => {
    const { methods, contentObj: { commentId } } = this.props
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
    const { methods, contentObj: { contentId } } = this.props
    methods.feedVideoStar(contentId)
  }
}

export default connect(state => ({ isCreator: state.UserReducer.isCreator }))(
  Contents
)
