import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Context from '../Context';
import withContext from 'components/Wrappers/withContext';
import Reply from './Reply';
import { scrollElementToCenter } from 'helpers';
import { loadReplies } from 'helpers/requestHelpers';
import Button from 'components/Button';

class Replies extends Component {
  static propTypes = {
    comment: PropTypes.shape({
      id: PropTypes.number.isRequired
    }).isRequired,
    subject: PropTypes.object,
    innerRef: PropTypes.func,
    onDelete: PropTypes.func.isRequired,
    onLoadRepliesOfReply: PropTypes.func,
    onReplySubmit: PropTypes.func.isRequired,
    onLoadMoreReplies: PropTypes.func.isRequired,
    parent: PropTypes.object.isRequired,
    replies: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        userId: PropTypes.number.isRequired
      })
    ).isRequired,
    Replies: PropTypes.object,
    userId: PropTypes.number
  };

  state = {
    deleting: false,
    replying: false
  };

  componentDidUpdate(prevProps) {
    const { deleting, replying } = this.state;
    const { replies, Replies } = this.props;
    if (replies.length < prevProps.replies.length) {
      if (deleting) {
        this.setState({ deleting: false });
        if (replies.length === 0) {
          return scrollElementToCenter(this.ReplyContainer);
        }
        if (
          replies[replies.length - 1].id !==
          prevProps.replies[prevProps.replies.length - 1].id
        ) {
          scrollElementToCenter(Replies[replies[replies.length - 1].id]);
        }
      }
    }
    if (replies.length > prevProps.replies.length) {
      if (replying) {
        this.setState({ replying: false });
        scrollElementToCenter(Replies[replies[replies.length - 1].id]);
      }
    }
  }

  render() {
    let {
      innerRef,
      replies,
      userId,
      comment,
      subject,
      onLoadRepliesOfReply,
      parent
    } = this.props;
    return (
      <div ref={ref => (this.ReplyContainer = ref)}>
        {comment.loadMoreButton && (
          <Button
            style={{
              marginTop: '0.5rem',
              width: '100%'
            }}
            filled
            info
            onClick={this.loadMoreReplies}
          >
            Load More
          </Button>
        )}
        {replies.map((reply, index) => {
          return (
            <Reply
              index={index}
              innerRef={ref => innerRef({ ref, replyId: reply.id })}
              key={reply.id}
              parent={parent}
              comment={comment}
              subject={subject}
              reply={reply}
              userId={userId}
              onDelete={this.onDelete}
              onLoadRepliesOfReply={onLoadRepliesOfReply}
              onReply={this.onReplySubmit}
            />
          );
        })}
      </div>
    );
  }

  loadMoreReplies = async() => {
    const { comment, onLoadMoreReplies, replies } = this.props;
    try {
      const lastReplyId = replies[0] ? replies[0].id : 'undefined';
      const data = await loadReplies({ lastReplyId, commentId: comment.id });
      onLoadMoreReplies(data);
    } catch (error) {
      console.error(error.response, error);
    }
  };

  onDelete = replyId => {
    const { onDelete } = this.props;
    this.setState({ deleting: true });
    onDelete(replyId);
  };

  onReplySubmit = params => {
    const { onReplySubmit } = this.props;
    this.setState({ replying: true });
    onReplySubmit(params);
  };
}

export default withContext({ Component: Replies, Context });
