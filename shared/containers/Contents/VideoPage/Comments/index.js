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
          onEditDone={this.props.editVideoCommentAsync}
          marginTop={index !== 0}
          key={comment.id}
          commentId={comment.id}
          comment={comment}
          userIsOwner={comment.posterId == this.props.userId}
        />
      )
    })
  }
}
