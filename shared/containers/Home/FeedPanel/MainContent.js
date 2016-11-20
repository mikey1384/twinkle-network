import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import UserLink from '../UserLink';
import LikeButton from 'components/LikeButton';
import Button from 'components/Button';
import Likers from 'components/Likers';
import {connect} from 'react-redux';
import {
  likeVideoAsync,
  likeVideoCommentAsync,
  showFeedCommentsAsync,
  loadMoreFeedCommentsAsync,
  uploadFeedVideoCommentAsync,
  feedVideoCommentDeleteAsync,
  feedVideoCommentLikeAsync,
  feedVideoCommentEditAsync,
  uploadFeedVideoReplyAsync

} from 'redux/actions/FeedActions';
import {addVideoViewAsync} from 'redux/actions/VideoActions';
import UserListModal from 'components/Modals/UserListModal';
import YouTube from 'react-youtube';
import {embedlyKey} from 'constants/keys';
import Embedly from 'components/Embedly';
import PanelComments from 'components/PanelComments';


@connect(
  null,
  {
    addVideoView: addVideoViewAsync,
    onLikeCommentClick: likeVideoCommentAsync,
    onLikeVideoClick: likeVideoAsync,
    showFeedComments: showFeedCommentsAsync,
    loadMoreComments: loadMoreFeedCommentsAsync,
    onSubmit: uploadFeedVideoCommentAsync,
    onDelete: feedVideoCommentDeleteAsync,
    onLikeClick: feedVideoCommentLikeAsync,
    onEditDone: feedVideoCommentEditAsync,
    onReplySubmit: uploadFeedVideoReplyAsync
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
      contentId, type, title, videoViews, numChildComments, numChildReplies, replyId, commentId,
      videoId, childComments, commentsShown, commentsLoadMoreButton, parentContentId,
      loadMoreComments, onSubmit, onDelete, onLikeClick, onEditDone, onReplySubmit
    } = this.props;
    const {userListModalShown, clickListenerState} = this.state;
    let userLikedThis = false;
    for (let i = 0; i < contentLikers.length; i++) {
      if (contentLikers[i].userId == myId) userLikedThis = true;
    }
    return (
      <div>
        {(type === 'comment') ?
            <span style={{
              fontSize: '1.2em',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word'
            }}>
              <p dangerouslySetInnerHTML={{__html: content}} />
            </span> :
            ((type === 'video') ?
              <div className="embed-responsive embed-responsive-16by9">
                <YouTube
                  className="embed-responsive-item"
                  opts={{
                    title: title,
                    height: '360',
                    width: '640'
                  }}
                  videoId={content}
                  onPlay={this.onVideoPlay}
                />
              </div> :
              <Embedly url={content} apiKey={embedlyKey} />
            )
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
        {type !== 'url' && (
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
                {`${type === 'video' ? 'Comment' : 'Reply'} ${numChildComments > 0 && !commentsShown ? '(' + numChildComments + ')'
                : (numChildReplies > 0 && !commentsShown ? '(' + numChildReplies + ')' : '')}`}
              </Button>
            </div>
          )
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
            inputTypeLabel={type === 'video' ? 'comment' : 'reply'}
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
              onReplySubmit
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
    const {contentId, myId, addVideoView} = this.props;
    const time = event.target.getCurrentTime()
    if (Math.floor(time) === 0) {
      addVideoView({videoId: contentId, userId: myId})
    }
  }
}
