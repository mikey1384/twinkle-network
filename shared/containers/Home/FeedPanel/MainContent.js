import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import UserLink from '../UserLink';
import LikeButton from 'components/LikeButton';
import Button from 'components/Button';
import Likers from 'components/Likers';
import {connect} from 'react-redux';
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
} from 'redux/actions/FeedActions';
import {addVideoViewAsync} from 'redux/actions/VideoActions';
import UserListModal from 'components/Modals/UserListModal';
import YouTube from 'react-youtube';
import {embedlyKey} from 'constants/keys';
import Embedly from 'components/Embedly';
import PanelComments from 'components/PanelComments';
import TargetContent from './TargetContent';


@connect(
  null,
  {
    addVideoView: addVideoViewAsync,
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
  constructor() {
    super()
    this.state = {
      userListModalShown: false,
      clickListenerState: false
    }
    this.onLikeClick = this.onLikeClick.bind(this)
    this.onVideoPlay = this.onVideoPlay.bind(this)
    this.onCommentButtonClick = this.onCommentButtonClick.bind(this)
  }

  render() {
    const {
      myId, content, contentLikers = [],
      contentId, type, title, videoViews, numChildComments, numChildReplies, replyId, commentId, targetReply,
      targetContentLikers, videoId, childComments, commentsShown, commentsLoadMoreButton, parentContentId, contentTitle, contentDescription, videoCode, loadMoreComments, onSubmit, onDelete, onLikeClick,
      onEditDone, onReplySubmit, onLoadMoreReplies, targetReplyUploaderId, targetReplyUploaderName,
      attachedVideoShown, targetCommentUploaderName, targetCommentUploaderId, targetComment
    } = this.props;
    const {userListModalShown, clickListenerState} = this.state;
    let userLikedThis = false;
    for (let i = 0; i < contentLikers.length; i++) {
      if (contentLikers[i].userId == myId) userLikedThis = true;
    }
    return (
      <div>
        {type === 'comment' && attachedVideoShown &&
          <div className="embed-responsive embed-responsive-16by9" style={{marginBottom: '1em'}}>
            <YouTube
              className="embed-responsive-item"
              opts={{
                title: contentTitle,
                height: '360',
                width: '640'
              }}
              videoId={videoCode}
              onReady={event => {
                event.target.playVideo()
                this.onVideoPlay(event)
              }}
            />
        </div>}
        {type === 'comment' && !!replyId &&
          <TargetContent
            isReplyContent={true}
            uploader={{name: targetReplyUploaderName, id: targetReplyUploaderId}}
            likes={targetContentLikers}
            content={targetReply}
            myId={myId}
            contentId={replyId}
          />
        }
        {type === 'comment' && !!commentId && !replyId &&
          <TargetContent
            uploader={{name: targetCommentUploaderName, id: targetCommentUploaderId}}
            likes={targetContentLikers}
            content={targetComment}
            myId={myId}
            contentId={commentId}
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
          <div className="embed-responsive embed-responsive-16by9">
            <YouTube
              className="embed-responsive-item"
              opts={{
                title: title,
                height: '360',
                width: '640'
              }}
              videoId={videoCode}
              onPlay={this.onVideoPlay}
            />
          </div>
        }
        {type === 'url' &&
          <Embedly url={content} apiKey={embedlyKey} />
        }
        {type === 'discussion' &&
          <div style={{fontSize: '2rem', marginTop: '1em', marginBottom: '1em'}}>
            <p><b style={{color: '#28b62c'}}>Discuss:</b></p>
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
            color: '#f0ad4e'
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
    const {type, contentId, commentId, commentsShown, showFeedComments, childComments} = this.props;
    const {clickListenerState} = this.state;
    const isReply = !!commentId;
    if (!commentsShown) {
      const commentLength = childComments.length;
      return showFeedComments(type, contentId, commentLength, isReply);
    }
    this.setState({clickListenerState: !clickListenerState})
  }

  onLikeClick() {
    const {contentId, type} = this.props;
    if (type === 'comment') {
      this.props.onLikeCommentClick(contentId);
    } else {
      this.props.onLikeVideoClick(contentId);
    }
  }

  onVideoPlay(event) {
    const {parentContentId, myId, addVideoView} = this.props;
    const time = event.target.getCurrentTime()
    if (Math.floor(time) === 0) {
      addVideoView({videoId: parentContentId, userId: myId})
    }
  }
}
