import React from 'react'
import PropTypes from 'prop-types'
import { Color } from 'constants/css'

FullTextReveal.propTypes = {
  show: PropTypes.bool,
  style: PropTypes.object,
  text: PropTypes.string.isRequired,
  width: PropTypes.string
}
export default function FullTextReveal({ style, show, text, width = '500px' }) {
  return (
    <div
      style={{
        background: '#fff',
        boxShadow: `0 0 3px ${Color.black()}`,
        position: 'absolute',
        zIndex: '10',
        padding: '1rem',
        display: show ? 'block' : 'none',
        width: 'auto',
        maxWidth: width,
        marginTop: '0.5rem',
        lineHeight: '2rem',
        ...style
      }}
    >
      {text}
    </div>
  )
}
