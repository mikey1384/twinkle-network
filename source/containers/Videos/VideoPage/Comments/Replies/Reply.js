import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {timeSince} from 'helpers/timeStampHelpers'
import DropdownButton from 'components/DropdownButton'
import EditTextArea from 'components/Texts/EditTextArea'
import Likers from 'components/Likers'
import {Color} from 'constants/css'
import UserListModal from 'components/Modals/UserListModal'
import UsernameText from 'components/Texts/UsernameText'
import ProfilePic from 'components/ProfilePic'
import Button from 'components/Button'
import LikeButton from 'components/LikeButton'
import ReplyInputArea from './ReplyInputArea'
import {scrollElementToCenter} from 'helpers/domHelpers'
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
    timeStamp: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired,
    userId: PropTypes.number.isRequired,
    userIsOwner: PropTypes.bool,
    username: PropTypes.string.isRequired,
    videoId: PropTypes.number.isRequired
  }

  constructor() {
    super()
    this.state={
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
    const {replyOfReply, forDiscussionPanel} = this.props
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
      id, username, timeStamp, content, userIsOwner, onEditDone,
      likes, userId, profilePicId, myId, targetUserName, targetUserId
    } = this.props
    const {
      onEdit, userListModalShown, replyInputShown,
      confirmModalShown, clickListenerState
    } = this.state
    let userLikedThis = false
    for (let i = 0; i < likes.length; i++) {
      if (likes[i].userId === myId) userLikedThis = true
    }
    return (
      <div
        className="media"
        key={id}
        ref={ref => { this.Reply = ref }}
      >
        {userIsOwner && !onEdit &&
          <DropdownButton
            shape="button"
            icon="pencil"
            style={{
              position: 'absolute',
              right: '3.5em'
            }}
            menuProps={[
              {
                label: 'Edit',
                onClick: () => this.setState({onEdit: true})
              },
              {
                label: 'Remove',
                onClick: () => this.setState({confirmModalShown: true})
              }
            ]}
          />
        }
        <ProfilePic size="4.5" userId={userId} profilePicId={profilePicId} />
        <div className="media-body">
          <h4 className="media-heading">
            <UsernameText
              user={{
                name: username, id: userId
              }}
            /> <small>&nbsp;{timeSince(timeStamp)}</small>
          </h4>
          <div className="media-body">
            {targetUserId &&
              <span style={{color: Color.blue}}>
                to: <UsernameText user={{name: targetUserName, id: targetUserId}} />
              </span>
            }
            <div style={{maxWidth: '77vw'}}>
              {onEdit ?
                <EditTextArea
                  autoFocus
                  text={content}
                  onCancel={() => this.setState({onEdit: false})}
                  onEditDone={
                    editedComment => onEditDone({editedComment, commentId: id}).then(
                      () => this.setState({onEdit: false})
                    )
                  }
                /> :
                <div>
                  <LongText style={{paddingBottom: '1em'}}>
                    {content}
                  </LongText>
                  <div
                    className="row flexbox-container"
                  >
                    <div className="pull-left" style={{paddingLeft: '1em'}}>
                      <LikeButton
                        onClick={this.onLikeClick}
                        liked={userLikedThis}
                        small
                      />
                      <Button
                        style={{marginLeft: '0.5em'}}
                        className="btn btn-warning btn-sm"
                        onClick={this.onReplyButtonClick}
                      >
                        <span className="glyphicon glyphicon-comment"></span> Reply
                      </Button>
                    </div>
                    <small>
                      <Likers
                        className="pull-left"
                        style={{
                          fontWeight: 'bold',
                          marginLeft: '0.8em',
                          color: Color.green,
                          marginTop: '1em'
                        }}
                        userId={myId}
                        likes={likes}
                        onLinkClick={() => this.setState({userListModalShown: true})}
                      />
                    </small>
                  </div>
                </div>
              }
            </div>
          </div>
          {replyInputShown && <ReplyInputArea
            onSubmit={this.onReplySubmit}
            clickListenerState={clickListenerState}
          />}
        </div>
        {userListModalShown &&
          <UserListModal
            onHide={() => this.setState({userListModalShown: false})}
            title="People who liked this reply"
            users={likes}
            description="(You)"
          />
        }
        {confirmModalShown &&
          <ConfirmModal
            onHide={() => this.setState({confirmModalShown: false})}
            title="Remove Reply"
            onConfirm={this.onDelete}
          />
        }
      </div>
    )
  }

  onLikeClick() {
    const replyId = this.props.id
    this.props.onLikeClick(replyId)
  }

  onDelete() {
    const {id, deleteCallback, index, isFirstReply} = this.props
    deleteCallback(index, isFirstReply)
    this.props.onDelete(id)
  }

  onReplyButtonClick() {
    const {replyInputShown, clickListenerState} = this.state
    if (!replyInputShown) {
      return this.setState({replyInputShown: true})
    }
    this.setState({clickListenerState: !clickListenerState})
  }

  onReplySubmit(reply) {
    const {onReplySubmit, commentId, videoId, id} = this.props
    this.setState({replyInputShown: false})
    onReplySubmit({reply, commentId, videoId, replyId: id, replyOfReply: true})
  }
}
