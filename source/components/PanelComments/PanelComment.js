import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { timeSince } from 'helpers/timeStampHelpers'
import DropdownButton from 'components/Buttons/DropdownButton'
import Likers from 'components/Likers'
import UserListModal from 'components/Modals/UserListModal'
import PanelReplies from './PanelReplies'
import ReplyInputArea from './PanelReplies/ReplyInputArea'
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
import { connect } from 'react-redux'
import RewardStatus from 'components/RewardStatus'
import XPRewardInterface from 'components/XPRewardInterface'
import { Link } from 'react-router-dom'

class PanelComment extends Component {
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
      uploaderAuthLevel: PropTypes.number,
      userId: PropTypes.number.isRequired,
      username: PropTypes.string.isRequired
    }).isRequired,
    innerRef: PropTypes.func,
    onDelete: PropTypes.func.isRequired,
    onEditDone: PropTypes.func.isRequired,
    onLikeClick: PropTypes.func.isRequired,
    onLoadMoreReplies: PropTypes.func.isRequired,
    onReplySubmit: PropTypes.func.isRequired,
    onRewardCommentEdit: PropTypes.func.isRequired,
    parent: PropTypes.object,
    type: PropTypes.string,
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
      comment: { replies = [], likes = [], stars = [], uploaderAuthLevel },
      innerRef,
      userId,
      parent,
      type,
      onEditDone,
      onLikeClick,
      onDelete,
      onReplySubmit,
      onRewardCommentEdit,
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
    for (let i = 0; i < likes.length; i++) {
      if (likes[i].userId === userId) userLikedThis = true
    }
    return (
      <div
        className={container}
        ref={ref => {
          this.PanelComment = ref
          innerRef(ref)
        }}
      >
        <div className="content-wrapper">
          <aside>
            <ProfilePic
              style={{ height: '5rem', width: '5rem' }}
              userId={comment.userId}
              profilePicId={comment.profilePicId}
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
              <UsernameText
                className="username"
                user={{
                  username: comment.username,
                  id: comment.userId
                }}
              />{' '}
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
                uploaderId={comment.userId}
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
              uploaderName={comment.username}
            />
            <ReplyInputArea
              innerRef={ref => {
                this.ReplyInputArea = ref
              }}
              style={{
                marginTop:
                  stars.length > 0 || comment.likes.length > 0
                    ? '0.5rem'
                    : '1rem'
              }}
              onSubmit={this.onReplySubmit}
              numReplies={replies.length}
            />
            <PanelReplies
              innerRef={({ ref, replyId }) => (this.Replies[replyId] = ref)}
              Replies={this.Replies}
              userId={userId}
              replies={replies}
              comment={comment}
              parent={parent}
              type={type}
              attachStar={attachStar}
              onDelete={onDelete}
              onLoadMoreReplies={onLoadMoreReplies}
              onLikeClick={onLikeClick}
              onEditDone={onEditDone}
              onReplySubmit={onReplySubmit}
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

  onEditDone = editedComment => {
    const { onEditDone, comment } = this.props
    onEditDone({ editedComment, commentId: comment.id }).then(() =>
      this.setState({ onEdit: false })
    )
  }

  onLikeClick = () => {
    const { comment } = this.props
    this.props.onLikeClick(comment.id)
  }

  onReplyButtonClick = () => {
    this.ReplyInputArea.focus()
  }

  onReplySubmit = replyContent => {
    const { parent, comment, onReplySubmit } = this.props
    this.setState({ replying: true })
    onReplySubmit({ replyContent, comment, parent })
  }

  onDelete = () => {
    const { comment, onDelete } = this.props
    onDelete(comment.id)
  }
}

export default connect(state => ({
  authLevel: state.UserReducer.authLevel,
  canDelete: state.UserReducer.canDelete,
  canEdit: state.UserReducer.canEdit,
  canStar: state.UserReducer.canStar
}))(PanelComment)
