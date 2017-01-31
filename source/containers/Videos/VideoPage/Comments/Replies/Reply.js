import React, {Component, PropTypes} from 'react'
import {timeSince} from 'helpers/timeStampHelpers'
import SmallDropdownButton from 'components/SmallDropdownButton'
import EditTextArea from 'components/Texts/EditTextArea'
import {cleanStringWithURL} from 'helpers/stringHelpers'
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
    deleteListenerToggle: PropTypes.bool,
    lastDeletedCommentIndex: PropTypes.number,
    index: PropTypes.number,
    id: PropTypes.number,
    username: PropTypes.string,
    timeStamp: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    content: PropTypes.string,
    userIsOwner: PropTypes.bool,
    onEditDone: PropTypes.func,
    likes: PropTypes.array,
    userId: PropTypes.number,
    profilePicId: PropTypes.number,
    myId: PropTypes.number,
    targetUserName: PropTypes.string,
    targetUserId: PropTypes.number,
    onLikeClick: PropTypes.func,
    isFirstReply: PropTypes.bool,
    deleteCallback: PropTypes.func,
    onDelete: PropTypes.func,
    onReplySubmit: PropTypes.func,
    commentId: PropTypes.number,
    videoId: PropTypes.number,
    replyOfReply: PropTypes.bool,
    forDiscussionPanel: PropTypes.bool
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
          <SmallDropdownButton
            shape="button"
            icon="pencil"
            style={{
              position: 'relative',
              float: 'right'
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
            /> <small>&nbsp;{timeSince(timeStamp)}</small></h4>
          <div>
            {targetUserId &&
              <span style={{color: Color.blue}}>
                to: <UsernameText user={{name: targetUserName, id: targetUserId}} />
              </span>
            }
            {onEdit ?
              <EditTextArea
                autoFocus
                text={cleanStringWithURL(content)}
                onCancel={() => this.setState({onEdit: false})}
                onEditDone={editedComment => onEditDone({editedComment, commentId: id}, () => {
                  this.setState({onEdit: false})
                })}
              /> :
              <div className="container-fluid">
                <LongText
                  className="row"
                  style={{paddingBottom: '1em'}}
                >
                  {content}
                </LongText>
                <div
                  className="row flexbox-container"
                >
                  <div className="pull-left">
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
          {replyInputShown && <ReplyInputArea
              onSubmit={this.onReplySubmit}
              clickListenerState={clickListenerState}
            />
          }
        </div>
        {userListModalShown &&
          <UserListModal
            onHide={() => this.setState({userListModalShown: false})}
            title="People who liked this reply"
            userId={myId}
            users={likes}
            description={user => user.userId === myId && '(You)'}
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
