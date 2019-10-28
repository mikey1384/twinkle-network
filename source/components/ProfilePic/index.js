import React, {useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import ChangePicture from './ChangePicture';
import {cloudFrontURL} from 'constants/defaultValues';
import {useMyState} from 'helpers/hooks';
import StatusTag from './StatusTag';

ProfilePic.propTypes = {
  className: PropTypes.string,
  isProfilePage: PropTypes.bool,
  large: PropTypes.bool,
  onClick: PropTypes.func,
  online: PropTypes.bool,
  profilePicId: PropTypes.number,
  style: PropTypes.object,
  userId: PropTypes.number
};

export default function ProfilePic({
  className,
  isProfilePage,
  large,
  onClick = () => {},
  userId,
  online,
  profilePicId,
  style
}) {
  const {userId: myId} = useMyState();
  const [changePictureShown, setChangePictureShown] = useState(false);
  const src = `${cloudFrontURL}/pictures/${userId}/${profilePicId}.jpg`;

  return useMemo(
    () => (
      <div
        className={className}
        style={{
          display: 'block',
          position: 'relative',
          userSelect: 'none',
          borderRadius: '50%',
          cursor: myId === userId && isProfilePage ? 'pointer' : 'default',
          ...style
        }}
        onClick={onClick}
        onMouseEnter={() => setChangePictureShown(true)}
        onMouseLeave={() => setChangePictureShown(false)}
      >
        <img
          alt='Thumbnail'
          style={{
            display: 'block',
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%'
          }}
          src={profilePicId ? src : '/img/default.png'}
        />
        <ChangePicture
          shown={myId === userId && isProfilePage && changePictureShown}
        />
        {large && (online || myId === userId) && (
          <StatusTag status={'online'} />
        )}
        {large && !online && <StatusTag status={'offline'} />}
      </div>
    ),
    [changePictureShown, myId, src, userId, online, profilePicId]
  );
}
