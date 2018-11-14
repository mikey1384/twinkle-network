import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UserListModal from 'components/Modals/UserListModal';
import Likers from 'components/Likers';
import LikeButton from 'components/Buttons/LikeButton';
import StarButton from 'components/Buttons/StarButton';

export default class SideButtons extends Component {
  static propTypes = {
    canStar: PropTypes.bool.isRequired,
    isStarred: PropTypes.bool.isRequired,
    likes: PropTypes.array.isRequired,
    likeVideo: PropTypes.func.isRequired,
    starVideo: PropTypes.func.isRequired,
    userId: PropTypes.number,
    videoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired
  };

  state = {
    userListModalShown: false
  };

  render() {
    const {
      canStar,
      isStarred,
      likes,
      likeVideo,
      starVideo,
      userId,
      videoId
    } = this.props;
    const { userListModalShown } = this.state;
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {canStar && (
            <StarButton
              style={{ marginRight: '1rem' }}
              isStarred={isStarred}
              onClick={() => starVideo(videoId)}
            />
          )}
          <LikeButton
            contentType="video"
            contentId={Number(videoId)}
            filled
            style={{
              fontSize: '2.5rem',
              width: '100%'
            }}
            onClick={likeVideo}
            liked={(likes => {
              let liked = false;
              if (likes) {
                for (let i = 0; i < likes.length; i++) {
                  if (likes[i].userId === userId) liked = true;
                }
              }
              return liked;
            })(likes)}
          />
        </div>
        <Likers
          style={{
            textAlign: 'center',
            lineHeight: '1.7rem',
            marginTop: '0.5rem'
          }}
          userId={userId}
          likes={likes}
          onLinkClick={() => this.setState({ userListModalShown: true })}
          target="video"
          defaultText="Be the first to like this video"
        />
        {userListModalShown && (
          <UserListModal
            onHide={() => this.setState({ userListModalShown: false })}
            title="People who liked this video"
            users={likes.map(like => {
              return {
                username: like.username,
                userId: like.userId
              };
            })}
            description="(You)"
          />
        )}
      </div>
    );
  }
}
