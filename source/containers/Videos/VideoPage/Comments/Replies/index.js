import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Reply from './Reply'
import Button from 'components/Button'
import { scrollElementToCenter } from 'helpers/domHelpers'

export default class Replies extends Component {
  static propTypes = {
    comment: PropTypes.object.isRequired,
    commentId: PropTypes.number.isRequired,
    innerRef: PropTypes.func,
    onDelete: PropTypes.func.isRequired,
    onEditDone: PropTypes.func.isRequired,
    onLikeClick: PropTypes.func.isRequired,
    onLoadMoreReplies: PropTypes.func.isRequired,
    onReplySubmit: PropTypes.func.isRequired,
    replies: PropTypes.array.isRequired,
    Replies: PropTypes.object,
    userId: PropTypes.number,
    videoId: PropTypes.number.isRequired
  }

  state = {
    deleting: false
  }

  componentDidUpdate(prevProps) {
    const { deleting } = this.state
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
  }

  render() {
    const {
      comment,
      innerRef,
      replies,
      userId,
      onEditDone,
      onLikeClick,
      onReplySubmit,
      commentId,
      videoId
    } = this.props
    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          marginTop: replies.length > 0 && '1rem'
        }}
        ref={ref => {
          this.ReplyContainer = ref
        }}
      >
        {comment.loadMoreReplies && (
          <Button
            filled
            logo
            style={{
              width: '100%',
              marginBottom: replies.length !== 0 && '1.5rem'
            }}
            onClick={this.loadMoreReplies}
          >
            Load More
          </Button>
        )}
        {replies.map((reply, index) => {
          return (
            <Reply
              {...reply}
              innerRef={ref => innerRef({ ref, replyId: reply.id })}
              index={index}
              commentId={commentId}
              videoId={videoId}
              onReplySubmit={onReplySubmit}
              onEditDone={onEditDone}
              onLikeClick={onLikeClick}
              onDelete={this.onDelete}
              myId={userId}
              key={reply.id}
              isFirstReply={index === 0}
            />
          )
        })}
      </div>
    )
  }

  loadMoreReplies = () => {
    const { comment, replies, onLoadMoreReplies } = this.props
    const lastReplyId = replies[0] ? replies[0].id : '0'
    onLoadMoreReplies(lastReplyId, comment.id, 'default')
  }

  onDelete = replyId => {
    const { onDelete } = this.props
    this.setState({ deleting: true })
    onDelete(replyId)
  }
}
