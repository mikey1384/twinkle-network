import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import FeedReply from './FeedReply';

export default class FeedReplies extends Component {
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
      replies, userId, onEditDone, onLikeClick, onDelete, onReplySubmit, comment, contentId, parent
    } = this.props;
    return (
      <div
        className="media container-fluid"
        style={{paddingLeft: '0px'}}
      >
        {replies.map(reply => {
          return (
            <FeedReply
              ref={reply.id}
              key={reply.id}
              parent={parent}
              comment={comment}
              reply={reply}
              userId={userId}
              userIsOwner={reply.userId === userId}
            />
          )
        })}
      </div>
    )
  }
}
