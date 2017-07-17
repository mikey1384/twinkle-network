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
}

function renderText(text) {
  let newText = text
  while (
    newText !== '' &&
    (newText[0] === ' ' ||
    (newText[newText.length - 1] === ' ') && (newText[newText.length - 2] === ' '))
  ) {
    if (newText[0] === ' ') {
      newText = newText.substring(1)
    }
    if ((newText[newText.length - 1] === ' ') && (newText[newText.length - 2] === ' ')) {
      newText = newText.slice(0, -1)
    }
  }
  return newText
}
