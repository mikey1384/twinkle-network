import PropTypes from 'prop-types'
import React from 'react'

NotFound.propTypes = {
  text: PropTypes.string,
  title: PropTypes.string
}
export default function NotFound({ title, text }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>{title || 'Not Found'}</h1>
      <p>{text || 'The page you requested does not exist'}</p>
    </div>
  )
}
