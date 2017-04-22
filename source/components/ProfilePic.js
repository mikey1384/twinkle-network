import PropTypes from 'prop-types'
import React from 'react'

ProfilePic.propTypes = {
  size: PropTypes.string,
  userId: PropTypes.number,
  profilePicId: PropTypes.number
}
export default function ProfilePic({size, userId, profilePicId}) {
  const src = `https://s3.ap-northeast-2.amazonaws.com/twinkle-seoul/pictures/${userId}/${profilePicId}.jpg`
  return (
    <div className="media-left">
      <a>
        <img
          alt="Thumbnail"
          className="media-object"
          style={{width: `${size}vw`, height: `${size}vw`}}
          src={profilePicId ? src : '/img/default.jpg'}
        />
      </a>
    </div>
  )
}
