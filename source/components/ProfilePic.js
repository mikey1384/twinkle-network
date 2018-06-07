import PropTypes from 'prop-types'
import React from 'react'
import { borderRadius, Color } from 'constants/css'

ProfilePic.propTypes = {
  online: PropTypes.bool,
  profilePicId: PropTypes.number,
  style: PropTypes.object,
  userId: PropTypes.number
}
export default function ProfilePic({
  userId,
  online,
  profilePicId,
  style,
  ...props
}) {
  const src = `https://s3.ap-northeast-2.amazonaws.com/twinkle-seoul/pictures/${userId}/${profilePicId}.jpg`
  return (
    <div
      {...props}
      style={{
        ...style,
        display: 'block',
        position: 'relative'
      }}
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
      {online && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            position: 'absolute',
            background: Color.green(),
            color: '#fff',
            padding: '0.3rem',
            borderRadius,
            top: 0,
            left: 0,
            fontWeight: 'bold'
          }}
        >
          online
        </div>
      )}
    </div>
  )
}
