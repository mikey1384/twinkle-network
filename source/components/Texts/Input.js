import React from 'react'
import PropTypes from 'prop-types'

Input.propTypes = {
  onChange: PropTypes.func
}
export default function Input({onChange, ...props}) {
  return (
    <input
      {...props}
      onChange={(event) => onChange(renderText(event.target.value))}
    />
  )

  function renderText(text) {
    while (text.indexOf(' ') === 0) {
      text = text.substring(1)
    }
    return text
  }
}
