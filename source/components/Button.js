import PropTypes from 'prop-types'
import React from 'react'

Button.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array
  ])
}
export default function Button({onClick, children = null, ...props}) {
  let Button
  return (
    <button
      {...props}
      ref={ref => { Button = ref }}
      onClick={event => {
        if (Button !== null) Button.blur()
        if (onClick) onClick(event)
      }}
    >
      {children}
    </button>
  )
}
