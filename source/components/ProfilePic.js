import PropTypes from 'prop-types'
import React from 'react'

ProfilePic.propTypes = {
  profilePicId: PropTypes.number,
  style: PropTypes.object,
  userId: PropTypes.number
}
export default function ProfilePic({ userId, profilePicId, style, ...props }) {
  const src = `https://s3.ap-northeast-2.amazonaws.com/twinkle-seoul/pictures/${userId}/${profilePicId}.jpg`
  return (
    <div
      {...props}
      style={{
        ...style,
        position: 'relative',
        paddingBottom: style.width
      }}
    >
      <img
        alt="Thumbnail"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%'
        }}
        src={profilePicId ? src : '/img/default.png'}
      />
    </div>
  )
}
