import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { timeSince } from 'helpers/timeStampHelpers'
import { cleanString } from 'helpers/stringHelpers'
import DropdownButton from 'components/Buttons/DropdownButton'
import Likers from 'components/Likers'
import UserListModal from 'components/Modals/UserListModal'
import ReplyInputArea from './Replies/ReplyInputArea'
import Replies from './Replies'
import EditTextArea from 'components/Texts/EditTextArea'
import UsernameText from 'components/Texts/UsernameText'
import ProfilePic from 'components/ProfilePic'
import Button from 'components/Button'
import LikeButton from 'components/Buttons/LikeButton'
import {
  determineXpButtonDisabled,
  scrollElementToCenter
} from 'helpers/domHelpers'
import ConfirmModal from 'components/Modals/ConfirmModal'
import { Color } from 'constants/css'
import LongText from 'components/Texts/LongText'
import { connect } from 'react-redux'
import RewardStatus from 'components/RewardStatus'
import { attachStar, editRewardComment } from 'redux/actions/VideoActions'
import XPRewardInterface from 'components/XPRewardInterface'

class Comment extends Component {
  static propTypes = {
    attachStar: PropTypes.func,
    authLevel: PropTypes.number,
    canDelete: PropTypes.bool,
    canEdit: PropTypes.bool,
    canStar: PropTypes.bool,
    comment: PropTypes.shape({
      content: PropTypes.string.isRequired,
      discussionTitle: PropTypes.string,
      likes: PropTypes.array.isRequired,
      profilePicId: PropTypes.number,
      replies: PropTypes.array.isRequired,
      stars: PropTypes.array,
      timeStamp: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      uploaderAuthLevel: PropTypes.number,
      userId: PropTypes.number.isRequired,
      username: PropTypes.string.isRequired
    }).isRequired,
    commentId: PropTypes.number.isRequired,
    deleteCallback: PropTypes.func.isRequired,
    deleteListenerToggle: PropTypes.bool,
    editRewardComment: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    lastDeletedCommentIndex: PropTypes.number,
    marginTop: PropTypes.bool,
    onDelete: PropTypes.func.isRequired,
    onEditDone: PropTypes.func.isRequired,
    onLikeClick: PropTypes.func.isRequired,
    onLoadMoreReplies: PropTypes.func.isRequired,
    onReplySubmit: PropTypes.func.isRequired,
    userId: PropTypes.number,
    videoId: PropTypes.number.isRequired
  }

  state = {
    replyInputShown: false,
    onEdit: false,
    userListModalShown: false,
    clickListenerState: false,
    confirmModalShown: false,
    xpRewardInterfaceShown: false
  }

  componentDidUpdate(prevProps) {
    if (prevProps.deleteListenerToggle !== this.props.deleteListenerToggle) {
      if (this.props.lastDeletedCommentIndex - 1 === this.props.index) {
        scrollElementToCenter(this.Comment)
      }
    }
  }

  render() {
    const {
      replyInputShown,
      onEdit,
      userListModalShown,
      clickListenerState,
      confirmModalShown,
      xpRewardInterfaceShown
    } = this.state
    const {
      attachStar,
      authLevel,
      canDelete,
      canEdit,
      canStar,
      comment,
      comment: { stars = [], uploaderAuthLevel },
      editRewardComment,
      userId,
      commentId,
      videoId,
      onEditDone,
      onLoadMoreReplies
    } = this.props
    const userIsUploader = comment.userId === userId
    const userCanEditThis =
      (canEdit || canDelete) && authLevel > uploaderAuthLevel
    const editButtonShown = userIsUploader || userCanEditThis
    const editMenuItems = []
    if (userIsUploader || canEdit) {
      editMenuItems.push({
        label: 'Edit',
        onClick: () => this.setState({ onEdit: true })
      })
    }
    if (userIsUploader || canDelete) {
      editMenuItems.push({
        label: 'Remove',
        onClick: () => this.setState({ confirmModalShown: true })
      })
    }
    let userLikedThis = false
    for (let i = 0; i < comment.likes.length; i++) {
      if (comment.likes[i].userId === userId) userLikedThis = true
    }
    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-start',
          marginTop: this.props.marginTop && '2rem',
          position: 'relative'
        }}
        ref={ref => {
          this.Comment = ref
        }}
      >
        <div
          style={{ width: '10rem', display: 'flex', justifyContent: 'center' }}
        >
          <ProfilePic
            style={{ width: '8rem', height: '8rem' }}
            userId={comment.userId}
            profilePicId={comment.profilePicId}
          />
        </div>
        <div
          style={{
            marginLeft: '1.5rem',
            display: 'flex',
            width: '100%',
            flexDirection: 'column'
          }}
        >
          <div>
            <UsernameText
              user={{
                name: comment.username,
                id: comment.userId
              }}
              style={{ fontSize: '2.5rem' }}
            />{' '}
            <small style={{ color: Color.gray() }}>
              &nbsp;{timeSince(comment.timeStamp)}
            </small>
          </div>
          {onEdit ? (
            <EditTextArea
              autoFocus
              text={comment.content}
              onCancel={() => this.setState({ onEdit: false })}
              onEditDone={this.onEditDone}
            />
          ) : (
            <div>
              {comment.discussionTitle && (
                <div
                  style={{
                    color: Color.green(),
                    fontWeight: 'bold'
                  }}
                >
                  {cleanString(comment.discussionTitle)}
                </div>
              )}
              <LongText
                style={{
                  width: '100%',
                  margin: '1rem 0 2rem 0',
                  paddingBottom: '1rem',
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'break-word',
                  wordBreak: 'break-word'
                }}
              >
                {comment.content}
              </LongText>
              <RewardStatus onCommentEdit={editRewardComment} stars={stars} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{ display: 'flex' }}>
                    <LikeButton
                      onClick={this.onLikeClick}
                      liked={userLikedThis}
                    />
                    <Button
                      transparent
                      style={{ marginLeft: '1rem' }}
                      onClick={this.onReplyButtonClick}
                    >
                      <span className="glyphicon glyphicon-comment" /> Reply
                    </Button>
                  </div>
                  <div>
                    <Likers
                      style={{
                        fontSize: '1.2rem',
                        marginTop: '0.5rem',
                        fontWeight: 'bold',
                        color: Color.darkGray()
                      }}
                      userId={userId}
                      likes={comment.likes}
                      onLinkClick={() =>
                        this.setState({ userListModalShown: true })
                      }
                    />
                  </div>
                </div>
                <div>
                  {canStar &&
                    userCanEditThis &&
                    !userIsUploader && (
                      <Button
                        love
                        onClick={() =>
                          this.setState({ xpRewardInterfaceShown: true })
                        }
                        disabled={determineXpButtonDisabled({
                          myId: userId,
                          xpRewardInterfaceShown,
                          stars
                        })}
                      >
                        <span className="glyphicon glyphicon-star" />
                        &nbsp;{determineXpButtonDisabled({
                          myId: userId,
                          xpRewardInterfaceShown,
                          stars
                        }) || 'Reward Stars'}
                      </Button>
                    )}
                </div>
              </div>
            </div>
          )}
          {xpRewardInterfaceShown && (
            <XPRewardInterface
              stars={stars}
              contentType="comment"
              contentId={comment.id}
              uploaderId={comment.userId}
              onRewardSubmit={data => {
                this.setState({ xpRewardInterfaceShown: false })
                attachStar(data)
              }}
            />
          )}
          <Replies
            onLoadMoreReplies={onLoadMoreReplies}
            userId={userId}
            comment={comment}
            replies={comment.replies}
            commentId={commentId}
            videoId={videoId}
            onEditDone={onEditDone}
            onReplySubmit={this.props.onReplySubmit}
            onLikeClick={replyId => this.props.onLikeClick(replyId)}
            onDelete={replyId => this.props.onDelete(replyId)}
          />
          {replyInputShown && (
            <ReplyInputArea
              style={{ marginTop: comment.replies.length === 0 ? 0 : '1rem' }}
              clickListenerState={clickListenerState}
              onSubmit={this.onReplySubmit}
            />
          )}
          {editButtonShown &&
            !onEdit && (
              <DropdownButton
                snow
                direction="left"
                opacity={0.8}
                icon="pencil"
                style={{
                  position: 'absolute',
                  right: 0
                }}
                menuProps={editMenuItems}
              />
            )}
        </div>
        {userListModalShown && (
          <UserListModal
            onHide={() => this.setState({ userListModalShown: false })}
            title="People who liked this comment"
            users={comment.likes}
            description="(You)"
          />
        )}
        {confirmModalShown && (
          <ConfirmModal
            onHide={() => this.setState({ confirmModalShown: false })}
            title="Remove Comment"
            onConfirm={this.onDelete}
          />
        )}
      </div>
    )
  }

  onDelete = () => {
    const { deleteCallback, onDelete, index, commentId } = this.props
    deleteCallback(index)
    onDelete(commentId)
  }

  onEditDone = editedComment => {
    const { commentId, onEditDone } = this.props
    return onEditDone({ editedComment, commentId }).then(() =>
      this.setState({ onEdit: false })
    )
  }

  onLikeClick = () => {
    const { commentId } = this.props
    this.props.onLikeClick(commentId)
  }

  onReplyButtonClick = () => {
    const { replyInputShown, clickListenerState } = this.state
    if (!replyInputShown) {
      return this.setState({ replyInputShown: true })
    }
    this.setState({ clickListenerState: !clickListenerState })
  }

  onReplySubmit = reply => {
    const { commentId, videoId } = this.props
    this.props.onReplySubmit({ reply, commentId, videoId })
  }
}

export default connect(
  state => ({
    authLevel: state.UserReducer.authLevel,
    canDelete: state.UserReducer.canDelete,
    canEdit: state.UserReducer.canEdit,
    canStar: state.UserReducer.canStar
  }),
  {
    attachStar,
    editRewardComment
  }
)(Comment)
