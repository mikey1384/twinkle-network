import PropTypes from 'prop-types'
import React, { Component } from 'react'
import CommentInputArea from './CommentInputArea'
import PanelComment from './PanelComment'
import Button from 'components/Button'
import { scrollElementToCenter } from 'helpers/domHelpers'

export default class PanelComments extends Component {
  static propTypes = {
    autoFocus: PropTypes.bool,
    clickListenerState: PropTypes.bool,
    commentActions: PropTypes.object.isRequired,
    comments: PropTypes.array.isRequired,
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
    lastDeletedCommentIndex: null,
    deleteListenerToggle: false,
    deletedFirstComment: false
  }

  componentDidUpdate(prevProps) {
    const { deleteListenerToggle, deletedFirstComment } = this.state
    if (prevProps.comments.length > this.props.comments.length) {
      if (deletedFirstComment) return scrollElementToCenter(this.PanelComments)
      this.setState({ deleteListenerToggle: !deleteListenerToggle })
    }
  }

  render() {
    const {
      onSubmit,
      autoFocus,
      loadMoreButton,
      comments,
      inputTypeLabel,
      parent,
      style,
      clickListenerState
    } = this.props
    const { isLoading } = this.state
    return (
      <div
        style={{
          ...style,
          width: '100%'
        }}
        ref={ref => {
          this.PanelComments = ref
        }}
      >
        <CommentInputArea
          autoFocus={autoFocus}
          clickListenerState={clickListenerState}
          inputTypeLabel={inputTypeLabel}
          onSubmit={comment => onSubmit(comment, parent)}
        />
        {comments.length > 0 && (
          <div style={{ width: '100%' }}>
            {this.renderComments()}
            {loadMoreButton && (
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '1rem'
                }}
              >
                <Button
                  className="btn btn-success"
                  disabled={isLoading}
                  onClick={this.loadMoreComments}
                >
                  Load More
                </Button>
              </div>
            )}
          </div>
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
    if (!isLoading) {
      const { comments, parent, loadMoreComments } = this.props
      this.setState({ isLoading: true }, async() => {
        const lastCommentId = comments[comments.length - 1]
          ? comments[comments.length - 1].id
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
