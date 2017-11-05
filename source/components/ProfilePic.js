import PropTypes from 'prop-types'
import React from 'react'

ProfilePic.propTypes = {
  profilePicId: PropTypes.number,
  size: PropTypes.string.isRequired,
  userId: PropTypes.number
}
export default function ProfilePic({size, userId, profilePicId, ...props}) {
  const src = `https://s3.ap-northeast-2.amazonaws.com/twinkle-seoul/pictures/${userId}/${profilePicId}.jpg`
  return (
    <div {...props} className="media-left">
      <a>
        <img
          alt="Thumbnail"
          className="media-object"
          style={{width: `${size}vw`, height: `${size}vw`}}
          src={profilePicId ? src : '/img/default.png'}
        />
      </a>
    </div>
  )
}
