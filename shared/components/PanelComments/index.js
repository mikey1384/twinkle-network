import React, {Component} from 'react';
import CommentInputArea from './CommentInputArea';
import PanelComment from './PanelComment';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Button from 'components/Button';

export default class PanelComments extends Component {
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
        </div>
      </div>
    )
  }

  loadMoreComments() {
    const {comments, parent, loadMoreComments} = this.props;
    loadMoreComments(comments.length, parent.type, parent.id);
  }

  renderComments() {
    const {comments, userId, parent, contentId, commentActions, type} = this.props;
    return comments.map((comment, index) => {
      return (
        <PanelComment
          {...commentActions}
          type={type}
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
