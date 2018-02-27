import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { timeSince } from 'helpers/timeStampHelpers'
import DropdownButton from 'components/DropdownButton'
import EditTextArea from 'components/Texts/EditTextArea'
import Likers from 'components/Likers'
import UserListModal from 'components/Modals/UserListModal'
import UsernameText from 'components/Texts/UsernameText'
import ProfilePic from 'components/ProfilePic'
import Button from 'components/Button'
import LikeButton from 'components/LikeButton'
import ReplyInputArea from './ReplyInputArea'
import { scrollElementToCenter } from 'helpers/domHelpers'
import ConfirmModal from 'components/Modals/ConfirmModal'
import LongText from 'components/Texts/LongText'
import { container } from '../Styles'
import { connect } from 'react-redux'

class PanelReply extends Component {
  static propTypes = {
    comment: PropTypes.shape({
      id: PropTypes.number.isRequired
    }),
    deleteCallback: PropTypes.func.isRequired,
    deleteListenerToggle: PropTypes.bool,
    lastDeletedCommentIndex: PropTypes.number,
    index: PropTypes.number,
    onDelete: PropTypes.func.isRequired,
    onEditDone: PropTypes.func.isRequired,
    onLikeClick: PropTypes.func.isRequired,
    onReplySubmit: PropTypes.func.isRequired,
    parent: PropTypes.object,
    reply: PropTypes.shape({
      content: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      likes: PropTypes.array,
      originType: PropTypes.string,
      profilePicId: PropTypes.number,
      replyOfReply: PropTypes.bool,
      targetUserId: PropTypes.number,
      targetUserName: PropTypes.string,
      timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      userId: PropTypes.number.isRequired,
      username: PropTypes.string.isRequired
    }),
    type: PropTypes.string,
    userId: PropTypes.number,
    isCreator: PropTypes.bool
  }

  constructor() {
    super()
    this.state = {
      onEdit: false,
      replyInputShown: false,
      userListModalShown: false,
      confirmModalShown: false,
      clickListenerState: false
    }
    this.onEditDone = this.onEditDone.bind(this)
    this.onLikeClick = this.onLikeClick.bind(this)
    this.onDelete = this.onDelete.bind(this)
    this.onReplySubmit = this.onReplySubmit.bind(this)
    this.onReplyButtonClick = this.onReplyButtonClick.bind(this)
  }

  componentDidMount() {
    const { reply: { replyOfReply, originType }, type } = this.props
    if (replyOfReply && type === originType) {
      scrollElementToCenter(this.PanelReply)
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.deleteListenerToggle !== this.props.deleteListenerToggle) {
      if (this.props.lastDeletedCommentIndex - 1 === this.props.index) {
        scrollElementToCenter(this.PanelReply)
      }
    }
  }

  render() {
    const { comment, isCreator, reply, userId, type } = this.props
    const {
      onEdit,
      userListModalShown,
      replyInputShown,
      confirmModalShown,
      clickListenerState
    } = this.state
    let userLikedThis = false
    for (let i = 0; i < reply.likes.length; i++) {
      if (reply.likes[i].userId === userId) userLikedThis = true
    }
    const canEdit = reply.userId === userId || isCreator
    return (
      <div
        className={container}
        ref={ref => {
          this.PanelReply = ref
        }}
      >
        <div className="content-wrapper">
          <ProfilePic
            style={{ height: '7%', width: '7%' }}
            userId={reply.userId}
            profilePicId={reply.profilePicId}
          />
          {canEdit &&
            !onEdit && (
              <div className="dropdown-wrapper">
                <DropdownButton
                  snow
                  direction="left"
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
          <section>
            <div>
              <UsernameText
                className="username"
                user={{
                  name: reply.username,
                  id: reply.userId
                }}
              />{' '}
              <small className="timestamp">
                &nbsp;{timeSince(reply.timeStamp)}
              </small>
            </div>
            <div>
              {reply.targetUserId &&
                !!reply.replyId &&
                reply.replyId !== comment.id && (
                  <span className="to">
                    to:{' '}
                    <UsernameText
                      user={{
                        name: reply.targetUserName,
                        id: reply.targetUserId
                      }}
                    />
                  </span>
                )}
              {onEdit ? (
                <EditTextArea
                  autoFocus
                  text={reply.content}
                  onCancel={() => this.setState({ onEdit: false })}
                  onEditDone={this.onEditDone}
                />
              ) : (
                <div>
                  <LongText className="content">{reply.content}</LongText>
                  <div>
                    <div>
                      <LikeButton
                        onClick={this.onLikeClick}
                        liked={userLikedThis}
                        small
                      />
                      {type !== 'comment' && (
                        <Button transparent onClick={this.onReplyButtonClick}>
                          <span className="glyphicon glyphicon-comment" /> Reply
                        </Button>
                      )}
                    </div>
                    <small>
                      <Likers
                        className="likers"
                        userId={userId}
                        likes={reply.likes}
                        onLinkClick={() =>
                          this.setState({ userListModalShown: true })
                        }
                      />
                    </small>
                  </div>
                </div>
              )}
            </div>
            {replyInputShown && (
              <ReplyInputArea
                onSubmit={this.onReplySubmit}
                clickListenerState={clickListenerState}
              />
            )}
          </section>
        </div>
        {userListModalShown && (
          <UserListModal
            onHide={() => this.setState({ userListModalShown: false })}
            title="People who liked this reply"
            users={reply.likes}
            description="(You)"
          />
        )}
        {confirmModalShown && (
          <ConfirmModal
            onHide={() => this.setState({ confirmModalShown: false })}
            title="Remove Reply"
            onConfirm={this.onDelete}
          />
        )}
      </div>
    )
  }

  onEditDone(editedReply) {
    const { onEditDone, reply } = this.props
    return onEditDone({ editedComment: editedReply, commentId: reply.id }).then(
      () => this.setState({ onEdit: false })
    )
  }

  onLikeClick() {
    const { onLikeClick, reply } = this.props
    onLikeClick(reply.id)
  }

  onDelete() {
    const { deleteCallback, index, onDelete, reply } = this.props
    deleteCallback(index)
    onDelete(reply.id)
  }

  onReplyButtonClick() {
    const { replyInputShown, clickListenerState } = this.state
    if (!replyInputShown) {
      return this.setState({ replyInputShown: true })
    }
    this.setState({ clickListenerState: !clickListenerState })
  }

  onReplySubmit(replyContent) {
    const { parent, reply, onReplySubmit } = this.props
    onReplySubmit({ replyContent, reply, parent })
  }
}

export default connect(state => ({ isCreator: state.UserReducer.isCreator }))(
  PanelReply
)
