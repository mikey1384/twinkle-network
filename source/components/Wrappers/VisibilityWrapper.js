import React from 'react'
import PropTypes from 'prop-types'

VisibilityWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  onChange: PropTypes.func.isRequired
}
export default function VisibilityWrapper({children, onChange}) {
  const VisibilitySensor = require('react-visibility-sensor')
  return (
    <VisibilitySensor onChange={onChange}>
      {() => children}
    </VisibilitySensor>
  )
}
