import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Context from './Context'
import CommentInputArea from './CommentInputArea'
import Comment from './Comment'
import Button from 'components/Button'
import { scrollElementToCenter } from 'helpers/domHelpers'
import request from 'axios'
import { URL } from 'constants/URL'
import { auth, handleError } from 'helpers/requestHelpers'
import { connect } from 'react-redux'

const API_URL = `${URL}/content`

class Comments extends Component {
  static propTypes = {
    autoFocus: PropTypes.bool,
    autoShowComments: PropTypes.bool,
    commentsLoaded: PropTypes.bool,
    comments: PropTypes.array.isRequired,
    handleError: PropTypes.func.isRequired,
    inputAreaInnerRef: PropTypes.func,
    inputAtBottom: PropTypes.bool,
    inputTypeLabel: PropTypes.string,
    loadMoreButton: PropTypes.bool.isRequired,
    loadMoreComments: PropTypes.func.isRequired,
    onAttachStar: PropTypes.func.isRequired,
    onCommentSubmit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEditDone: PropTypes.func.isRequired,
    onLikeClick: PropTypes.func.isRequired,
    onLoadMoreReplies: PropTypes.func.isRequired,
    onReplySubmit: PropTypes.func.isRequired,
    onRewardCommentEdit: PropTypes.func.isRequired,
    parent: PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired
    }).isRequired,
    style: PropTypes.object,
    userId: PropTypes.number
  }

  state = {
    isLoading: false,
    commentSubmitted: false
  }

  Comments = {}

  componentDidUpdate(prevProps) {
    const { commentSubmitted } = this.state
    const {
      autoShowComments,
      comments,
      commentsLoaded,
      inputAtBottom
    } = this.props
    if (prevProps.comments.length > comments.length) {
      if (comments.length === 0) {
        return scrollElementToCenter(this.Container)
      }
      if (
        comments[comments.length - 1].id !==
        prevProps.comments[prevProps.comments.length - 1].id
      ) {
        scrollElementToCenter(this.Comments[comments[comments.length - 1].id])
      }
    }
    if (
      inputAtBottom &&
      commentSubmitted &&
      comments.length > prevProps.comments.length &&
      (prevProps.comments.length === 0 ||
        comments[comments.length - 1].id >
          prevProps.comments[prevProps.comments.length - 1].id)
    ) {
      this.setState({ commentSubmitted: false })
      scrollElementToCenter(this.Comments[comments[comments.length - 1].id])
    }
    if (
      !inputAtBottom &&
      commentSubmitted &&
      comments.length > prevProps.comments.length &&
      (prevProps.comments.length === 0 ||
        comments[0].id > prevProps.comments[0].id)
    ) {
      this.setState({ commentSubmitted: false })
      scrollElementToCenter(this.Comments[comments[0].id])
    }

    if (
      !autoShowComments &&
      !prevProps.commentsLoaded &&
      commentsLoaded &&
      !commentSubmitted
    ) {
      scrollElementToCenter(this.CommentInputArea)
    }
  }

  render() {
    const {
      autoFocus,
      autoShowComments,
      loadMoreButton,
      comments = [],
      commentsLoaded,
      inputAreaInnerRef,
      inputTypeLabel,
      style,
      inputAtBottom,
      onAttachStar,
      onEditDone,
      onLikeClick,
      onLoadMoreReplies,
      onRewardCommentEdit,
      parent,
      userId
    } = this.props
    return (
      <Context.Provider
        value={{
          onAttachStar,
          onDelete: this.onDelete,
          onEditDone,
          onLikeClick,
          onLoadMoreReplies,
          onRewardCommentEdit,
          onReplySubmit: this.onCommentSubmit
        }}
      >
        <div
          style={{
            width: '100%',
            ...style
          }}
          ref={ref => {
            this.Container = ref
          }}
        >
          {!inputAtBottom && (
            <CommentInputArea
              autoFocus={autoFocus}
              InputFormRef={ref => (this.CommentInputArea = ref)}
              innerRef={inputAreaInnerRef}
              inputTypeLabel={inputTypeLabel}
              onSubmit={this.onCommentSubmit}
            />
          )}
          {comments.length > 0 &&
            (autoShowComments || commentsLoaded) && (
              <div style={{ width: '100%' }}>
                {inputAtBottom && loadMoreButton && this.renderLoadMoreButton()}
                {comments.map((comment, index) => (
                  <Comment
                    index={index}
                    innerRef={ref => {
                      this.Comments[comment.id] = ref
                    }}
                    parent={parent}
                    comment={comment}
                    key={comment.id}
                    userId={userId}
                  />
                ))}
                {!inputAtBottom &&
                  loadMoreButton &&
                  this.renderLoadMoreButton()}
              </div>
            )}
          {inputAtBottom && (
            <CommentInputArea
              autoFocus={autoFocus}
              InputFormRef={ref => (this.CommentInputArea = ref)}
              innerRef={inputAreaInnerRef}
              style={{ marginTop: comments.length > 0 ? '1rem' : 0 }}
              inputTypeLabel={inputTypeLabel}
              onSubmit={this.onCommentSubmit}
            />
          )}
        </div>
      </Context.Provider>
    )
  }

  onCommentSubmit = async({ content, rootCommentId, targetCommentId }) => {
    const { handleError, onCommentSubmit, onReplySubmit, parent } = this.props
    this.setState({ commentSubmitted: true })
    try {
      const { data } = await request.post(
        `${API_URL}/comments`,
        { content, parent, rootCommentId, targetCommentId },
        auth()
      )
      targetCommentId ? onReplySubmit(data) : onCommentSubmit(data)
    } catch (error) {
      handleError(error)
    }
  }

  loadMoreComments = async() => {
    const { isLoading } = this.state
    const { inputAtBottom } = this.props
    if (!isLoading) {
      const { comments, parent, loadMoreComments } = this.props
      this.setState({ isLoading: true })
      const lastCommentLocation = inputAtBottom ? 0 : comments.length - 1
      const lastCommentId = comments[lastCommentLocation]
        ? comments[lastCommentLocation].id
        : 0
      try {
        const { data } = await request.get(
          `${API_URL}/comments?lastCommentId=${lastCommentId}&type=${
            parent.type
          }&contentId=${parent.id}&rootType=${parent.type}`
        )
        loadMoreComments(data)
        this.setState({ isLoading: false })
      } catch (error) {
        console.error(error.response || error)
      }
    }
  }

  onDelete = async commentId => {
    const { onDelete, handleError } = this.props
    try {
      await request.delete(`${API_URL}/comments?commentId=${commentId}`, auth())
      onDelete(commentId)
    } catch (error) {
      handleError(error)
    }
  }

  renderLoadMoreButton = () => {
    const { isLoading } = this.state
    return (
      <Button
        filled
        info
        disabled={isLoading}
        onClick={this.loadMoreComments}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          marginTop: '1rem'
        }}
      >
        Load More
      </Button>
    )
  }
}

export default connect(
  null,
  dispatch => ({
    handleError: error => handleError(error, dispatch)
  })
)(Comments)
