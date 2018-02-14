import React from 'react'
import PropTypes from 'prop-types'
import MediaQuery from 'react-responsive'
import ErrorBoundary from './ErrorBoundary'

const breakpoints = {
  desktop: '(min-width: 992px)',
  mobile: '(max-width: 991px)'
}

Responsive.propTypes = {
  children: PropTypes.element,
  device: PropTypes.string
}
export default function Responsive({ device, children, ...props }) {
  const breakpoint = breakpoints[device] || breakpoints.desktop
  return (
    <ErrorBoundary>
      <MediaQuery {...props} query={breakpoint}>
        {children}
      </MediaQuery>
    </ErrorBoundary>
  )
}
