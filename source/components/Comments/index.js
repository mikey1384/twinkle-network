import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Context from './Context';
import CommentInputArea from './CommentInputArea';
import Comment from './Comment';
import Button from 'components/Button';
import { scrollElementToCenter } from 'helpers/domHelpers';
import {
  deleteContent,
  loadComments,
  uploadComment
} from 'helpers/requestHelpers';
import { connect } from 'react-redux';

class Comments extends Component {
  static propTypes = {
    autoExpand: PropTypes.bool,
    autoFocus: PropTypes.bool,
    numPreviews: PropTypes.number,
    className: PropTypes.string,
    commentsShown: PropTypes.bool,
    comments: PropTypes.array.isRequired,
    commentsLoadLimit: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
    inputAreaInnerRef: PropTypes.func,
    inputAtBottom: PropTypes.bool,
    inputTypeLabel: PropTypes.string,
    loadMoreButton: PropTypes.bool.isRequired,
    loadMoreComments: PropTypes.func.isRequired,
    noInput: PropTypes.bool,
    onAttachStar: PropTypes.func.isRequired,
    onCommentSubmit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEditDone: PropTypes.func.isRequired,
    onLikeClick: PropTypes.func.isRequired,
    onLoadMoreReplies: PropTypes.func.isRequired,
    onReplySubmit: PropTypes.func.isRequired,
    onRewardCommentEdit: PropTypes.func.isRequired,
    parent: PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired
    }).isRequired,
    style: PropTypes.object,
    userId: PropTypes.number
  };

  state = {
    deleting: false,
    isLoading: false,
    commentSubmitted: false
  };

  Comments = {};

  componentDidUpdate(prevProps) {
    const { commentSubmitted, deleting } = this.state;
    const {
      autoFocus,
      autoExpand,
      comments,
      commentsShown,
      inputAtBottom
    } = this.props;
    if (prevProps.comments.length > comments.length && deleting) {
      this.setState({ deleting: false });
      if (comments.length === 0) {
        return scrollElementToCenter(this.Container);
      }
      if (
        comments[comments.length - 1].id !==
        prevProps.comments[prevProps.comments.length - 1].id
      ) {
        scrollElementToCenter(this.Comments[comments[comments.length - 1].id]);
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
      this.setState({ commentSubmitted: false });
      scrollElementToCenter(this.Comments[comments[comments.length - 1].id]);
    }
    if (
      !inputAtBottom &&
      commentSubmitted &&
      comments.length > prevProps.comments.length &&
      (prevProps.comments.length === 0 ||
        comments[0].id > prevProps.comments[0].id)
    ) {
      this.setState({ commentSubmitted: false });
      scrollElementToCenter(this.Comments[comments[0].id]);
    }

    if (
      !autoExpand &&
      !prevProps.commentsShown &&
      !commentSubmitted &&
      autoFocus &&
      commentsShown
    ) {
      scrollElementToCenter(this.CommentInputArea);
    }
  }

  render() {
    const {
      autoExpand,
      className,
      comments = [],
      commentsShown,
      inputAtBottom,
      loadMoreButton,
      noInput,
      numPreviews,
      onAttachStar,
      onEditDone,
      onLikeClick,
      onLoadMoreReplies,
      onRewardCommentEdit,
      parent,
      style,
      userId
    } = this.props;
    let previewComments = [];
    if (numPreviews > 0 && !autoExpand && !commentsShown) {
      previewComments = comments.filter(
        (comment, index) => index < numPreviews
      );
    }
    return (
      <Context.Provider
        value={{
          onAttachStar,
          onDelete: this.onDelete,
          onEditDone,
          onLikeClick,
          onLoadMoreReplies,
          onRewardCommentEdit,
          onReplySubmit: this.onReplySubmit
        }}
      >
        <div
          className={className}
          style={{
            ...style
          }}
          ref={ref => {
            this.Container = ref;
          }}
        >
          {!inputAtBottom &&
            !noInput &&
            (commentsShown || autoExpand) &&
            this.renderInputArea()}
          {(commentsShown || autoExpand || numPreviews > 0) && (
            <div style={{ width: '100%' }}>
              {inputAtBottom && loadMoreButton && this.renderLoadMoreButton()}
              {(previewComments.length > 0 ? previewComments : comments).map(
                (comment, index) => (
                  <Comment
                    isPreview={previewComments.length > 0}
                    index={index}
                    innerRef={ref => {
                      this.Comments[comment.id] = ref;
                    }}
                    parent={parent}
                    comment={comment}
                    key={comment.id}
                    userId={userId}
                  />
                )
              )}
              {!inputAtBottom && loadMoreButton && this.renderLoadMoreButton()}
            </div>
          )}
          {inputAtBottom &&
            !noInput &&
            (commentsShown || autoExpand) &&
            this.renderInputArea({
              marginTop: comments.length > 0 ? '1rem' : 0
            })}
        </div>
      </Context.Provider>
    );
  }

  onCommentSubmit = async({ content, rootCommentId, targetCommentId }) => {
    const { dispatch, onCommentSubmit, parent } = this.props;
    this.setState({ commentSubmitted: true });
    const data = await uploadComment({
      content,
      parent,
      rootCommentId,
      targetCommentId,
      dispatch
    });
    if (data) onCommentSubmit(data);
  };

  onReplySubmit = async({ content, rootCommentId, targetCommentId }) => {
    const { dispatch, onReplySubmit, parent } = this.props;
    this.setState({ commentSubmitted: true });
    const data = await uploadComment({
      content,
      parent,
      rootCommentId,
      targetCommentId,
      dispatch
    });
    if (data) onReplySubmit(data);
  };

  loadMoreComments = async() => {
    const { isLoading } = this.state;
    const { commentsLoadLimit, inputAtBottom } = this.props;
    if (!isLoading) {
      const { comments, parent, loadMoreComments } = this.props;
      this.setState({ isLoading: true });
      const lastCommentLocation = inputAtBottom ? 0 : comments.length - 1;
      const lastCommentId = comments[lastCommentLocation]
        ? comments[lastCommentLocation].id
        : 'undefined';
      try {
        const data = await loadComments({
          id: parent.id,
          type: parent.type,
          lastCommentId,
          limit: commentsLoadLimit
        });
        if (data) loadMoreComments(data);
        this.setState({ isLoading: false });
      } catch (error) {
        console.error(error.response || error);
      }
    }
  };

  onDelete = async commentId => {
    const { dispatch, onDelete } = this.props;
    this.setState({ deleting: true });
    await deleteContent({ id: commentId, type: 'comment', dispatch });
    onDelete(commentId);
  };

  renderInputArea = style => {
    const { autoFocus, inputAreaInnerRef, inputTypeLabel, parent } = this.props;
    return (
      <CommentInputArea
        autoFocus={autoFocus}
        InputFormRef={ref => (this.CommentInputArea = ref)}
        innerRef={inputAreaInnerRef}
        style={style}
        inputTypeLabel={inputTypeLabel}
        onSubmit={this.onCommentSubmit}
        rootCommentId={parent.type === 'comment' ? parent.commentId : null}
        targetCommentId={parent.type === 'comment' ? parent.id : null}
      />
    );
  };

  renderLoadMoreButton = () => {
    const { isLoading } = this.state;
    const { inputAtBottom } = this.props;
    return (
      <Button
        filled
        info
        disabled={isLoading}
        onClick={this.loadMoreComments}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          marginTop: inputAtBottom ? 0 : '1rem'
        }}
      >
        Load More
      </Button>
    );
  };
}

export default connect(
  null,
  dispatch => ({ dispatch })
)(Comments);
