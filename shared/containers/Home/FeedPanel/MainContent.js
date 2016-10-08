import React, {Component} from 'react';
import UserLink from '../UserLink';
import LikeButton from 'components/LikeButton';
import Likers from 'components/Likers';
import {connect} from 'react-redux';
import {likeVideoAsync, likeVideoCommentAsync} from 'redux/actions/FeedActions';
import {addVideoViewAsync} from 'redux/actions/VideoActions';
import UserListModal from 'components/Modals/UserListModal';
import YouTube from 'react-youtube';


@connect(
  null,
  {
    addVideoView: addVideoViewAsync,
    onLikeCommentClick: likeVideoCommentAsync,
    onLikeVideoClick: likeVideoAsync
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
  }

  render() {
    const {myId, content, likes = [], contentId, type, title, views} = this.props;
    const {userListModalShown} = this.state;
    let userLikedThis = false;
    for (let i = 0; i < likes.length; i++) {
      if (likes[i].userId == myId) userLikedThis = true;
    }
    return (
      <div>
        {
          (type === 'comment') ?
            <span style={{
              fontSize: '1.2em',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word'
            }}>
              <p dangerouslySetInnerHTML={{__html: content}} />
            </span> :
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
            </div>
        }
        <LikeButton
          style={{marginTop: '1em'}}
          onClick={this.onLikeClick}
          liked={userLikedThis}
          small
        />
        {type === 'video' && views > 10 &&
          <span
            className="pull-right"
            style={{
              fontSize: '1.5em',
              marginTop: '10px'
            }}
          >{views} view{`${views > 1 ? 's' : ''}`}</span>
        }
        <Likers
          style={{
            fontSize: '11px',
            marginTop: '1em',
            fontWeight: 'bold',
            color: '#f0ad4e'
          }}
          userId={myId}
          likes={likes}
          onLinkClick={() => this.setState({userListModalShown: true})}
        />
        {userListModalShown &&
          <UserListModal
            onHide={() => this.setState({userListModalShown: false})}
            title="People who liked this comment"
            userId={myId}
            users={likes}
            description={user => user.userId === myId && '(You)'}
          />
        }
      </div>
    )
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
