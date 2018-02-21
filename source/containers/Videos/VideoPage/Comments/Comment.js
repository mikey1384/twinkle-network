import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { timeSince } from 'helpers/timeStampHelpers'
import { cleanString } from 'helpers/stringHelpers'
import DropdownButton from 'components/DropdownButton'
import Likers from 'components/Likers'
import UserListModal from 'components/Modals/UserListModal'
import ReplyInputArea from './Replies/ReplyInputArea'
import Replies from './Replies'
import EditTextArea from 'components/Texts/EditTextArea'
import UsernameText from 'components/Texts/UsernameText'
import ProfilePic from 'components/ProfilePic'
import Button from 'components/Button'
import LikeButton from 'components/LikeButton'
import { scrollElementToCenter } from 'helpers/domHelpers'
import ConfirmModal from 'components/Modals/ConfirmModal'
import { Color } from 'constants/css'
import LongText from 'components/Texts/LongText'
import { connect } from 'react-redux'

class Comment extends Component {
  static propTypes = {
    comment: PropTypes.shape({
      content: PropTypes.string.isRequired,
      discussionTitle: PropTypes.string,
      likes: PropTypes.array.isRequired,
      profilePicId: PropTypes.number,
      replies: PropTypes.array.isRequired,
      timeStamp: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      userId: PropTypes.number.isRequired,
      username: PropTypes.string.isRequired
    }).isRequired,
    commentId: PropTypes.number.isRequired,
    deleteCallback: PropTypes.func.isRequired,
    deleteListenerToggle: PropTypes.bool,
    index: PropTypes.number.isRequired,
    isCreator: PropTypes.bool,
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
    this.onDelete = this.onDelete.bind(this)
    this.onEditDone = this.onEditDone.bind(this)
    this.onLikeClick = this.onLikeClick.bind(this)
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
      confirmModalShown
    } = this.state
    const {
      comment,
      isCreator,
      userId,
      commentId,
      videoId,
      onEditDone,
      onLoadMoreReplies
    } = this.props
    const userIsOwner = comment.userId === userId || isCreator
    let userLikedThis = false
    for (let i = 0; i < comment.likes.length; i++) {
      if (comment.likes[i].userId === userId) userLikedThis = true
    }
    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          marginTop: this.props.marginTop && '2rem',
          position: 'relative'
        }}
        ref={ref => {
          this.Comment = ref
        }}
      >
        <div style={{ width: '10%', height: '10%' }}>
          <ProfilePic
            style={{ width: '80%', height: '80%' }}
            userId={comment.userId}
            profilePicId={comment.profilePicId}
          />
        </div>
        <div
          style={{ width: '90%', display: 'flex', flexDirection: 'column' }}
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
            <div style={{ width: '100%' }}>
              {!!comment.discussionTitle && (
                <div
                  style={{
                    color: Color.blue(),
                    fontWeight: 'bold',
                    marginBottom: '0.5em'
                  }}
                >
                  {cleanString(comment.discussionTitle)}
                </div>
              )}
              <LongText
                style={{
                  width: '100%',
                  marginLeft: '0px',
                  paddingBottom: '1em',
                  wordWrap: 'break-word'
                }}
              >
                {comment.content}
              </LongText>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <div className="pull-left">
                  <LikeButton
                    onClick={this.onLikeClick}
                    liked={userLikedThis}
                    small
                  />
                  <Button
                    style={{ marginLeft: '0.5em' }}
                    className="btn btn-warning btn-sm"
                    onClick={this.onReplyButtonClick}
                  >
                    <span className="glyphicon glyphicon-comment" /> Reply
                  </Button>
                </div>
                <small>
                  <Likers
                    className="pull-left"
                    style={{
                      fontWeight: 'bold',
                      marginLeft: '0.8em',
                      color: Color.green(),
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
          <Replies
            isCreator={isCreator}
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
              style={{ marginTop: comment.replies.length === 0 && '0px' }}
              clickListenerState={clickListenerState}
              onSubmit={this.onReplySubmit}
            />
          )}
          {userIsOwner &&
            !onEdit && (
              <DropdownButton
                opacity={0.8}
                shape="button"
                icon="pencil"
                style={{
                  position: 'absolute',
                  right: 0
                }}
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

  onDelete() {
    const { deleteCallback, onDelete, index, commentId } = this.props
    deleteCallback(index)
    onDelete(commentId)
  }

  onEditDone(editedComment) {
    const { commentId, onEditDone } = this.props
    return onEditDone({ editedComment, commentId }).then(() =>
      this.setState({ onEdit: false })
    )
  }

  onLikeClick() {
    const { commentId } = this.props
    this.props.onLikeClick(commentId)
  }

  onReplyButtonClick() {
    const { replyInputShown, clickListenerState } = this.state
    if (!replyInputShown) {
      return this.setState({ replyInputShown: true })
    }
    this.setState({ clickListenerState: !clickListenerState })
  }

  onReplySubmit(reply) {
    const { commentId, videoId } = this.props
    this.props.onReplySubmit({ reply, commentId, videoId })
  }
}

export default connect(state => ({ isCreator: state.UserReducer.isCreator }))(
  Comment
)
