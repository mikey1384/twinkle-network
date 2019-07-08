import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ChangePicture from './ChangePicture';
import { cloudFrontURL } from 'constants/defaultValues';
import { borderRadius, Color, innerBorderRadius } from 'constants/css';
import { connect } from 'react-redux';

ProfilePic.propTypes = {
  className: PropTypes.string,
  isProfilePage: PropTypes.bool,
  large: PropTypes.bool,
  myId: PropTypes.number,
  onClick: PropTypes.func,
  online: PropTypes.bool,
  profilePicId: PropTypes.number,
  style: PropTypes.object,
  userId: PropTypes.number
};

function ProfilePic({
  className,
  isProfilePage,
  large,
  myId,
  onClick = () => {},
  userId,
  online,
  profilePicId,
  style
}) {
  const [changePictureShown, setChangePictureShown] = useState(false);
  const src = `${cloudFrontURL}/pictures/${userId}/${profilePicId}.jpg`;

  return (
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
        alt="Thumbnail"
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
      {myId !== userId && large && online && (
        <div
          style={{
            top: '74%',
            left: '70%',
            background: '#fff',
            position: 'absolute',
            border: '3px solid #fff',
            borderRadius
          }}
        >
          <div
            style={{
              background: Color.green(),
              color: '#fff',
              padding: '0.3rem',
              minWidth: '5rem',
              fontSize: '1.4rem',
              textAlign: 'center',
              borderRadius: innerBorderRadius,
              fontWeight: 'bold'
            }}
          >
            online
          </div>
        </div>
      )}
    </div>
  );
}

export default connect(state => ({
  myId: state.UserReducer.userId
}))(ProfilePic);
