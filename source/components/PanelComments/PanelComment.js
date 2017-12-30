import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { timeSince } from 'helpers/timeStampHelpers'
import DropdownButton from 'components/DropdownButton'
import Likers from 'components/Likers'
import { Color } from 'constants/css'
import UserListModal from 'components/Modals/UserListModal'
import PanelReplies from './PanelReplies'
import ReplyInputArea from './PanelReplies/ReplyInputArea'
import EditTextArea from 'components/Texts/EditTextArea'
import UsernameText from 'components/Texts/UsernameText'
import ProfilePic from 'components/ProfilePic'
import Button from 'components/Button'
import LikeButton from 'components/LikeButton'
import { scrollElementToCenter } from 'helpers/domHelpers'
import ConfirmModal from 'components/Modals/ConfirmModal'
import LongText from 'components/Texts/LongText'
import { connect } from 'react-redux'

class PanelComment extends Component {
  static propTypes = {
    comment: PropTypes.shape({
      content: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      likes: PropTypes.array.isRequired,
      profilePicId: PropTypes.number,
      replies: PropTypes.array.isRequired,
      replyId: PropTypes.number,
      targetUserName: PropTypes.string,
      targetUserId: PropTypes.number,
      timeStamp: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      userId: PropTypes.number.isRequired,
      username: PropTypes.string.isRequired
    }).isRequired,
    deleteCallback: PropTypes.func.isRequired,
    deleteListenerToggle: PropTypes.bool,
    index: PropTypes.number,
    isCreator: PropTypes.bool,
    isFirstComment: PropTypes.bool,
    lastDeletedCommentIndex: PropTypes.number,
    onDelete: PropTypes.func.isRequired,
    onEditDone: PropTypes.func.isRequired,
    onLikeClick: PropTypes.func.isRequired,
    onLoadMoreReplies: PropTypes.func.isRequired,
    onReplySubmit: PropTypes.func.isRequired,
    parent: PropTypes.object,
    type: PropTypes.string,
    userId: PropTypes.number
  }

  constructor() {
    super()
    this.state = {
      replyInputShown: false,
      onEdit: false,
      userListModalShown: false,
      clickListenerState: false,
      confirmModalShown: false
    }
    this.onReplyButtonClick = this.onReplyButtonClick.bind(this)
    this.onReplySubmit = this.onReplySubmit.bind(this)
    this.onEditDone = this.onEditDone.bind(this)
    this.onLikeClick = this.onLikeClick.bind(this)
    this.onDelete = this.onDelete.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.deleteListenerToggle !== this.props.deleteListenerToggle) {
      if (this.props.lastDeletedCommentIndex - 1 === this.props.index) {
        scrollElementToCenter(this.PanelComment)
      }
    }
  }

  render() {
    const {
      replyInputShown,
      onEdit,
      userListModalShown,
      clickListenerState,
      confirmModalShown
    } = this.state
    const {
      comment,
      userId,
      parent,
      type,
      onEditDone,
      isCreator,
      onLikeClick,
      onDelete,
      onReplySubmit,
      onLoadMoreReplies
    } = this.props
    const canEdit = comment.userId === userId || isCreator
    let userLikedThis = false
    for (let i = 0; i < comment.likes.length; i++) {
      if (comment.likes[i].userId === userId) userLikedThis = true
    }
    return (
      <div
        style={{ display: 'flex', width: '100%', flexDirection: 'column' }}
        ref={ref => {
          this.PanelComment = ref
        }}
      >
        {canEdit &&
          !onEdit && (
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row-reverse'
              }}
            >
              <DropdownButton
                style={{ position: 'absolute' }}
                shape="button"
                icon="pencil"
                opacity={0.8}
                menuProps={[
                  {
                    label: 'Edit',
                    onClick: () => this.setState({ onEdit: true })
                  },
                  {
                    label: 'Remove',
                    onClick: () => this.setState({ confirmModalShown: true })
                  }
                ]}
              />
            </div>
          )}
        <div style={{ display: 'flex', width: '100%' }}>
          <ProfilePic
            style={{ width: '8%', height: '8%' }}
            userId={comment.userId}
            profilePicId={comment.profilePicId}
          />
          <div style={{ width: '80%', marginLeft: '1.5rem' }}>
            <div>
              <UsernameText
                user={{
                  name: comment.username,
                  id: comment.userId
                }}
              />{' '}
              <small>&nbsp;{timeSince(comment.timeStamp)}</small>
            </div>
            <div>
              {comment.targetUserId &&
                !!comment.replyId &&
                comment.replyId !== parent.id && (
                  <span style={{ color: Color.blue }}>
                    to:{' '}
                    <UsernameText
                      user={{
                        name: comment.targetUserName,
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
                  <LongText style={{ wordBreak: 'break-word' }}>
                    {comment.content}
                  </LongText>
                  <div>
                    <div>
                      <LikeButton
                        onClick={this.onLikeClick}
                        liked={userLikedThis}
                        small
                      />
                      <Button
                        className="btn btn-warning btn-sm"
                        onClick={this.onReplyButtonClick}
                      >
                        <span className="glyphicon glyphicon-comment" /> Reply
                      </Button>
                    </div>
                    <small>
                      <Likers
                        style={{
                          fontWeight: 'bold',
                          marginLeft: '0.8em',
                          color: Color.green,
                          marginTop: '1em'
                        }}
                        userId={userId}
                        likes={comment.likes}
                        onLinkClick={() =>
                          this.setState({ userListModalShown: true })
                        }
                      />
                    </small>
                  </div>
                </div>
              )}
            </div>
            <PanelReplies
              userId={userId}
              replies={comment.replies}
              comment={comment}
              parent={parent}
              type={type}
              onDelete={onDelete}
              onLoadMoreReplies={onLoadMoreReplies}
              onLikeClick={onLikeClick}
              onEditDone={onEditDone}
              onReplySubmit={onReplySubmit}
            />
            {replyInputShown && (
              <ReplyInputArea
                clickListenerState={clickListenerState}
                onSubmit={this.onReplySubmit}
                numReplies={comment.replies.length}
              />
            )}
          </div>
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

  onEditDone(editedComment) {
    const { onEditDone, comment } = this.props
    onEditDone({ editedComment, commentId: comment.id }).then(() =>
      this.setState({ onEdit: false })
    )
  }

  onLikeClick() {
    const { comment } = this.props
    this.props.onLikeClick(comment.id)
  }

  onReplyButtonClick() {
    const { clickListenerState, replyInputShown } = this.state
    if (!replyInputShown) return this.setState({ replyInputShown: true })
    this.setState({ clickListenerState: !clickListenerState })
  }

  onReplySubmit(replyContent) {
    const { parent, comment, onReplySubmit } = this.props
    onReplySubmit({ replyContent, comment, parent })
  }

  onDelete() {
    const {
      comment,
      onDelete,
      index,
      deleteCallback,
      isFirstComment
    } = this.props
    deleteCallback(index, isFirstComment)
    onDelete(comment.id)
  }
}

export default connect(state => ({ isCreator: state.UserReducer.isCreator }))(
  PanelComment
)
