import React, {Component} from 'react';
import CommentInputArea from './CommentInputArea';
import Comment from './Comment';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
  editVideoCommentAsync,
  deleteVideoCommentAsync,
  editVideoReplyAsync,
  deleteVideoReplyAsync,
  likeVideoReplyAsync,
  likeVideoCommentAsync,
  uploadVideoReplyAsync
} from 'redux/actions/VideoActions';

@connect(
  null,
  {
    onEditDone: editVideoCommentAsync,
    onDelete: deleteVideoCommentAsync,
    onReplyEditDone: editVideoReplyAsync,
    onReplyDelete: deleteVideoReplyAsync,
    onReplyLike: likeVideoReplyAsync,
    onLikeClick: likeVideoCommentAsync,
    onReplySubmit: uploadVideoReplyAsync
  }
)
export default class CommentsSection extends Component {
  render() {
    const {onSubmit} = this.props;
    return (
      <div className="row container-fluid">
        <div className="container-fluid">
          <CommentInputArea
            onSubmit={comment => onSubmit(comment)}
          />
          <div className="container-fluid">
            <ul className="media-list">
              {this.renderComments()}
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
          onReplyDelete={this.props.onReplyDelete}
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
