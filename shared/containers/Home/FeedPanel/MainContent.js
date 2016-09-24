import React, {Component} from 'react';
import UserLink from '../UserLink';
import LikeButton from 'components/LikeButton';
import Likers from 'components/Likers';
import {connect} from 'react-redux';
import {likeVideoCommentAsync} from 'redux/actions/FeedActions';
import UserListModal from 'components/Modals/UserListModal';


@connect(
  null,
  {
    onLikeClick: likeVideoCommentAsync
  }
)
export default class MainContent extends Component {
  constructor() {
    super()
    this.state = {
      userListModalShown: false
    }
    this.onLikeClick = this.onLikeClick.bind(this)
  }

  render() {
    const {myId, content, likes = [], contentId} = this.props;
    const {userListModalShown} = this.state;
    let userLikedThis = false;
    for (let i = 0; i < likes.length; i++) {
      if (likes[i].userId == myId) userLikedThis = true;
    }
    return (
      <div>
        <span style={{fontSize: '1.2em'}}>
          <p dangerouslySetInnerHTML={{__html: content}} />
        </span>
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
