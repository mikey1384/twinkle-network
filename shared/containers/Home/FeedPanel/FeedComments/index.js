import React, {Component} from 'react';
import CommentInputArea from './CommentInputArea';
import FeedComment from './FeedComment';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Button from 'components/Button';
import {
  loadMoreFeedCommentsAsync,
  uploadFeedVideoCommentAsync
} from 'redux/actions/FeedActions';


@connect(
  null,
  {
    loadMoreComments: loadMoreFeedCommentsAsync,
    onSubmit: uploadFeedVideoCommentAsync
  }
)
export default class FeedComments extends Component {
  constructor() {
    super()
    this.loadMoreComments = this.loadMoreComments.bind(this)
  }

  render() {
    const {onSubmit, loadMoreButton, comments, inputTypeLabel, parent} = this.props;
    return (
      <div className="row" style={{paddingBottom: '0.5em'}}>
        <div className="container-fluid">
          <CommentInputArea
            inputTypeLabel={inputTypeLabel}
            onSubmit={commentContent => onSubmit(parent, commentContent)}
          />
          {comments.length !== 0 &&
            <div style={{marginTop: '1.5em'}}>
              <ul className="media-list" style={{marginBottom: '0px'}}>
                {this.renderComments()}
                {loadMoreButton &&
                  <div className="text-center" style={{paddingTop: '1em'}}>
                    <Button className="btn btn-info" onClick={this.loadMoreComments}>Load More</Button>
                  </div>
                }
              </ul>
            </div>
          }
        </div>
      </div>
    )
  }

  loadMoreComments() {
    const {comments, parent, loadMoreComments} = this.props;
    loadMoreComments(parent.type, parent.id, comments.length);
  }

  renderComments() {
    const {comments, userId, parent} = this.props;
    return comments.map((comment, index) => {
      return (
        <FeedComment
          parent={parent}
          comment={comment}
          marginTop={index !== 0}
          key={comment.id}
          userId={userId}
        />
      )
    })
  }
}
