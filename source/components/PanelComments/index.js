import PropTypes from 'prop-types'
import React, { Component } from 'react'
import CommentInputArea from './CommentInputArea'
import PanelComment from './PanelComment'
import Button from 'components/Button'
import { scrollElementToCenter } from 'helpers/domHelpers'

export default class PanelComments extends Component {
  static propTypes = {
    autoFocus: PropTypes.bool,
    autoShowComments: PropTypes.bool,
    commentActions: PropTypes.object.isRequired,
    commentsLoaded: PropTypes.bool,
    comments: PropTypes.array.isRequired,
    inputAreaInnerRef: PropTypes.func,
    inputAtBottom: PropTypes.bool,
    inputTypeLabel: PropTypes.string,
    loadMoreButton: PropTypes.bool.isRequired,
    loadMoreComments: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    parent: PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired
    }).isRequired,
    style: PropTypes.object,
    type: PropTypes.string,
    userId: PropTypes.number
  }

  state = {
    isLoading: false,
    commentSubmitted: false,
    lastDeletedCommentIndex: null
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
        return scrollElementToCenter(this.PanelComments)
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
      onSubmit,
      autoFocus,
      loadMoreButton,
      comments = [],
      inputAreaInnerRef,
      inputTypeLabel,
      parent,
      style,
      inputAtBottom
    } = this.props
    const { isLoading } = this.state
    return (
      <div
        style={{
          width: '100%',
          ...style
        }}
        ref={ref => {
          this.PanelComments = ref
        }}
      >
        {!inputAtBottom && (
          <CommentInputArea
            autoFocus={autoFocus}
            InputFormRef={ref => (this.CommentInputArea = ref)}
            innerRef={inputAreaInnerRef}
            inputTypeLabel={inputTypeLabel}
            onSubmit={comment => {
              this.setState({ commentSubmitted: true })
              onSubmit(comment, parent)
            }}
          />
        )}
        {comments.length > 0 && (
          <div style={{ width: '100%' }}>
            {inputAtBottom &&
              loadMoreButton && (
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
              )}
            {this.renderComments()}
            {!inputAtBottom &&
              loadMoreButton && (
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
              )}
          </div>
        )}
        {inputAtBottom && (
          <CommentInputArea
            autoFocus={autoFocus}
            InputFormRef={ref => (this.CommentInputArea = ref)}
            innerRef={inputAreaInnerRef}
            style={{ marginTop: comments.length > 0 ? '1rem' : 0 }}
            inputTypeLabel={inputTypeLabel}
            onSubmit={comment => {
              this.setState({ commentSubmitted: true })
              onSubmit(comment, parent)
            }}
          />
        )}
      </div>
    )
  }

  renderComments = () => {
    const { comments, userId, parent, commentActions, type } = this.props
    const { lastDeletedCommentIndex, deleteListenerToggle } = this.state
    return comments.map((comment, index) => (
      <PanelComment
        {...commentActions}
        index={index}
        innerRef={ref => {
          this.Comments[comment.id] = ref
        }}
        type={type}
        parent={parent}
        comment={comment}
        isFirstComment={index === 0}
        key={comment.id}
        userId={userId}
        deleteCallback={this.deleteCallback}
        lastDeletedCommentIndex={lastDeletedCommentIndex}
        deleteListenerToggle={deleteListenerToggle}
      />
    ))
  }

  deleteCallback = (index, isFirstComment) => {
    this.setState({
      lastDeletedCommentIndex: index,
      deletedFirstComment: isFirstComment
    })
  }

  loadMoreComments = () => {
    const { isLoading } = this.state
    const { inputAtBottom } = this.props
    if (!isLoading) {
      const { comments, parent, loadMoreComments } = this.props
      this.setState({ isLoading: true }, async() => {
        const lastCommentLocation = inputAtBottom ? 0 : comments.length - 1
        const lastCommentId = comments[lastCommentLocation]
          ? comments[lastCommentLocation].id
          : 0
        try {
          await loadMoreComments({
            lastCommentId,
            type: parent.type,
            contentId: parent.id,
            rootType: parent.type
          })
          this.setState({ isLoading: false })
        } catch (error) {
          console.error(error)
        }
      })
    }
  }
}
