import PropTypes from 'prop-types'
import React, { Component } from 'react'
import PanelReply from './PanelReply'
import { scrollElementToCenter } from 'helpers/domHelpers'
import Button from 'components/Button'

export default class PanelReplies extends Component {
  static propTypes = {
    attachStar: PropTypes.func,
    comment: PropTypes.shape({
      id: PropTypes.number.isRequired
    }).isRequired,
    onDelete: PropTypes.func.isRequired,
    onEditDone: PropTypes.func.isRequired,
    onLikeClick: PropTypes.func.isRequired,
    onLoadMoreReplies: PropTypes.func.isRequired,
    onReplySubmit: PropTypes.func.isRequired,
    onRewardCommentEdit: PropTypes.func.isRequired,
    parent: PropTypes.object.isRequired,
    replies: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        userId: PropTypes.number.isRequired
      })
    ).isRequired,
    type: PropTypes.string,
    userId: PropTypes.number
  }

  state = {
    lastDeletedCommentIndex: null,
    deleteListenerToggle: false
  }

  componentDidUpdate(prevProps) {
    const { deleteListenerToggle } = this.state
    const length = this.props.replies.length

    if (length < prevProps.replies.length) {
      if (length === 0) return scrollElementToCenter(this.PanelReplies)
      this.setState({ deleteListenerToggle: !deleteListenerToggle })
    }
  }

  render() {
    const {
      attachStar,
      type,
      replies = [],
      userId,
      onEditDone,
      onRewardCommentEdit,
      onLikeClick,
      onDelete,
      comment,
      parent
    } = this.props
    const { lastDeletedCommentIndex, deleteListenerToggle } = this.state
    return (
      <div
        ref={ref => {
          this.PanelReplies = ref
        }}
      >
        {comment.loadMoreReplies && (
          <Button
            style={{
              marginTop: '1rem',
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
            <PanelReply
              index={index}
              key={reply.id}
              type={type}
              parent={parent}
              comment={comment}
              reply={reply}
              userId={userId}
              attachStar={attachStar}
              onDelete={onDelete}
              onLikeClick={onLikeClick}
              onEditDone={onEditDone}
              onReplySubmit={this.onReplyOfReplySubmit}
              onRewardCommentEdit={onRewardCommentEdit}
              deleteCallback={this.deleteCallback}
              lastDeletedCommentIndex={lastDeletedCommentIndex}
              deleteListenerToggle={deleteListenerToggle}
            />
          )
        })}
      </div>
    )
  }

  deleteCallback = index => {
    this.setState({ lastDeletedCommentIndex: index })
  }

  loadMoreReplies = () => {
    const { comment, replies, onLoadMoreReplies, parent } = this.props
    const lastReplyId = replies[0] ? replies[0].id : '0'
    onLoadMoreReplies(lastReplyId, comment.id, parent)
  }

  onReplyOfReplySubmit = ({ replyContent, reply, parent }) => {
    const { onReplySubmit, type } = this.props
    onReplySubmit({
      replyContent,
      parent,
      comment: reply,
      replyOfReply: true,
      originType: type
    })
  }
}
