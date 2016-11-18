import React, {Component} from 'react';
import CommentInputArea from './CommentInputArea';
import Comment from './Comment';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Button from 'components/Button';
import {
  editVideoCommentAsync,
  deleteVideoCommentAsync,
  editVideoReplyAsync,
  likeVideoReplyAsync,
  likeVideoComment,
  uploadVideoReplyAsync,
  loadMoreCommentsAsync
} from 'redux/actions/VideoActions';

@connect(
  state => ({
    loadMoreCommentsButton: state.VideoReducer.videoPage.loadMoreCommentsButton
  }),
  {
    onEditDone: editVideoCommentAsync,
    onDelete: deleteVideoCommentAsync,
    onReplyEditDone: editVideoReplyAsync,
    onReplyLike: likeVideoReplyAsync,
    onLikeClick: likeVideoComment,
    onReplySubmit: uploadVideoReplyAsync,
    loadMoreComments: loadMoreCommentsAsync
  }
)
export default class Comments extends Component {
  render() {
    const {
      loadMoreCommentsButton, loadMoreDebatesButton, loadMoreComments, videoId, comments, debates
    } = this.props;
    return (
      <div className="row container-fluid" style={{paddingBottom: '1em'}}>
        <div className="container-fluid">
          <CommentInputArea videoId={videoId} debates={debates} loadMoreDebatesButton={loadMoreDebatesButton} />
          <div className="container-fluid">
            <ul className="media-list">
              {this.renderComments()}
              {loadMoreCommentsButton &&
                <div className="text-center" style={{paddingTop: '2em'}}>
                  <Button
                    className="btn btn-success"
                    onClick={() => loadMoreComments(videoId, comments.length)}
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
    const {comments, noComments} = this.props;
    if (noComments) {
      return <li className="text-center">There are no comments, yet.</li>
    }
    else if (comments.length === 0) {
      return <li className="text-center">Loading...</li>
    }
    return comments.map((comment, index) => {
      return (
        <Comment
          {...this.props}
          comment={comment}
          onEditDone={this.props.onEditDone}
          onDelete={this.props.onDelete}
          onReplyEditDone={this.props.onReplyEditDone}
          onReplyLike={this.props.onReplyLike}
          onLikeClick={this.props.onLikeClick}
          onReplySubmit={this.props.onReplySubmit}
          marginTop={index !== 0}
          key={comment.id}
          commentId={comment.id}
        />
      )
    })
  }
}
