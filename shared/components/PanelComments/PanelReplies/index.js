import React, {Component} from 'react';
import PanelReply from './PanelReply';
import {scrollElementToCenter} from 'helpers/domHelpers';
import Button from 'components/Button';

export default class PanelReplies extends Component {
  constructor() {
    super()
    this.state = {
      lastDeletedCommentIndex: null,
      deleteListenerToggle: false
    }
    this.deleteCallback = this.deleteCallback.bind(this)
    this.loadMoreReplies = this.loadMoreReplies.bind(this)
  }

  componentDidUpdate(prevProps) {
    const {contentId} = this.props;
    const {deleteListenerToggle} = this.state;
    const length = this.props.replies.length;
    const lastReply = this.props.replies[length - 1] || [];
    const newlyAdded = lastReply ? lastReply.newlyAdded : false;
    const replyToReply = lastReply ? !!lastReply.targetUserId : false;
    if (length > prevProps.replies.length && newlyAdded && replyToReply) {
      scrollElementToCenter(this.refs[lastReply.id])
    }
    if (length < prevProps.replies.length) {
      if (length === 0) return scrollElementToCenter(this.PanelReplies)
      this.setState({deleteListenerToggle: !deleteListenerToggle})
    }
  }

  render() {
    const {
      type, replies, userId, onEditDone, onLikeClick, onDelete,
      onReplySubmit, comment, contentId, parent
    } = this.props;
    const {lastDeletedCommentIndex, deleteListenerToggle} = this.state;
    return (
      <div
        className="media container-fluid"
        style={{paddingLeft: '0px', paddingRight: '0px'}}
        ref={ref => {this.PanelReplies = ref}}
      >
        {comment.loadMoreReplies &&
          <Button
            className="btn btn-default"
            style={{
              width: '100%',
              marginBottom: replies.length === 0 && '1em'
            }}
            onClick={this.loadMoreReplies}
          >
            Load More
          </Button>
        }
        {replies.map((reply, index) => {
          return (
            <PanelReply
              ref={reply.id}
              index={index}
              key={reply.id}
              type={type}
              parent={parent}
              comment={comment}
              reply={reply}
              userId={userId}
              userIsOwner={reply.userId === userId}
              onDelete={onDelete}
              onLikeClick={onLikeClick}
              onEditDone={onEditDone}
              onReplySubmit={onReplySubmit}
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

  loadMoreReplies() {
    const {comment, replies, onLoadMoreReplies, parent} = this.props;
    const lastReplyId = !!replies[0] ? replies[0].id : '0';
    onLoadMoreReplies(lastReplyId, comment.id, parent)
  }
}
