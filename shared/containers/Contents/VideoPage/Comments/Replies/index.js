import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Reply from './Reply';

export default class Replies extends Component {
  componentDidUpdate(prevProps) {
    const length = this.props.replies.length;
    const lastReply = this.props.replies[length - 1] || [];
    const newlyAdded = lastReply ? lastReply.newlyAdded : false;
    const replyToReply = lastReply ? !!lastReply.targetUserId : false;
    if (length !== prevProps.replies.length && newlyAdded && replyToReply) {
      window.scrollTo(0, ReactDOM.findDOMNode(this.refs[lastReply.id]).offsetTop - window.innerHeight/2);
    }
  }

  render() {
    const {
      replies, userId, onEditDone, onLikeClick, onDelete, onReplySubmit, commentId, videoId
    } = this.props;
    return (
      <div
        className="media container-fluid"
        style={{paddingLeft: '0px'}}
      >
        {replies.map(reply => {
          return (
            <Reply
              {...reply}
              ref={reply.id}
              commentId={commentId}
              videoId={videoId}
              onReplySubmit={onReplySubmit}
              onEditDone={onEditDone}
              onLikeClick={onLikeClick}
              onDelete={onDelete}
              myId={userId}
              key={reply.id}
              userIsOwner={reply.userId === userId}
            />
          )
        })}
      </div>
    )
  }
}
