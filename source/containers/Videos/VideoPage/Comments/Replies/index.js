import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Reply from './Reply'
import { scrollElementToCenter } from 'helpers/domHelpers'
import Button from 'components/Button'

export default class Replies extends Component {
  static propTypes = {
    comment: PropTypes.object.isRequired,
    commentId: PropTypes.number.isRequired,
    isCreator: PropTypes.bool,
    onDelete: PropTypes.func.isRequired,
    onEditDone: PropTypes.func.isRequired,
    onLikeClick: PropTypes.func.isRequired,
    onLoadMoreReplies: PropTypes.func.isRequired,
    onReplySubmit: PropTypes.func.isRequired,
    replies: PropTypes.array.isRequired,
    userId: PropTypes.number,
    videoId: PropTypes.number.isRequired
  }

  constructor() {
    super()
    this.state = {
      lastDeletedCommentIndex: null,
      deleteListenerToggle: false,
      deletedFirstReply: false
    }
    this.deleteCallback = this.deleteCallback.bind(this)
    this.loadMoreReplies = this.loadMoreReplies.bind(this)
  }

  componentDidUpdate(prevProps) {
    const length = this.props.replies.length
    const { deleteListenerToggle, deletedFirstReply } = this.state
    if (length < prevProps.replies.length) {
      if (length === 0) {
        if (deletedFirstReply) return scrollElementToCenter(this.Replies)
        return
      }
      this.setState({ deleteListenerToggle: !deleteListenerToggle })
    }
  }

  render() {
    const {
      comment,
      isCreator,
      replies,
      userId,
      onEditDone,
      onLikeClick,
      onDelete,
      onReplySubmit,
      commentId,
      videoId
    } = this.props
    const { lastDeletedCommentIndex, deleteListenerToggle } = this.state
    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          marginTop: '1rem'
        }}
        ref={ref => {
          this.Replies = ref
        }}
      >
        {comment.loadMoreReplies && (
          <Button
            filled
            info
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
              index={index}
              commentId={commentId}
              videoId={videoId}
              onReplySubmit={onReplySubmit}
              onEditDone={onEditDone}
              onLikeClick={onLikeClick}
              onDelete={onDelete}
              myId={userId}
              key={reply.id}
              userIsOwner={reply.userId === userId || isCreator}
              deleteCallback={this.deleteCallback}
              lastDeletedCommentIndex={lastDeletedCommentIndex}
              deleteListenerToggle={deleteListenerToggle}
              isFirstReply={index === 0}
            />
          )
        })}
      </div>
    )
  }

  deleteCallback(index, isFirstReply) {
    this.setState({
      lastDeletedCommentIndex: index,
      deletedFirstReply: isFirstReply
    })
  }

  loadMoreReplies() {
    const { comment, replies, onLoadMoreReplies } = this.props
    const lastReplyId = replies[0] ? replies[0].id : '0'
    onLoadMoreReplies(lastReplyId, comment.id, 'default')
  }
}
