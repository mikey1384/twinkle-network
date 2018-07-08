import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { timeSince } from 'helpers/timeStampHelpers'
import DropdownButton from 'components/Buttons/DropdownButton'
import Likers from 'components/Likers'
import UserListModal from 'components/Modals/UserListModal'
import Replies from './Replies'
import ReplyInputArea from './Replies/ReplyInputArea'
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
import LongText from 'components/Texts/LongText'
import { container } from './Styles'
import RewardStatus from 'components/RewardStatus'
import XPRewardInterface from 'components/XPRewardInterface'
import { Link } from 'react-router-dom'
import { URL } from 'constants/URL'
import request from 'axios'
import { auth, handleError } from 'helpers/apiHelpers'
import { connect } from 'react-redux'

const API_URL = `${URL}/content`

class Comment extends Component {
  static propTypes = {
    attachStar: PropTypes.func,
    authLevel: PropTypes.number,
    canDelete: PropTypes.bool,
    canEdit: PropTypes.bool,
    canStar: PropTypes.bool,
    comment: PropTypes.shape({
      content: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      likes: PropTypes.array.isRequired,
      profilePicId: PropTypes.number,
      replies: PropTypes.array,
      replyId: PropTypes.number,
      stars: PropTypes.array,
      targetUserName: PropTypes.string,
      targetUserId: PropTypes.number,
      timeStamp: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      uploader: PropTypes.object.isRequired
    }).isRequired,
    handleError: PropTypes.func.isRequired,
    innerRef: PropTypes.func,
    onDelete: PropTypes.func.isRequired,
    onEditDone: PropTypes.func.isRequired,
    onLikeClick: PropTypes.func.isRequired,
    onLoadMoreReplies: PropTypes.func.isRequired,
    onReplySubmit: PropTypes.func.isRequired,
    onRewardCommentEdit: PropTypes.func.isRequired,
    parent: PropTypes.object,
    userId: PropTypes.number
  }

  Replies = {}

  state = {
    onEdit: false,
    replying: false,
    userListModalShown: false,
    confirmModalShown: false,
    xpRewardInterfaceShown: false
  }

  componentDidUpdate(prevProps) {
    const {
      comment: { replies = [] }
    } = this.props
    const { replying } = this.state
    if (
      replying &&
      prevProps.comment.replies &&
      replies.length > prevProps.comment.replies.length
    ) {
      this.setState({ replying: false })
      scrollElementToCenter(this.Replies[replies[replies.length - 1].id])
    }
  }

  render() {
    const {
      onEdit,
      userListModalShown,
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
      comment: { replies = [], likes = [], stars = [], uploader },
      innerRef,
      userId,
      parent,
      onEditDone,
      onLikeClick,
      onDelete,
      onRewardCommentEdit,
      onLoadMoreReplies
    } = this.props
    const userIsUploader = uploader.id === userId
    const userCanEditThis =
      (canEdit || canDelete) && authLevel > uploader.authLevel
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
    for (let i = 0; i < likes.length; i++) {
      if (likes[i].userId === userId) userLikedThis = true
    }
    return (
      <div
        className={container}
        ref={ref => {
          this.Comment = ref
          innerRef(ref)
        }}
      >
        <div className="content-wrapper">
          <aside>
            <ProfilePic
              style={{ height: '5rem', width: '5rem' }}
              userId={uploader.id}
              profilePicId={uploader.profilePicId}
            />
          </aside>
          {editButtonShown &&
            !onEdit && (
              <div className="dropdown-wrapper">
                <DropdownButton
                  snow
                  direction="left"
                  icon="pencil"
                  opacity={0.8}
                  menuProps={editMenuItems}
                />
              </div>
            )}
          <section>
            <div>
              <UsernameText className="username" user={uploader} />{' '}
              <small className="timestamp">
                <Link to={`/comments/${comment.id}`}>
                  commented {timeSince(comment.timeStamp)}
                </Link>
              </small>
            </div>
            <div>
              {comment.targetUserId &&
                !!comment.replyId &&
                comment.replyId !== parent.id && (
                  <span className="to">
                    to:{' '}
                    <UsernameText
                      user={{
                        username: comment.targetUserName,
                        id: comment.targetUserId
                      }}
                    />
                  </span>
                )}
              {onEdit ? (
                <EditTextArea
                  autoFocus
                  text={comment.content}
                  onCancel={() => this.setState({ onEdit: false })}
                  onEditDone={this.onEditDone}
                />
              ) : (
                <div>
                  <LongText className="comment__content">
                    {comment.content}
                  </LongText>
                  <div className="comment__buttons">
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
                    {canStar &&
                      userCanEditThis &&
                      !userIsUploader && (
                        <Button
                          love
                          style={{ marginLeft: '1rem' }}
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
                          }) || 'Reward'}
                        </Button>
                      )}
                  </div>
                  <Likers
                    className="comment__likes"
                    userId={userId}
                    likes={comment.likes}
                    onLinkClick={() =>
                      this.setState({ userListModalShown: true })
                    }
                  />
                </div>
              )}
            </div>
            {xpRewardInterfaceShown && (
              <XPRewardInterface
                stars={stars}
                contentType="comment"
                contentId={comment.id}
                uploaderId={uploader.id}
                onRewardSubmit={data => {
                  this.setState({ xpRewardInterfaceShown: false })
                  attachStar(data)
                }}
              />
            )}
            <RewardStatus
              noMarginForEditButton
              onCommentEdit={onRewardCommentEdit}
              style={{
                fontSize: '1.4rem',
                marginTop: comment.likes.length > 0 ? '0.5rem' : '1rem'
              }}
              stars={stars}
              uploaderName={uploader.username}
            />
            <ReplyInputArea
              innerRef={ref => (this.ReplyInputArea = ref)}
              style={{
                marginTop:
                  stars.length > 0 || comment.likes.length > 0
                    ? '0.5rem'
                    : '1rem'
              }}
              onSubmit={this.onReplySubmit}
              numReplies={replies.length}
              rootCommentId={comment.commentId}
              targetCommentId={comment.id}
            />
            <Replies
              innerRef={({ ref, replyId }) => (this.Replies[replyId] = ref)}
              Replies={this.Replies}
              userId={userId}
              replies={replies}
              comment={comment}
              parent={parent}
              attachStar={attachStar}
              onDelete={onDelete}
              onLoadMoreReplies={onLoadMoreReplies}
              onLikeClick={onLikeClick}
              onEditDone={onEditDone}
              onReplySubmit={this.onReplySubmit}
              onRewardCommentEdit={onRewardCommentEdit}
            />
          </section>
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
    const { comment, onDelete } = this.props
    onDelete(comment.id)
  }

  onEditDone = async editedComment => {
    const { handleError, onEditDone, comment } = this.props
    try {
      const { data } = await request.put(
        `${API_URL}/comments`,
        { editedComment, commentId: comment.id },
        auth()
      )
      onEditDone(data)
      this.setState({ onEdit: false })
    } catch (error) {
      handleError(error)
    }
  }

  onLikeClick = async() => {
    const { handleError, onLikeClick, comment } = this.props
    try {
      const {
        data: { likes = [] }
      } = await request.post(
        `${API_URL}/comment/like`,
        { commentId: comment.id },
        auth()
      )
      onLikeClick({ commentId: comment.id, likes })
    } catch (error) {
      handleError(error)
    }
  }

  onReplyButtonClick = () => {
    this.ReplyInputArea.focus()
  }

  onReplySubmit = reply => {
    const { onReplySubmit } = this.props
    this.setState({ replying: true })
    onReplySubmit(reply)
  }
}

export default connect(
  state => ({
    authLevel: state.UserReducer.authLevel,
    canDelete: state.UserReducer.canDelete,
    canEdit: state.UserReducer.canEdit,
    canStar: state.UserReducer.canStar
  }),
  dispatch => ({
    handleError: error => handleError(error, dispatch)
  })
)(Comment)
