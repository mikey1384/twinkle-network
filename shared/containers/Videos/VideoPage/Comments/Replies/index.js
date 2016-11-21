import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Reply from './Reply';
import {scrollElementToCenter} from 'helpers/domHelpers';

export default class Replies extends Component {
  constructor() {
    super()
    this.state = {
      lastDeletedCommentIndex: null,
      deleteListenerToggle: false
    }
    this.deleteCallback = this.deleteCallback.bind(this)
  }

  componentDidUpdate(prevProps) {
    const length = this.props.replies.length;
    const lastReply = this.props.replies[length - 1] || [];
    const newlyAdded = lastReply ? lastReply.newlyAdded : false;
    const replyToReply = lastReply ? !!lastReply.targetUserId : false;
    if (length !== prevProps.replies.length && newlyAdded && replyToReply) {
      scrollElementToCenter(this.refs[lastReply.id])
    }
    if (length < prevProps.replies.length) {
      if (length === 0) return scrollElementToCenter(this.Replies)
      this.setState({deleteListenerToggle: !deleteListenerToggle})
    }
  }

  render() {
    const {
      replies, userId, onEditDone, onLikeClick, onDelete, onReplySubmit, commentId, videoId
    } = this.props;
    const {lastDeletedCommentIndex, deleteListenerToggle} = this.state;
    return (
      <div
        className="media container-fluid"
        style={{paddingLeft: '0px'}}
        ref={ref => {this.Replies = ref}}
      >
        {replies.map((reply, index) => {
          return (
            <Reply
              {...reply}
              index={index}
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
              deleteCallback={this.deleteCallback}
              lastDeletedCommentIndex={lastDeletedCommentIndex}
              deleteListenerToggle={deleteListenerToggle}
            />
          )
        })}
      </div>
    )
  }

  deleteCallback(index) {
    this.setState({lastDeletedCommentIndex: index});
  }
}
