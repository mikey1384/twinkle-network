import React, {Component, PropTypes} from 'react'
import CommentInputArea from './CommentInputArea'
import Comment from './Comment'
import {connect} from 'react-redux'
import Button from 'components/Button'
import {
  editVideoCommentAsync,
  deleteVideoCommentAsync,
  editVideoReplyAsync,
  likeVideoComment,
  uploadVideoReplyAsync,
  loadMoreCommentsAsync,
  loadMoreReplies
} from 'redux/actions/VideoActions'

@connect(
  state => ({
    loadMoreCommentsButton: state.VideoReducer.videoPage.loadMoreCommentsButton
  }),
  {
    onEditDone: editVideoCommentAsync,
    onDelete: deleteVideoCommentAsync,
    onReplyEditDone: editVideoReplyAsync,
    onLikeClick: likeVideoComment,
    onReplySubmit: uploadVideoReplyAsync,
    loadMoreComments: loadMoreCommentsAsync,
    loadMoreReplies
  }
)
export default class Comments extends Component {
  static propTypes = {
    comments: PropTypes.array,
    loadMoreCommentsButton: PropTypes.bool,
    loadMoreDebatesButton: PropTypes.bool,
    loadMoreComments: PropTypes.func,
    videoId: PropTypes.number,
    debates: PropTypes.array,
    noComments: PropTypes.bool,
    onEditDone: PropTypes.func,
    loadMoreReplies: PropTypes.func,
    onDelete: PropTypes.func,
    onReplyEditDone: PropTypes.func,
    onLikeClick: PropTypes.func,
    onReplySubmit: PropTypes.func
  }

  constructor() {
    super()
    this.state = {
      lastDeletedCommentIndex: null,
      deleteListenerToggle: false
    }
    this.deleteCallback = this.deleteCallback.bind(this)
  }

  componentDidUpdate(prevProps) {
    const {deleteListenerToggle} = this.state
    if (prevProps.comments.length > this.props.comments.length) {
      if (this.props.comments.length === 0) return
      this.setState({deleteListenerToggle: !deleteListenerToggle})
    }
  }

  render() {
    const {
      loadMoreCommentsButton, loadMoreDebatesButton, loadMoreComments, videoId, comments, debates
    } = this.props
    return (
      <div className="row container-fluid" style={{paddingBottom: '1em'}}>
        <div className="container-fluid">
          <CommentInputArea videoId={videoId} debates={debates} loadMoreDebatesButton={loadMoreDebatesButton} />
          <div className="container-fluid">
            <ul className="media-list" ref={ref => { this.Comments = ref }}>
              {this.renderComments()}
              {loadMoreCommentsButton &&
                <div className="text-center" style={{paddingTop: '2em'}}>
                  <Button
                    className="btn btn-success"
                    onClick={() => loadMoreComments(videoId, comments[comments.length - 1].id)}
                  >
                    Load More
                  </Button>
                </div>
              }
            </ul>
          </div>
        </div>
      </div>
    )
  }

  renderComments() {
    const {comments, noComments} = this.props
    const {lastDeletedCommentIndex, deleteListenerToggle} = this.state
    if (noComments) {
      return <li className="text-center">There are no comments, yet.</li>
    } else if (comments.length === 0) {
      return <li className="text-center">Loading...</li>
    }
    return comments.map((comment, index) => {
      return (
        <Comment
          {...this.props}
          index={index}
          comment={comment}
          onEditDone={this.props.onEditDone}
          onLoadMoreReplies={this.props.loadMoreReplies}
          onDelete={this.props.onDelete}
          onReplyEditDone={this.props.onReplyEditDone}
          onLikeClick={this.props.onLikeClick}
          onReplySubmit={this.props.onReplySubmit}
          marginTop={index !== 0}
          key={comment.id}
          commentId={comment.id}
          deleteCallback={this.deleteCallback}
          lastDeletedCommentIndex={lastDeletedCommentIndex}
          deleteListenerToggle={deleteListenerToggle}
        />
      )
    })
  }

  deleteCallback(index) {
    this.setState({lastDeletedCommentIndex: index})
  }
}
