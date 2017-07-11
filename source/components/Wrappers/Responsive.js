import React from 'react'
import PropTypes from 'prop-types'
import MediaQuery from 'react-responsive'

const breakpoints = {
  desktop: '(min-width: 1025px)',
  tablet: '(min-width: 768px) and (max-width: 1024px)',
  phone: '(max-width: 767px)'
}

Responsive.propTypes = {
  device: PropTypes.string,
  children: PropTypes.element
}
export default function Responsive({device, children, ...props}) {
  const breakpoint = breakpoints[device] || breakpoints.desktop
  return (
    <MediaQuery {...props} query={breakpoint}>
      {children}
    </MediaQuery>
  )
}
