import React, { Component } from 'react';
import CommentInputArea from './CommentInputArea';
import Comment from './Comment';

export default class CommentsSection extends Component {
  render() {
    return (
      <div className="row container-fluid">
        <div className="container-fluid">
          <CommentInputArea
            onSubmit={ comment => this.props.onSubmit(comment) }
          />
          <div className="container-fluid">
            <ul className="media-list">
              { this.renderComments() }
            </ul>
          </div>
        </div>
      </div>
    )
  }

  renderComments() {
    const { comments, noComments } = this.props;
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
          onEditDone={this.props.editVideoCommentAsync}
          onDelete={this.props.deleteVideoCommentAsync}
          onReplyEditDone={this.props.editVideoReplyAsync}
          onReplyDelete={this.props.deleteVideoReplyAsync}
          onReplyLike={this.props.likeVideoReplyAsync}
          onLikeClick={this.props.likeVideoCommentAsync}
          onReplySubmit={this.props.uploadVideoReplyAsync}
          marginTop={index !== 0}
          key={comment.id}
          commentId={comment.id}
        />
      )
    })
  }
}
