import React, {Component, PropTypes} from 'react'
import CommentInputArea from './CommentInputArea'
import PanelComment from './PanelComment'
import Button from 'components/Button'
import {scrollElementToCenter} from 'helpers/domHelpers'

export default class PanelComments extends Component {
  static propTypes = {
    comments: PropTypes.array,
    onSubmit: PropTypes.func,
    loadMoreButton: PropTypes.bool,
    inputTypeLabel: PropTypes.string,
    parent: PropTypes.object,
    clickListenerState: PropTypes.bool,
    userId: PropTypes.number,
    commentActions: PropTypes.object,
    type: PropTypes.string,
    loadMoreComments: PropTypes.func
  }

  constructor() {
    super()
    this.state = {
      lastDeletedCommentIndex: null,
      deleteListenerToggle: false,
      deletedFirstComment: false
    }
    this.loadMoreComments = this.loadMoreComments.bind(this)
    this.deleteCallback = this.deleteCallback.bind(this)
  }

  componentDidUpdate(prevProps) {
    const {deleteListenerToggle, deletedFirstComment} = this.state
    if (prevProps.comments.length > this.props.comments.length) {
      if (deletedFirstComment) return scrollElementToCenter(this.PanelComments)
      this.setState({deleteListenerToggle: !deleteListenerToggle})
    }
  }

  render() {
    const {onSubmit, loadMoreButton, comments, inputTypeLabel, parent, clickListenerState} = this.props
    return (
      <div className="row" style={{paddingBottom: '0.5em'}} ref={ref => { this.PanelComments = ref }}>
        <div className="container-fluid">
          <CommentInputArea
            clickListenerState={clickListenerState}
            inputTypeLabel={inputTypeLabel}
            onSubmit={comment => onSubmit(comment, parent)}
          />
          {comments.length !== 0 &&
            <div style={{marginTop: '1.5em'}}>
              <ul className="media-list" style={{marginBottom: '0px'}}>
                {this.renderComments()}
                {loadMoreButton &&
                  <div className="text-center" style={{paddingTop: '1em'}}>
                    <Button className="btn btn-success" onClick={this.loadMoreComments}>Load More</Button>
                  </div>
                }
              </ul>
            </div>
          }
          {comments.length === 0 && loadMoreButton &&
            <div className="text-center" style={{paddingTop: '1em'}}>
              <Button className="btn btn-success" onClick={this.loadMoreComments}>Load More</Button>
            </div>
          }
        </div>
      </div>
    )
  }

  renderComments() {
    const {comments, userId, parent, commentActions, type} = this.props
    const {lastDeletedCommentIndex, deleteListenerToggle} = this.state
    return comments.map((comment, index) => {
      return (
        <PanelComment
          {...commentActions}
          index={index}
          type={type}
          parent={parent}
          comment={comment}
          isFirstComment={index === 0}
          marginTop={index !== 0}
          key={comment.id}
          userId={userId}
          deleteCallback={this.deleteCallback}
          lastDeletedCommentIndex={lastDeletedCommentIndex}
          deleteListenerToggle={deleteListenerToggle}
        />
      )
    })
  }

  deleteCallback(index, isFirstComment) {
    this.setState({
      lastDeletedCommentIndex: index,
      deletedFirstComment: isFirstComment
    })
  }

  loadMoreComments() {
    const {comments, parent, loadMoreComments} = this.props
    const lastCommentId = comments[comments.length - 1] ? comments[comments.length - 1].id : 0
    loadMoreComments(lastCommentId, parent.type, parent.id)
  }
}
