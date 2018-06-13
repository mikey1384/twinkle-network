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
    innerRef: PropTypes.func,
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
    Replies: PropTypes.object,
    type: PropTypes.string,
    userId: PropTypes.number
  }

  state = {
    deleting: false,
    replying: false
  }

  componentDidUpdate(prevProps) {
    const { deleting, replying } = this.state
    const { replies, Replies } = this.props
    if (replies.length < prevProps.replies.length) {
      if (deleting) {
        this.setState({ deleting: false })
        if (replies.length === 0) {
          return scrollElementToCenter(this.ReplyContainer)
        }
        if (
          replies[replies.length - 1].id !==
          prevProps.replies[prevProps.replies.length - 1].id
        ) {
          scrollElementToCenter(Replies[replies[replies.length - 1].id])
        }
      }
    }
    if (replies.length > prevProps.replies.length) {
      if (replying) {
        this.setState({ replying: false })
        scrollElementToCenter(Replies[replies[replies.length - 1].id])
      }
    }
  }

  render() {
    const {
      attachStar,
      innerRef,
      type,
      replies,
      userId,
      onEditDone,
      onRewardCommentEdit,
      onLikeClick,
      comment,
      parent
    } = this.props
    const { lastDeletedCommentIndex } = this.state
    return (
      <div
        ref={ref => {
          this.ReplyContainer = ref
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
              innerRef={ref => innerRef({ ref, replyId: reply.id })}
              key={reply.id}
              type={type}
              parent={parent}
              comment={comment}
              reply={reply}
              userId={userId}
              attachStar={attachStar}
              onDelete={this.onDelete}
              onLikeClick={onLikeClick}
              onEditDone={onEditDone}
              onReplySubmit={this.onReplyOfReplySubmit}
              onRewardCommentEdit={onRewardCommentEdit}
              lastDeletedCommentIndex={lastDeletedCommentIndex}
            />
          )
        })}
      </div>
    )
  }

  loadMoreReplies = () => {
    const { comment, replies, onLoadMoreReplies, parent } = this.props
    const lastReplyId = replies[0] ? replies[0].id : '0'
    onLoadMoreReplies(lastReplyId, comment.id, parent)
  }

  onDelete = replyId => {
    const { onDelete } = this.props
    this.setState({ deleting: true })
    onDelete(replyId)
  }

  onReplyOfReplySubmit = ({ replyContent, reply, parent }) => {
    const { onReplySubmit, type } = this.props
    this.setState({ replying: true })
    onReplySubmit({
      replyContent,
      parent,
      comment: reply,
      replyOfReply: true,
      originType: type
    })
  }
}
