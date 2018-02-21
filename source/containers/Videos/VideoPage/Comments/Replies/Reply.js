import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { timeSince } from 'helpers/timeStampHelpers'
import DropdownButton from 'components/DropdownButton'
import EditTextArea from 'components/Texts/EditTextArea'
import Likers from 'components/Likers'
import { Color } from 'constants/css'
import UserListModal from 'components/Modals/UserListModal'
import UsernameText from 'components/Texts/UsernameText'
import ProfilePic from 'components/ProfilePic'
import Button from 'components/Button'
import LikeButton from 'components/LikeButton'
import ReplyInputArea from './ReplyInputArea'
import { scrollElementToCenter } from 'helpers/domHelpers'
import ConfirmModal from 'components/Modals/ConfirmModal'
import LongText from 'components/Texts/LongText'

export default class Reply extends Component {
  static propTypes = {
    commentId: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    deleteCallback: PropTypes.func.isRequired,
    deleteListenerToggle: PropTypes.bool.isRequired,
    forDiscussionPanel: PropTypes.bool,
    id: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    isFirstReply: PropTypes.bool,
    lastDeletedCommentIndex: PropTypes.number,
    likes: PropTypes.array.isRequired,
    myId: PropTypes.number,
    replyOfReply: PropTypes.bool,
    onDelete: PropTypes.func.isRequired,
    onEditDone: PropTypes.func.isRequired,
    onLikeClick: PropTypes.func.isRequired,
    onReplySubmit: PropTypes.func.isRequired,
    profilePicId: PropTypes.number,
    targetUserId: PropTypes.number,
    targetUserName: PropTypes.string,
    timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    userId: PropTypes.number.isRequired,
    userIsOwner: PropTypes.bool,
    username: PropTypes.string.isRequired,
    videoId: PropTypes.number.isRequired
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
    this.onLikeClick = this.onLikeClick.bind(this)
    this.onDelete = this.onDelete.bind(this)
    this.onReplySubmit = this.onReplySubmit.bind(this)
    this.onReplyButtonClick = this.onReplyButtonClick.bind(this)
  }

  componentDidMount() {
    const { replyOfReply, forDiscussionPanel } = this.props
    if (replyOfReply && !forDiscussionPanel) scrollElementToCenter(this.Reply)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.deleteListenerToggle !== this.props.deleteListenerToggle) {
      if (this.props.lastDeletedCommentIndex - 1 === this.props.index) {
        scrollElementToCenter(this.Reply)
      }
    }
  }

  render() {
    const {
      id,
      index,
      username,
      timeStamp,
      content,
      userIsOwner,
      onEditDone,
      likes,
      userId,
      profilePicId,
      myId,
      targetUserName,
      targetUserId
    } = this.props
    const {
      onEdit,
      userListModalShown,
      replyInputShown,
      confirmModalShown,
      clickListenerState
    } = this.state
    let userLikedThis = false
    for (let i = 0; i < likes.length; i++) {
      if (likes[i].userId === myId) userLikedThis = true
    }
    return (
      <div
        key={id}
        ref={ref => {
          this.Reply = ref
        }}
        style={{
          width: '100%',
          display: 'flex',
          marginTop: index !== 0 && '1.5rem',
          position: 'relative'
        }}
      >
        <div style={{ width: '10%', height: '10%' }}>
          <ProfilePic
            style={{ width: '80%', height: '80%' }}
            userId={userId}
            profilePicId={profilePicId}
          />
        </div>
        <div style={{ width: '90%', display: 'flex', flexDirection: 'column' }}>
          <div>
            <UsernameText
              user={{
                name: username,
                id: userId
              }}
              style={{ fontSize: '2rem' }}
            />{' '}
            <small style={{ color: Color.gray() }}>
              &nbsp;{timeSince(timeStamp)}
            </small>
          </div>
          <div
            style={{ display: 'flex', width: '100%', flexDirection: 'column' }}
          >
            {targetUserId && (
              <span style={{ color: Color.blue }}>
                to:{' '}
                <UsernameText
                  user={{ name: targetUserName, id: targetUserId }}
                  style={{ fontSize: '1.5rem' }}
                />
              </span>
            )}
            <Fragment>
              {onEdit ? (
                <EditTextArea
                  autoFocus
                  text={content}
                  onCancel={() => this.setState({ onEdit: false })}
                  onEditDone={editedComment =>
                    onEditDone({ editedComment, commentId: id }).then(() =>
                      this.setState({ onEdit: false })
                    )
                  }
                />
              ) : (
                <div style={{ width: '100%' }}>
                  <LongText
                    style={{ paddingBottom: '2rem', wordWrap: 'break-word' }}
                  >
                    {content}
                  </LongText>
                  <div
                    className="row"
                    style={{
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <div className="pull-left" style={{ paddingLeft: '1em' }}>
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
                        userId={myId}
                        likes={likes}
                        onLinkClick={() =>
                          this.setState({ userListModalShown: true })
                        }
                      />
                    </small>
                  </div>
                </div>
              )}
            </Fragment>
          </div>
          {replyInputShown && (
            <ReplyInputArea
              onSubmit={this.onReplySubmit}
              clickListenerState={clickListenerState}
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
            title="People who liked this reply"
            users={likes}
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

  onLikeClick() {
    const replyId = this.props.id
    this.props.onLikeClick(replyId)
  }

  onDelete() {
    const { id, deleteCallback, index, isFirstReply } = this.props
    deleteCallback(index, isFirstReply)
    this.props.onDelete(id)
  }

  onReplyButtonClick() {
    const { replyInputShown, clickListenerState } = this.state
    if (!replyInputShown) {
      return this.setState({ replyInputShown: true })
    }
    this.setState({ clickListenerState: !clickListenerState })
  }

  onReplySubmit(reply) {
    const { onReplySubmit, commentId, videoId, id } = this.props
    this.setState({ replyInputShown: false })
    onReplySubmit({
      reply,
      commentId,
      videoId,
      replyId: id,
      replyOfReply: true
    })
  }
}
