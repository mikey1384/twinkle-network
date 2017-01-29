import React, {Component, PropTypes} from 'react'
import LikeButton from 'components/LikeButton'
import Button from 'components/Button'
import Likers from 'components/Likers'
import {connect} from 'react-redux'
import {
  likeVideoCommentAsync,
  showFeedCommentsAsync,
  loadMoreFeedCommentsAsync,
  uploadFeedVideoCommentAsync,
  feedVideoCommentDeleteAsync,
  feedVideoCommentLikeAsync,
  feedVideoCommentEditAsync,
  uploadFeedVideoReplyAsync,
  loadMoreFeedReplies,
  likeVideoAsync
} from 'redux/actions/FeedActions'
import UserListModal from 'components/Modals/UserListModal'
import VideoPlayer from 'components/VideoPlayer'
import {embedlyKey} from 'constants/keys'
import Embedly from 'components/Embedly'
import PanelComments from 'components/PanelComments'
import TargetContent from './TargetContent'
import {Color} from 'constants/css'

@connect(
  null,
  {
    onLikeCommentClick: likeVideoCommentAsync,
    showFeedComments: showFeedCommentsAsync,
    loadMoreComments: loadMoreFeedCommentsAsync,
    onSubmit: uploadFeedVideoCommentAsync,
    onDelete: feedVideoCommentDeleteAsync,
    onLikeClick: feedVideoCommentLikeAsync,
    onEditDone: feedVideoCommentEditAsync,
    onReplySubmit: uploadFeedVideoReplyAsync,
    onLoadMoreReplies: loadMoreFeedReplies,
    onLikeVideoClick: likeVideoAsync
  }
)
export default class MainContent extends Component {
  static propTypes = {
    id: PropTypes.number,
    myId: PropTypes.number,
    content: PropTypes.string,
    contentLikers: PropTypes.array,
    targetContentComments: PropTypes.array,
    contentId: PropTypes.number,
    type: PropTypes.string,
    discussionId: PropTypes.number,
    discussionTitle: PropTypes.string,
    discussionDescription: PropTypes.string,
    videoViews: PropTypes.string,
    numChildComments: PropTypes.string,
    numChildReplies: PropTypes.string,
    replyId: PropTypes.number,
    commentId: PropTypes.number,
    targetReply: PropTypes.string,
    targetContentLikers: PropTypes.array,
    childComments: PropTypes.array,
    commentsShown: PropTypes.bool,
    commentsLoadMoreButton: PropTypes.bool,
    parentContentId: PropTypes.number,
    contentTitle: PropTypes.string,
    contentDescription: PropTypes.string,
    videoCode: PropTypes.string,
    loadMoreComments: PropTypes.func,
    onSubmit: PropTypes.func,
    onDelete: PropTypes.func,
    onLikeClick: PropTypes.func,
    onEditDone: PropTypes.func,
    onReplySubmit: PropTypes.func,
    onLoadMoreReplies: PropTypes.func,
    targetReplyUploaderId: PropTypes.number,
    targetReplyUploaderName: PropTypes.string,
    attachedVideoShown: PropTypes.bool,
    targetCommentUploaderName: PropTypes.string,
    targetCommentUploaderId: PropTypes.number,
    targetComment: PropTypes.string,
    showFeedComments: PropTypes.func,
    onLikeCommentClick: PropTypes.func,
    onLikeVideoClick: PropTypes.func
  }

  constructor() {
    super()
    this.state = {
      userListModalShown: false,
      clickListenerState: false
    }
    this.onLikeClick = this.onLikeClick.bind(this)
    this.onCommentButtonClick = this.onCommentButtonClick.bind(this)
  }

  render() {
    const {
      id, myId, content, contentLikers = [], targetContentComments = [],
      contentId, type, discussionId, discussionTitle, discussionDescription, videoViews,
      numChildComments, numChildReplies, replyId, commentId, targetReply, targetContentLikers,
      childComments, commentsShown, commentsLoadMoreButton, parentContentId, contentTitle,
      contentDescription, videoCode, loadMoreComments, onSubmit, onDelete, onLikeClick,
      onEditDone, onReplySubmit, onLoadMoreReplies, targetReplyUploaderId, targetReplyUploaderName,
      attachedVideoShown, targetCommentUploaderName, targetCommentUploaderId, targetComment
    } = this.props
    const {userListModalShown, clickListenerState} = this.state
    let userLikedThis = false
    for (let i = 0; i < contentLikers.length; i++) {
      if (contentLikers[i].userId === myId) userLikedThis = true
    }
    return (
      <div>
        {type === 'comment' && attachedVideoShown &&
          <VideoPlayer
            autoplay
            title={contentTitle}
            style={{marginBottom: '1em'}}
            containerClassName="embed-responsive embed-responsive-16by9"
            className="embed-responsive-item"
            videoId={parentContentId}
            videoCode={videoCode}
          />
        }
        {type === 'comment' && !!replyId &&
          <TargetContent
            contentAvailable={!!targetReply}
            uploader={{name: targetReplyUploaderName, id: targetReplyUploaderId}}
            likes={targetContentLikers}
            comments={targetContentComments}
            content={targetReply}
            myId={myId}
            replyId={replyId}
            commentId={commentId}
            discussionId={discussionId}
            parentContentId={parentContentId}
            panelId={id}
          />
        }
        {type === 'comment' && !!commentId && !replyId &&
          <TargetContent
            contentAvailable={!!targetComment}
            uploader={{name: targetCommentUploaderName, id: targetCommentUploaderId}}
            likes={targetContentLikers}
            comments={targetContentComments}
            content={targetComment}
            myId={myId}
            commentId={commentId}
            discussionId={discussionId}
            parentContentId={parentContentId}
            panelId={id}
          />
        }
        {type === 'comment' && !replyId && !commentId && !!discussionId &&
          <TargetContent
            isDiscussion
            contentAvailable={!!discussionTitle}
            title={discussionTitle}
            content={discussionDescription}
            comments={targetContentComments}
            discussionId={discussionId}
            parentContentId={parentContentId}
            panelId={id}
          />
        }
        {type === 'comment' &&
          <span style={{
            fontSize: '1.2em',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word'
          }}>
            <p dangerouslySetInnerHTML={{__html: content}} />
          </span>
        }
        {(type === 'video' || type === 'discussion') &&
          <VideoPlayer
            title={contentTitle}
            containerClassName="embed-responsive embed-responsive-16by9"
            className="embed-responsive-item"
            videoId={parentContentId}
            videoCode={videoCode}
          />
        }
        {type === 'url' &&
          <Embedly url={content} apiKey={embedlyKey} />
        }
        {type === 'discussion' &&
          <div style={{
            fontSize: '2rem',
            marginTop: '1em',
            marginBottom: contentDescription ? '0.5em' : '1em'
          }}>
            <p><b style={{color: Color.green}}>Discuss:</b></p>
            <p>{contentTitle}</p>
          </div>
        }
        {type === 'video' &&
        !!contentDescription && contentDescription !== 'No description' &&
          <div style={{
            marginTop: '1em',
            fontSize: '1.2em',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word'
          }}>
            <p dangerouslySetInnerHTML={{__html: contentDescription}} />
          </div>
        }
        {type === 'discussion' &&
        !!contentDescription &&
          <div style={{
            marginBottom: '1em',
            fontSize: '1.2em',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word'
          }}>
            <p dangerouslySetInnerHTML={{__html: contentDescription}} />
          </div>
        }
        {type === 'video' && videoViews > 10 &&
          <span
            className="pull-right"
            style={{
              fontSize: '1.5em',
              marginTop: '1em'
            }}
          >{videoViews} view{`${videoViews > 1 ? 's' : ''}`}</span>
        }
        {type !== 'url' && type !== 'discussion' &&
          <div style={{marginTop: '2em'}}>
            <LikeButton
              onClick={this.onLikeClick}
              liked={userLikedThis}
              small
            />
            <Button
              style={{marginLeft: '0.5em'}}
              className="btn btn-warning btn-sm"
              onClick={this.onCommentButtonClick}
            >
              <span className="glyphicon glyphicon-comment"></span>&nbsp;
              {type === 'video' ? 'Comment' : 'Reply'}&nbsp;
              {numChildComments > 0 && !commentsShown ? `(${numChildComments})` :
              (numChildReplies > 0 && !commentsShown ? `(${numChildReplies})` : '')}
            </Button>
          </div>
        }
        {type === 'discussion' &&
          <Button
            style={{marginTop: '0.5em'}}
            className="btn btn-warning"
            onClick={this.onCommentButtonClick}
          >
            Answer{!!numChildComments && numChildComments > 0 && !commentsShown ? ` (${numChildComments})` : ''}
          </Button>
        }
        <Likers
          style={{
            fontSize: '11px',
            marginTop: '1em',
            fontWeight: 'bold',
            color: Color.green
          }}
          userId={myId}
          likes={contentLikers}
          onLinkClick={() => this.setState({userListModalShown: true})}
        />
        {type !== 'url' && commentsShown &&
          <PanelComments
            clickListenerState={clickListenerState}
            inputTypeLabel={type === 'comment' ? 'reply' : 'comment'}
            comments={childComments}
            loadMoreButton={commentsLoadMoreButton}
            userId={myId}
            loadMoreComments={loadMoreComments}
            onSubmit={onSubmit}
            contentId={contentId}
            type={type}
            parent={{
              id: contentId,
              type,
              parentContentId,
              commentId,
              replyId
            }}
            commentActions={{
              onDelete,
              onLikeClick,
              onEditDone,
              onReplySubmit,
              onLoadMoreReplies
            }}
          />
        }
        {userListModalShown &&
          <UserListModal
            onHide={() => this.setState({userListModalShown: false})}
            title="People who liked this comment"
            userId={myId}
            users={contentLikers}
            description={user => user.userId === myId && '(You)'}
          />
        }
      </div>
    )
  }

  onCommentButtonClick() {
    const {type, contentId, commentId, commentsShown, showFeedComments, childComments} = this.props
    const {clickListenerState} = this.state
    const isReply = !!commentId
    if (!commentsShown) {
      const commentLength = childComments.length
      return showFeedComments(type, contentId, commentLength, isReply)
    }
    this.setState({clickListenerState: !clickListenerState})
  }

  onLikeClick() {
    const {contentId, type} = this.props
    if (type === 'comment') {
      this.props.onLikeCommentClick(contentId)
    } else {
      this.props.onLikeVideoClick(contentId)
    }
  }
}
