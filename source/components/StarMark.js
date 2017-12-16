import React from 'react'
import PropTypes from 'prop-types'

StarMark.propTypes = {
  size: PropTypes.number,
  style: PropTypes.object
}
export default function StarMark({ style, size = 4 }) {
  return (
    <img
      style={{
        ...style,
        width: `${size}vw`,
        height: `${size}vw`,
        position: 'absolute'
      }}
      src={'/img/star.png'}
    />
  )
}
