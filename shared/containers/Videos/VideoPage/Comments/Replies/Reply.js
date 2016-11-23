import React, {Component, PropTypes} from 'react';
import {timeSince} from 'helpers/timeStampHelpers';
import SmallDropdownButton from 'components/SmallDropdownButton';
import EditTextArea from '../EditTextArea';
import {cleanStringWithURL} from 'helpers/stringHelpers';
import Likers from 'components/Likers';
import UserListModal from 'components/Modals/UserListModal';
import UsernameText from 'components/UsernameText';
import Button from 'components/Button';
import LikeButton from 'components/LikeButton';
import ReplyInputArea from './ReplyInputArea';
import {scrollElementToCenter} from 'helpers/domHelpers';
import ConfirmModal from 'components/Modals/ConfirmModal';


export default class Reply extends Component {
  constructor() {
    super()
    this.state={
      onEdit: false,
      replyInputShown: false,
      userListModalShown: false,
      confirmModalShown: false
    }
    this.onLikeClick = this.onLikeClick.bind(this)
    this.onDelete = this.onDelete.bind(this)
    this.onReplySubmit = this.onReplySubmit.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.deleteListenerToggle !== this.props.deleteListenerToggle) {
      if (this.props.lastDeletedCommentIndex - 1 === this.props.index) {
        scrollElementToCenter(this.Reply);
      }
    }
  }

  render() {
    const {
      id, username, timeStamp, content, userIsOwner, onEditDone,
      likes, userId, myId, targetUserName, targetUserId, autoFocus
    } = this.props;
    const {onEdit, userListModalShown, replyInputShown, confirmModalShown} = this.state;
    let userLikedThis = false;
    for (let i = 0; i < likes.length; i++) {
      if (likes[i].userId == myId) userLikedThis = true;
    }
    return (
      <div
        className="media"
        key={id}
        ref={ref => {this.Reply = ref}}
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
                label: "Edit",
                onClick: () => this.setState({onEdit: true})
              },
              {
                label: "Remove",
                onClick: () => this.setState({confirmModalShown: true})
              }
            ]}
          />
        }
        <div className="media-left">
          <a>
            <img
              className="media-object"
              src="/img/default.jpg"
              style={{width: '64px'}}
            />
          </a>
        </div>
        <div className="media-body">
          <h4 className="media-heading">
            <UsernameText
              user={{
                name: username, id: userId
              }}
            /> <small>&nbsp;{timeSince(timeStamp)}</small></h4>
          <div>
            {targetUserId &&
              <span style={{color: '#158cba'}}>
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
                <div
                  className="row"
                  dangerouslySetInnerHTML={{__html: content}}
                  style={{paddingBottom: '1.7em'}}
                ></div>
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
                      onClick={() => this.setState({replyInputShown: true})}
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
                        color: '#f0ad4e',
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
    const replyId = this.props.id;
    this.props.onLikeClick(replyId);
  }

  onDelete() {
    const {id, deleteCallback, index, isFirstReply} = this.props;
    deleteCallback(index, isFirstReply);
    this.props.onDelete(id);
  }

  onReplySubmit(reply) {
    const {onReplySubmit, commentId, videoId, id} = this.props;
    this.setState({replyInputShown: false})
    onReplySubmit(reply, commentId, videoId, id)
  }
}
