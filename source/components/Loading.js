import PropTypes from 'prop-types'
import React from 'react'

Loading.propTypes = {
  style: PropTypes.object,
  text: PropTypes.string
}
export default function Loading({
  text = '',
  style = {
    textAlign: 'center',
    paddingTop: '1em',
    paddingBottom: '1em',
    fontSize: '3em'
  }
}) {
  return (
    <p style={style}>
      <span className="glyphicon glyphicon-refresh spinning" />&nbsp;
      <span>{text}</span>
    </p>
  )
}
