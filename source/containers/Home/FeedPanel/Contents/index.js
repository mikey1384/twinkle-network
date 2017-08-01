import PropTypes from 'prop-types'
import React, {Component} from 'react'
import LikeButton from 'components/LikeButton'
import Button from 'components/Button'
import Likers from 'components/Likers'
import {connect} from 'react-redux'
import {
  showFeedCommentsAsync,
  loadMoreFeedCommentsAsync,
  uploadFeedComment,
  feedCommentDelete,
  feedContentDelete,
  commentFeedLike,
  feedCommentEdit,
  uploadFeedReply,
  loadMoreFeedReplies,
  contentFeedLike
} from 'redux/actions/FeedActions'
import UserListModal from 'components/Modals/UserListModal'
import VideoPlayer from 'components/VideoPlayer'
import PanelComments from 'components/PanelComments'
import MainContent from './MainContent'
import TargetContent from './TargetContent'
import {Color} from 'constants/css'
import DropdownButton from 'components/DropdownButton'
import ConfirmModal from 'components/Modals/ConfirmModal'

class Contents extends Component {
  static propTypes = {
    attachedVideoShown: PropTypes.bool,
    feed: PropTypes.object.isRequired,
    loadMoreComments: PropTypes.func.isRequired,
    myId: PropTypes.number,
    onCommentDelete: PropTypes.func.isRequired,
    onContentDelete: PropTypes.func.isRequired,
    onEditDone: PropTypes.func.isRequired,
    onLikeCommentClick: PropTypes.func.isRequired,
    onLikeContentClick: PropTypes.func.isRequired,
    onLoadMoreReplies: PropTypes.func.isRequired,
    onReplySubmit: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    showFeedComments: PropTypes.func.isRequired
  }

  constructor() {
    super()
    this.state = {
      isEditing: false,
      userListModalShown: false,
      clickListenerState: false,
      commentsShown: false,
      confirmModalShown: false
    }
    this.onLikeClick = this.onLikeClick.bind(this)
    this.onCommentButtonClick = this.onCommentButtonClick.bind(this)
    this.loadMoreComments = this.loadMoreComments.bind(this)
  }

  render() {
    const {
      feed: {
        uploaderId, content, contentLikers = [], contentId, type, discussionId, hasHqThumb, videoViews,
        numChildComments = 0, numChildReplies = 0, replyId, commentId, childComments,
        commentsLoadMoreButton, rootId, rootType, contentTitle, contentDescription,
        rootContent, thumbUrl, actualTitle, actualDescription, siteUrl
      }, feed, myId, attachedVideoShown, onEditDone, onLikeCommentClick, onLoadMoreReplies,
      onCommentDelete, onContentDelete, onReplySubmit, onSubmit
    } = this.props
    const {userListModalShown, clickListenerState, confirmModalShown, commentsShown, isEditing} = this.state
    let userLikedThis = false
    for (let i = 0; i < contentLikers.length; i++) {
      if (contentLikers[i].userId === myId) userLikedThis = true
    }
    return (
      <div>
        {confirmModalShown &&
          <ConfirmModal
            onConfirm={() => onContentDelete({type, contentId})}
            onHide={() => this.setState({confirmModalShown: false})}
            title={`Remove ${type.charAt(0).toUpperCase() + type.slice(1)}`}
          />
        }
        <div>
          {type === 'comment' && attachedVideoShown &&
            <VideoPlayer
              autoplay
              title={contentTitle}
              style={{marginBottom: '1em'}}
              containerClassName="embed-responsive embed-responsive-16by9"
              className="embed-responsive-item"
              hasHqThumb={hasHqThumb}
              videoId={rootId}
              videoCode={rootContent}
            />
          }
          {type === 'comment' && (commentId || replyId || discussionId) &&
            <TargetContent
              feed={feed}
              myId={myId}
            />
          }
          <MainContent
            contentId={contentId}
            content={content}
            contentDescription={contentDescription}
            contentTitle={contentTitle}
            hasHqThumb={hasHqThumb}
            isEditing={isEditing}
            onEditDismiss={() => this.setState({isEditing: false})}
            rootId={rootId}
            rootContent={rootContent}
            rootType={rootType}
            urlRelated={{thumbUrl, actualTitle, actualDescription, siteUrl}}
            type={type}
            videoViews={videoViews}
          />
        </div>
        {!isEditing &&
          <div style={{paddingTop: type === 'video' ? '2em' : '1.5em'}}>
            {type !== 'discussion' &&
              [<LikeButton
                key="likeButton"
                onClick={this.onLikeClick}
                liked={userLikedThis}
                small
              />,
              <Button
                key="commentButton"
                style={{marginLeft: '0.5em'}}
                className="btn btn-warning btn-sm"
                onClick={this.onCommentButtonClick}
              >
                <span className="glyphicon glyphicon-comment"></span>&nbsp;
                {type === 'video' ? 'Comment' : 'Reply'}&nbsp;
                {numChildComments > 0 && !commentsShown ? `(${numChildComments})` :
                  (numChildReplies > 0 && !commentsShown ? `(${numChildReplies})` : '')
                }
              </Button>]
            }
            {type === 'discussion' &&
              <Button
                className="btn btn-warning"
                onClick={this.onCommentButtonClick}
              >
                Answer{!!numChildComments && numChildComments > 0 && !commentsShown ? ` (${numChildComments})` : ''}
              </Button>
            }
            {myId === uploaderId &&
              <DropdownButton
                noAlign
                shape="button"
                style={{marginLeft: '0.5em'}}
                size={type !== 'discussion' ? 'sm' : null}
                text="Edit"
                menuProps={[
                  {
                    label: 'Edit',
                    onClick: () => this.setState({isEditing: true})
                  },
                  {
                    label: 'Remove',
                    onClick: () => this.setState({confirmModalShown: true})
                  }
                ]}
              />
            }
            <Likers
              style={{
                fontSize: '11px',
                marginTop: '1em',
                fontWeight: 'bold',
                color: Color.green
              }}
              userId={myId}
              likes={contentLikers}
              onLinkClick={() => this.setState({userListModalShown: true})}
            />
          </div>
        }
        {commentsShown &&
          <PanelComments
            autoFocus
            clickListenerState={clickListenerState}
            inputTypeLabel={type === 'comment' ? 'reply' : 'comment'}
            comments={childComments}
            loadMoreButton={commentsLoadMoreButton}
            userId={myId}
            loadMoreComments={this.loadMoreComments}
            onSubmit={onSubmit}
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
            commentActions={{
              onDelete: onCommentDelete,
              onLikeClick: onLikeCommentClick,
              onEditDone,
              onReplySubmit,
              onLoadMoreReplies
            }}
          />
        }
        {userListModalShown &&
          <UserListModal
            onHide={() => this.setState({userListModalShown: false})}
            title={`People who liked this ${type}`}
            users={contentLikers}
            description="(You)"
          />
        }
      </div>
    )
  }

  loadMoreComments(lastCommentId, type, contentId) {
    const {loadMoreComments, feed: {commentId}} = this.props
    loadMoreComments(lastCommentId, type, contentId, !!commentId)
  }

  onCommentButtonClick() {
    const {feed: {type, rootType, contentId, commentId}, showFeedComments} = this.props
    const {clickListenerState, commentsShown} = this.state
    const isReply = !!commentId
    if (!commentsShown) {
      this.setState({commentsShown: true})
      return showFeedComments({rootType, type, contentId, commentLength: 0, isReply})
    }
    this.setState({clickListenerState: !clickListenerState})
  }

  onLikeClick() {
    const {feed: {contentId, type, rootType}} = this.props
    if (type === 'comment') {
      this.props.onLikeCommentClick(contentId)
    } else {
      this.props.onLikeContentClick(contentId, rootType)
    }
  }
}

export default connect(
  null,
  {
    showFeedComments: showFeedCommentsAsync,
    loadMoreComments: loadMoreFeedCommentsAsync,
    onSubmit: uploadFeedComment,
    onCommentDelete: feedCommentDelete,
    onContentDelete: feedContentDelete,
    onEditDone: feedCommentEdit,
    onReplySubmit: uploadFeedReply,
    onLoadMoreReplies: loadMoreFeedReplies,
    onLikeCommentClick: commentFeedLike,
    onLikeContentClick: contentFeedLike
  }
)(Contents)
