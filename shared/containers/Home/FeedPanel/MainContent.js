import React, {Component} from 'react';
import UserLink from '../UserLink';
import LikeButton from 'components/LikeButton';
import Likers from 'components/Likers';
import {connect} from 'react-redux';
import {likeVideoCommentAsync} from 'redux/actions/FeedActions';


@connect(
  null,
  {
    onLikeClick: likeVideoCommentAsync
  }
)
export default class MainContent extends Component {
  constructor() {
    super()
    this.onLikeClick = this.onLikeClick.bind(this)
  }

  render() {
    const {myId, content, likes = [], contentId} = this.props;
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
      </div>
    )
  }

  onLikeClick() {
    const {contentId} = this.props;
    this.props.onLikeClick(contentId);
  }
}
