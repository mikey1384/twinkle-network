import React, {Component} from 'react';
import UserLink from '../UserLink';
import LikeButton from 'components/LikeButton';
import Button from 'components/Button';
import Likers from 'components/Likers';
import {connect} from 'react-redux';
import {likeVideoAsync, likeVideoCommentAsync, showFeedCommentsAsync} from 'redux/actions/FeedActions';
import {addVideoViewAsync} from 'redux/actions/VideoActions';
import UserListModal from 'components/Modals/UserListModal';
import YouTube from 'react-youtube';
import {embedlyKey} from 'constants/keys';
import Embedly from 'components/Embedly';
import FeedComments from './FeedComments';


@connect(
  null,
  {
    addVideoView: addVideoViewAsync,
    onLikeCommentClick: likeVideoCommentAsync,
    onLikeVideoClick: likeVideoAsync,
    showFeedComments: showFeedCommentsAsync
  }
)
export default class MainContent extends Component {
  constructor() {
    super()
    this.state = {
      userListModalShown: false
    }
    this.onLikeClick = this.onLikeClick.bind(this)
    this.onVideoPlay = this.onVideoPlay.bind(this)
    this.onCommentButtonClick = this.onCommentButtonClick.bind(this)
  }

  render() {
    const {
      myId, content, contentLikers = [],
      contentId, type, title, views, numChildComments, numChildReplies, replyId, commentId,
      videoId, childComments, commentsShown, commentsLoadMoreButton, parentContentId
    } = this.props;
    const {userListModalShown} = this.state;
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
        {type === 'video' && views > 10 &&
          <span
            className="pull-right"
            style={{
              fontSize: '1.5em',
              marginTop: '1em'
            }}
          >{views} view{`${views > 1 ? 's' : ''}`}</span>
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
                disabled={commentsShown}
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
          <FeedComments
            inputTypeLabel={type === 'video' ? 'comment' : 'reply'}
            comments={childComments}
            parent={{
              id: contentId,
              type,
              parentContentId,
              commentId,
              replyId
            }}
            loadMoreButton={commentsLoadMoreButton}
            userId={myId}
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
    const isReply = !!commentId;
    if (!commentsShown) {
      const commentLength = childComments.length;
      showFeedComments(type, contentId, commentLength, isReply);
    }
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
