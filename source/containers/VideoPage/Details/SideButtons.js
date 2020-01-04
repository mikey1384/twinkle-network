import React, { useState } from 'react';
import PropTypes from 'prop-types';
import UserListModal from 'components/Modals/UserListModal';
import Likers from 'components/Likers';
import LikeButton from 'components/Buttons/LikeButton';
import StarButton from 'components/Buttons/StarButton';
import { css } from 'emotion';
import { mobileMaxWidth } from 'constants/css';

SideButtons.propTypes = {
  byUser: PropTypes.bool.isRequired,
  canStar: PropTypes.bool,
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
          justifyContent: canStar ? 'flex-end' : 'center',
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
              onToggleByUser={handleToggleByUser}
              uploader={uploader}
            />
          </div>
        )}
        <LikeButton
          contentType="video"
          contentId={Number(videoId)}
          likes={likes}
          filled
          className={css`
            font-size: 2.5rem;
            min-width: 50%;
            max-width: 16vw;
            @media (max-width: ${mobileMaxWidth}) {
              font-size: 1.5rem;
            }
          `}
          onClick={onLikeVideo}
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

  function handleToggleByUser(byUser) {
    changeByUserStatus({ byUser, contentId: videoId, contentType: 'video' });
  }
}
