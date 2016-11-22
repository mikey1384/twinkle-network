import React, {Component} from 'react';
import Button from 'components/Button';
import {timeSince} from 'helpers/timeStampHelpers';
import UsernameText from 'components/UsernameText';
import PanelComments from 'components/PanelComments';
import {connect} from 'react-redux';
import {
  deleteVideoCommentAsync,
  editVideoCommentAsync,
  loadVideoDebateComments,
  loadMoreDebateComments,
  uploadVideoDebateComment,
  uploadVideoDebateReply,
  likeVideoComment,
  loadMoreReplies
} from 'redux/actions/VideoActions';

@connect(
  state => ({
    myId: state.UserReducer.userId
  }),
  {
    onDelete: deleteVideoCommentAsync,
    onEditDone: editVideoCommentAsync,
    loadComments: loadVideoDebateComments,
    loadMoreComments: loadMoreDebateComments,
    onSubmit: uploadVideoDebateComment,
    onLikeClick: likeVideoComment,
    onReplySubmit: uploadVideoDebateReply,
    onLoadMoreReplies: loadMoreReplies
  }
)
export default class DebatePanel extends Component {
  constructor() {
    super()
    this.state = {
      expanded: false
    }
    this.onExpand = this.onExpand.bind(this)
    this.onCommentSubmit = this.onCommentSubmit.bind(this)
    this.onReplySubmit = this.onReplySubmit.bind(this)
    this.loadMoreComments = this.loadMoreComments.bind(this)
  }

  render() {
    const {
      id, title, description, username, userId, videoId, timeStamp, numComments, myId,
      comments, loadMoreDebateCommentsButton, onSubmit, onLikeClick, onDelete, onEditDone,
      onReplySubmit, onLoadMoreReplies
    } = this.props;
    const {expanded} = this.state;
    return (
      <div
        className="panel panel-default"
        style={{borderTop: '#e7e7e7 1px solid'}}
      >
        <div className="panel-body">
          <p style={{fontSize: '2rem'}}>{title}</p>
          {expanded && !!description && <p dangerouslySetInnerHTML={{__html: description}} />}
          {expanded ?
            <PanelComments
              inputTypeLabel={'comment'}
              comments={comments}
              loadMoreButton={loadMoreDebateCommentsButton}
              userId={myId}
              onSubmit={this.onCommentSubmit}
              contentId={id}
              loadMoreComments={this.loadMoreComments}
              parent={{type: 'debate', id}}
              commentActions={{
                onDelete,
                onLikeClick,
                onEditDone,
                onReplySubmit: this.onReplySubmit,
                onLoadMoreReplies
              }}
            /> :
            <Button
              style={{marginTop: '0.5em'}}
              className="btn btn-warning"
              onClick={this.onExpand}
            >Answer{!!numComments && numComments > 0 ? ` (${numComments})` : ''}</Button>
          }
        </div>
        <div className="panel-footer">
          By <strong>
              <UsernameText user={{
                name: username,
                id: userId
              }} />
            </strong> &nbsp;|&nbsp; Published {timeSince(timeStamp)}
        </div>
      </div>
    )
  }

  loadMoreComments(commentLength) {
    const {id, loadMoreComments} = this.props;
    loadMoreComments(commentLength, id);
  }

  onExpand() {
    const {loadComments, id} = this.props;
    this.setState({expanded: true})
    loadComments(id);
  }

  onCommentSubmit(comment) {
    const {onSubmit, videoId, id, title} = this.props;
    onSubmit({comment, videoId, debateId: id, debateTopic: title})
  }

  onReplySubmit(replyContent, comment) {
    const {onReplySubmit, videoId} = this.props;
    onReplySubmit(replyContent, comment, videoId)
  }
}
