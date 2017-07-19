import React from 'react'
import PropTypes from 'prop-types'

FullTextReveal.propTypes = {
  show: PropTypes.bool,
  text: PropTypes.string.isRequired,
  width: PropTypes.string
}
export default function FullTextReveal({show, text, width = '500px'}) {
  return (
    <div
      className="alert alert-info"
      style={{
        position: 'absolute',
        zIndex: '10',
        padding: '5px',
        display: show ? 'block' : 'none',
        width: 'auto',
        maxWidth: width
      }}
    >{text}</div>
  )
}
