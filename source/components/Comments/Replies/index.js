import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Reply from './Reply'
import { scrollElementToCenter } from 'helpers/domHelpers'
import Button from 'components/Button'
import { URL } from 'constants/URL'
import request from 'axios'

const API_URL = `${URL}/content`

export default class Replies extends Component {
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
      replies,
      userId,
      onDelete,
      onEditDone,
      onRewardCommentEdit,
      onLikeClick,
      onReplySubmit,
      comment,
      parent
    } = this.props
    return (
      <div ref={ref => (this.ReplyContainer = ref)}>
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
            <Reply
              index={index}
              innerRef={ref => innerRef({ ref, replyId: reply.id })}
              key={reply.id}
              parent={parent}
              comment={comment}
              reply={reply}
              userId={userId}
              attachStar={attachStar}
              onDelete={onDelete}
              onLikeClick={onLikeClick}
              onEditDone={onEditDone}
              onReplySubmit={onReplySubmit}
              onRewardCommentEdit={onRewardCommentEdit}
            />
          )
        })}
      </div>
    )
  }

  loadMoreReplies = async() => {
    const { comment, onLoadMoreReplies, replies } = this.props
    try {
      const lastReplyId = replies[0] ? replies[0].id : '0'
      const { data } = await request.get(
        `${API_URL}/replies?lastReplyId=${lastReplyId}&commentId=${comment.id}`
      )
      onLoadMoreReplies(data)
    } catch (error) {
      console.error(error.response, error)
    }
  }
}
