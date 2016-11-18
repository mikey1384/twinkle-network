import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {timeSince} from 'helpers/timeStampHelpers';
import {cleanStringWithURL} from 'helpers/stringHelpers';
import SmallDropdownButton from 'components/SmallDropdownButton';
import Likers from 'components/Likers';
import UserListModal from 'components/Modals/UserListModal';
import ReplyInputArea from './Replies/ReplyInputArea';
import Replies from './Replies';
import EditTextArea from './EditTextArea';
import UsernameText from 'components/UsernameText';
import Button from 'components/Button';
import LikeButton from 'components/LikeButton';


export default class Comment extends Component {
  constructor() {
    super()
    this.state = {
      replyInputShown: false,
      onEdit: false,
      userListModalShown: false
    }
    this.onReplySubmit = this.onReplySubmit.bind(this)
    this.onEditDone = this.onEditDone.bind(this)
    this.onLikeClick = this.onLikeClick.bind(this)
  }

  render() {
    const {replyInputShown, onEdit, userListModalShown} = this.state;
    const {comment, userId, commentId, videoId, onEditDone} = this.props;
    const userIsOwner = comment.userId === userId;
    let userLikedThis = false;
    for (let i = 0; i < comment.likes.length; i++) {
      if (comment.likes[i].userId === userId) userLikedThis = true;
    }
    return (
      <li
        className="media"
        style={{marginTop: this.props.marginTop && '2em'}}
      >
        {userIsOwner && !onEdit &&
          <SmallDropdownButton
            shape="button"
            icon="pencil"
            style={{
              position: 'absolute',
              right: '0px',
              marginRight: '3em'
            }}
            menuProps={[
              {
                label: "Edit",
                onClick: () => this.setState({onEdit: true})
              },
              {
                label: "Remove",
                onClick: () => this.props.onDelete(commentId)
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
            <UsernameText user={{
              name: comment.username,
              id: comment.userId
            }} /> <small>&nbsp;{timeSince(comment.timeStamp)}</small>
          </h4>
          {onEdit ?
            <EditTextArea
              text={cleanStringWithURL(comment.content)}
              onCancel={() => this.setState({onEdit: false})}
              onEditDone={this.onEditDone}
            /> :
            <div className="container-fluid">
              {!!comment.debateTopic &&
                <div
                  className="row"
                  style={{
                    color: '#158cba',
                    fontWeight: 'bold',
                    marginBottom: '0.5em'
                  }}
                >
                  Debate Topic: {comment.debateTopic}
                </div>
              }
              <div
                className="row"
                style={{paddingBottom: '1.7em'}}
                dangerouslySetInnerHTML={{__html: comment.content}}
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
                    userId={userId}
                    likes={comment.likes}
                    onLinkClick={() => this.setState({userListModalShown: true})}
                  />
                </small>
              </div>
            </div>
          }
          <Replies
            userId={userId}
            replies={comment.replies}
            commentId={commentId}
            videoId={videoId}
            onEditDone={onEditDone}
            onReplySubmit={this.props.onReplySubmit}
            onLikeClick={replyId => this.props.onReplyLike(replyId, this.props.commentId)}
            onDelete={replyId => this.props.onDelete(replyId)}
          />
          {replyInputShown && <ReplyInputArea
              onSubmit={this.onReplySubmit}
            />
          }
        </div>
        {userListModalShown &&
          <UserListModal
            onHide={() => this.setState({userListModalShown: false})}
            title="People who liked this comment"
            userId={userId}
            users={comment.likes}
            description={user => user.userId === userId && '(You)'}
          />
        }
      </li>
    )
  }

  onEditDone(editedComment) {
    const {commentId} = this.props;
    this.props.onEditDone({editedComment, commentId}, () => {
      this.setState({onEdit: false})
    })
  }

  onLikeClick() {
    const {commentId} = this.props;
    this.props.onLikeClick(commentId);
  }

  onReplySubmit(reply) {
    const {commentId, videoId} = this.props;
    this.props.onReplySubmit(reply, commentId, videoId);
  }
}
