import PropTypes from 'prop-types'
import React from 'react'

ProfilePic.propTypes = {
  profilePicId: PropTypes.number,
  size: PropTypes.string.isRequired,
  userId: PropTypes.number
}
export default function ProfilePic({ userId, profilePicId, ...props }) {
  const src = `https://s3.ap-northeast-2.amazonaws.com/twinkle-seoul/pictures/${userId}/${profilePicId}.jpg`
  return (
    <div {...props}>
      <div style={{ width: '100%', height: '100%' }}>
        <img
          alt="Thumbnail"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%'
          }}
          src={profilePicId ? src : '/img/default.png'}
        />
      </div>
    </div>
  )
}
