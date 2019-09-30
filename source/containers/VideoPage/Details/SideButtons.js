import React, { useState } from 'react';
import PropTypes from 'prop-types';
import UserListModal from 'components/Modals/UserListModal';
import Likers from 'components/Likers';
import LikeButton from 'components/Buttons/LikeButton';
import StarButton from 'components/Buttons/StarButton';

SideButtons.propTypes = {
  byUser: PropTypes.bool.isRequired,
  canStar: PropTypes.bool.isRequired,
  rewardLevel: PropTypes.number,
  likes: PropTypes.array.isRequired,
  onLikeVideo: PropTypes.func.isRequired,
  onSetRewardLevel: PropTypes.func.isRequired,
  changeByUserStatus: PropTypes.func.isRequired,
  style: PropTypes.object,
  uploader: PropTypes.object.isRequired,
  userId: PropTypes.number,
  videoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

export default function SideButtons({
  byUser,
  canStar,
  changeByUserStatus,
  rewardLevel,
  likes,
  onLikeVideo,
  onSetRewardLevel,
  style,
  uploader,
  userId,
  videoId
}) {
  const [userListModalShown, setUserListModalShown] = useState(false);
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
              style={{ position: 'absolute', top: 0, left: 0 }}
              contentType="video"
              rewardLevel={rewardLevel}
              onSetRewardLevel={onSetRewardLevel}
              onToggleByUser={onToggleByUser}
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
          onClick={onLikeVideo}
          liked={(likes => {
            let liked = false;
            if (likes) {
              for (let i = 0; i < likes.length; i++) {
                if (likes[i]?.id === userId) liked = true;
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
        onLinkClick={() => setUserListModalShown(true)}
        target="video"
        defaultText="Be the first to like this video"
      />
      {userListModalShown && (
        <UserListModal
          onHide={() => setUserListModalShown(false)}
          title="People who liked this video"
          users={likes}
          description="(You)"
        />
      )}
    </div>
  );

  function onToggleByUser(byUser) {
    changeByUserStatus({ byUser, contentId: videoId, contentType: 'video' });
  }
}
