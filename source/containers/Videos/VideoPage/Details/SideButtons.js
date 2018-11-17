import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UserListModal from 'components/Modals/UserListModal';
import Likers from 'components/Likers';
import LikeButton from 'components/Buttons/LikeButton';
import StarButton from 'components/Buttons/StarButton';

export default class SideButtons extends Component {
  static propTypes = {
    byUser: PropTypes.bool.isRequired,
    canStar: PropTypes.bool.isRequired,
    isStarred: PropTypes.bool.isRequired,
    likes: PropTypes.array.isRequired,
    likeVideo: PropTypes.func.isRequired,
    changeByUserStatus: PropTypes.func.isRequired,
    starVideo: PropTypes.func.isRequired,
    style: PropTypes.object,
    uploader: PropTypes.object.isRequired,
    userId: PropTypes.number,
    videoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired
  };

  state = {
    userListModalShown: false
  };

  render() {
    const {
      byUser,
      canStar,
      isStarred,
      likes,
      likeVideo,
      starVideo,
      style,
      uploader,
      userId,
      videoId
    } = this.props;
    const { userListModalShown } = this.state;
    return (
      <div style={style}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: '100%'
          }}
        >
          {canStar && (
            <div
              style={{
                position: 'relative',
                width: '4rem',
                height: '4rem',
                marginRight: '1rem'
              }}
            >
              <StarButton
                byUser={byUser}
                contentId={Number(videoId)}
                direction="right"
                style={{ position: 'absolute', top: 0, left: 0 }}
                isStarred={isStarred}
                onToggleStarred={() => starVideo(videoId)}
                onToggleByUser={this.onToggleByUser}
                uploader={uploader}
              />
            </div>
          )}
          <LikeButton
            contentType="video"
            contentId={Number(videoId)}
            filled
            style={{
              fontSize: '2.5vw',
              minWidth: '50%',
              maxWidth: '13vw'
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

  onToggleByUser = byUser => {
    const { changeByUserStatus, videoId } = this.props;
    changeByUserStatus({ byUser, contentId: videoId });
  };
}
