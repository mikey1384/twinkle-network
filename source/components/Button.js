import PropTypes from 'prop-types'
import React from 'react'

Button.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
  style: PropTypes.object
}
export default function Button({ onClick, children = null, style = {}, ...props }) {
  let Button
  return (
    <button
      {...props}
      ref={ref => {
        Button = ref
      }}
      style={{ ...style, overflow: 'hidden' }}
      onClick={event => {
        if (Button !== null) Button.blur()
        if (onClick) onClick(event)
      }}
    >
      {children}
    </button>
  )
}
