import React, {Component} from 'react';
import UserLink from '../UserLink';
import LikeButton from 'components/LikeButton';
import Likers from 'components/Likers';
import {connect} from 'react-redux';
import {likeSiblingVideoCommentAsync} from 'redux/actions/FeedActions';
import UserListModal from 'components/Modals/UserListModal';


@connect(
  null,
  {
    onLikeClick: likeSiblingVideoCommentAsync
  }
)
export default class SiblingContent extends Component {
  constructor() {
    super()
    this.state = {
      userListModalShown: false
    }
    this.onLikeClick = this.onLikeClick.bind(this)
  }

  render() {
    const {uploader, content, myId, likes, isReplyContent} = this.props;
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
        <UserLink user={uploader} /> {`${isReplyContent ? 'wrote' : 'commented'}`}:
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
      </div>
    )
  }

  onLikeClick() {
    const {contentId} = this.props;
    this.props.onLikeClick(contentId);
  }
}
