import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {timeSince} from 'helpers/timeStampHelpers'
import SmallDropdownButton from 'components/SmallDropdownButton'
import EditTextArea from 'components/Texts/EditTextArea'
import {cleanStringWithURL} from 'helpers/stringHelpers'
import Likers from 'components/Likers'
import UserListModal from 'components/Modals/UserListModal'
import UsernameText from 'components/Texts/UsernameText'
import ProfilePic from 'components/ProfilePic'
import Button from 'components/Button'
import {Color} from 'constants/css'
import LikeButton from 'components/LikeButton'
import ReplyInputArea from './ReplyInputArea'
import {scrollElementToCenter} from 'helpers/domHelpers'
import ConfirmModal from 'components/Modals/ConfirmModal'
import LongText from 'components/Texts/LongText'

export default class PanelReply extends Component {
  static propTypes = {
    deleteListenerToggle: PropTypes.bool,
    lastDeletedCommentIndex: PropTypes.number,
    index: PropTypes.number,
    comment: PropTypes.object,
    reply: PropTypes.object,
    userId: PropTypes.number,
    userIsOwner: PropTypes.bool,
    type: PropTypes.string,
    onEditDone: PropTypes.func,
    onLikeClick: PropTypes.func,
    deleteCallback: PropTypes.func,
    onDelete: PropTypes.func,
    parent: PropTypes.object,
    onReplySubmit: PropTypes.func
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
    this.onEditDone = this.onEditDone.bind(this)
    this.onLikeClick = this.onLikeClick.bind(this)
    this.onDelete = this.onDelete.bind(this)
    this.onReplySubmit = this.onReplySubmit.bind(this)
    this.onReplyButtonClick = this.onReplyButtonClick.bind(this)
  }

  componentDidMount() {
    const {reply: {replyOfReply, originType}, type} = this.props
    if (replyOfReply && (type === originType)) scrollElementToCenter(this.PanelReply)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.deleteListenerToggle !== this.props.deleteListenerToggle) {
      if (this.props.lastDeletedCommentIndex - 1 === this.props.index) {
        scrollElementToCenter(this.PanelReply)
      }
    }
  }

  render() {
    const {comment, reply, userId, userIsOwner, type} = this.props
    const {
      onEdit, userListModalShown, replyInputShown,
      confirmModalShown, clickListenerState
    } = this.state
    let userLikedThis = false
    for (let i = 0; i < reply.likes.length; i++) {
      if (reply.likes[i].userId === userId) userLikedThis = true
    }
    return (
      <div className="media" ref={ref => { this.PanelReply = ref }}>
        {userIsOwner && !onEdit &&
          <SmallDropdownButton
            shape="button"
            icon="pencil"
            style={{
              position: 'absolute',
              right: '5.5%',
              opacity: 0.7
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
        <ProfilePic size="3.5" userId={reply.userId} profilePicId={reply.profilePicId} />
        <div className="media-body">
          <h5 className="media-heading">
            <UsernameText
              user={{
                name: reply.username, id: reply.userId
              }}
            /> <small>&nbsp;{timeSince(reply.timeStamp)}</small>
          </h5>
          <div style={{maxWidth: onEdit ? '100vw' : (type === 'videoDiscussionPanel' ? '78vw' : '36vw')}}>
            {reply.targetUserId && !!reply.replyId && reply.replyId !== comment.id &&
              <span style={{color: Color.blue}}>
                to: <UsernameText user={{name: reply.targetUserName, id: reply.targetUserId}} />
              </span>
            }
            {onEdit ?
              <EditTextArea
                autoFocus
                text={cleanStringWithURL(reply.content)}
                onCancel={() => this.setState({onEdit: false})}
                onEditDone={this.onEditDone}
              /> :
              <div>
                <LongText
                  style={{paddingBottom: '0.8em', wordWrap: 'break-word'}}
                >
                  {reply.content}
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
                    {type !== 'comment' &&
                      <Button
                        style={{marginLeft: '0.5em'}}
                        className="btn btn-warning btn-sm"
                        onClick={this.onReplyButtonClick}
                      >
                        <span className="glyphicon glyphicon-comment"></span> Reply
                      </Button>
                    }
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
                      userId={userId}
                      likes={reply.likes}
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
        { userListModalShown &&
          <UserListModal
            onHide={() => this.setState({userListModalShown: false})}
            title="People who liked this reply"
            users={reply.likes}
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

  onEditDone(editedReply) {
    const {onEditDone, reply} = this.props
    onEditDone({editedComment: editedReply, commentId: reply.id}, () => {
      this.setState({onEdit: false})
    })
  }

  onLikeClick() {
    const replyId = this.props.reply.id
    this.props.onLikeClick(replyId)
  }

  onDelete() {
    const replyId = this.props.reply.id
    const {deleteCallback, onDelete, index} = this.props
    deleteCallback(index)
    onDelete(replyId)
  }

  onReplyButtonClick() {
    const {replyInputShown, clickListenerState} = this.state
    if (!replyInputShown) {
      return this.setState({replyInputShown: true})
    }
    this.setState({clickListenerState: !clickListenerState})
  }

  onReplySubmit(replyContent) {
    const {parent, reply, onReplySubmit} = this.props
    onReplySubmit({replyContent, reply, parent})
  }
}
