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

export default class PanelReply extends Component {
  constructor() {
    super()
    this.state={
      onEdit: false,
      replyInputShown: false,
      userListModalShown: false
    }
    this.onEditDone = this.onEditDone.bind(this)
    this.onLikeClick = this.onLikeClick.bind(this)
    this.onDelete = this.onDelete.bind(this)
    this.onReplySubmit = this.onReplySubmit.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.deleteListenerToggle !== this.props.deleteListenerToggle) {
      if (this.props.lastDeletedCommentIndex - 1 === this.props.index) {
        scrollElementToCenter(this.PanelReply);
      }
    }
  }

  render() {
    const {parent, comment, reply, userId, userIsOwner, type} = this.props;
    const {onEdit, userListModalShown, replyInputShown} = this.state;
    let userLikedThis = false;
    for (let i = 0; i < reply.likes.length; i++) {
      if (reply.likes[i].userId == userId) userLikedThis = true;
    }
    return (
      <div className="media" ref={ref => {this.PanelReply = ref}}>
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
                label: "Edit",
                onClick: () => this.setState({onEdit: true})
              },
              {
                label: "Remove",
                onClick: this.onDelete
              }
            ]}
          />
        }
        <div className="media-left">
          <a>
            <img
              className="media-object"
              src="/img/default.jpg"
              style={{width: '45px'}}
            />
          </a>
        </div>
        <div className="media-body">
          <h5 className="media-heading">
            <UsernameText
              user={{
                name: reply.username, id: reply.userId
              }}
            /> <small>&nbsp;{timeSince(reply.timeStamp)}</small>
          </h5>
          <div>
            {reply.targetUserId && !!reply.replyId && reply.replyId !== comment.id &&
              <span style={{color: '#158cba'}}>
                to: <UsernameText user={{name: reply.targetUserName, id: reply.targetUserId}} />
              </span>
            }
            {onEdit ?
              <EditTextArea
                text={cleanStringWithURL(reply.content)}
                onCancel={() => this.setState({onEdit: false})}
                onEditDone={this.onEditDone}
              /> :
              <div className="container-fluid">
                <div
                  className="row"
                  dangerouslySetInnerHTML={{__html: reply.content}}
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
                    {type !== 'comment' &&
                      <Button
                        style={{marginLeft: '0.5em'}}
                        className="btn btn-warning btn-sm"
                        onClick={() => this.setState({replyInputShown: true})}
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
                        color: '#f0ad4e',
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
            />
          }
        </div>
        { userListModalShown &&
          <UserListModal
            onHide={() => this.setState({userListModalShown: false})}
            title="People who liked this reply"
            userId={userId}
            users={reply.likes}
            description={user => user.userId === userId && '(You)'}
          />
        }
      </div>
    )
  }

  onEditDone(editedReply) {
    const {onEditDone, reply} = this.props;
    onEditDone({editedComment: editedReply, commentId: reply.id}, () => {
      this.setState({onEdit: false})
    })
  }

  onLikeClick() {
    const replyId = this.props.reply.id;
    this.props.onLikeClick(replyId);
  }

  onDelete() {
    const replyId = this.props.reply.id;
    const {deleteCallback, onDelete, index} = this.props;
    deleteCallback(index);
    onDelete(replyId);
  }

  onReplySubmit(replyContent) {
    const {parent, reply, onReplySubmit} = this.props;
    onReplySubmit(replyContent, reply, parent);
  }
}
