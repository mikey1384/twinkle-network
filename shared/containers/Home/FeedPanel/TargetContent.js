import React, {Component} from 'react';
import UserLink from '../UserLink';
import LikeButton from 'components/LikeButton';
import Likers from 'components/Likers';
import {connect} from 'react-redux';
import {likeTargetVideoCommentAsync} from 'redux/actions/FeedActions';
import UserListModal from 'components/Modals/UserListModal';
import {Color} from 'constants/css'


@connect(
  null,
  {
    onLikeClick: likeTargetVideoCommentAsync
  }
)
export default class TargetContent extends Component {
  constructor() {
    super()
    this.state = {
      userListModalShown: false
    }
    this.onLikeClick = this.onLikeClick.bind(this)
  }

  render() {
    const {uploader, title, content, contentAvailable,
      myId, likes = [], isReplyContent, isDiscussionTitle
    } = this.props;
    const {userListModalShown} = this.state;
    let userLikedThis = false;
    for (let i = 0; i < likes.length; i++) {
      if (likes[i].userId == myId) userLikedThis = true;
    }
    return (
      <div
        className="well"
        style={{
          marginTop: '1em',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word'
        }}
      >
        {!!contentAvailable ?
          (!isDiscussionTitle ?
            <div>
              <UserLink user={uploader} /> {isReplyContent ? 'wrote' : 'commented'}:
              <p style={{marginTop: '0.5em'}} dangerouslySetInnerHTML={{__html: content}} />
              <LikeButton
                style={{marginTop: '1em'}}
                onClick={this.onLikeClick}
                liked={userLikedThis}
                small
              />
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
            </div> :
            <div
              style={{
                marginTop: '0.2em',
                marginBottom: '0.2em'
              }}
            >
              <p
                style={{
                  fontWeight: 'bold',
                  color: Color.green
                }}
              >
                Discuss:
              </p>
              <p style={{fontWeight: 'bold'}}>{title}</p>
              {!!content && <p dangerouslySetInnerHTML={{__html: content}}/>}
            </div>
          ) : <div style={{textAlign: 'center'}}><span>Content removed / no longer available</span></div>
        }
      </div>
    )
  }

  onLikeClick() {
    const {contentId} = this.props;
    this.props.onLikeClick(contentId);
  }
}
