import PropTypes from 'prop-types'
import React from 'react'
import { borderRadius, Color, innerBorderRadius } from 'constants/css'

ProfilePic.propTypes = {
  large: PropTypes.bool,
  online: PropTypes.bool,
  profilePicId: PropTypes.number,
  style: PropTypes.object,
  userId: PropTypes.number
}
export default function ProfilePic({
  large,
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
      {large &&
        online && (
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
                borderRadius: innerBorderRadius,
                fontWeight: 'bold'
              }}
            >
              online
            </div>
          </div>
        )}
    </div>
  )
}
