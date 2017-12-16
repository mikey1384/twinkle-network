import React from 'react'
import PropTypes from 'prop-types'

VisibilityWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  onChange: PropTypes.func.isRequired,
  partialVisibility: PropTypes.bool
}
export default function VisibilityWrapper({
  children,
  onChange,
  partialVisibility = true
}) {
  const VisibilitySensor = require('react-visibility-sensor')
  return (
    <VisibilitySensor partialVisibility={partialVisibility} onChange={onChange}>
      {() => children}
    </VisibilitySensor>
  )
}
