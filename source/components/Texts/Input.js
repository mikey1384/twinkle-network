import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'emotion'
import { Color } from 'constants/css'

export default class Input extends Component {
  static propTypes = {
    className: PropTypes.string,
    inputRef: PropTypes.func,
    onChange: PropTypes.func.isRequired
  }
  render() {
    const { className, inputRef, onChange, ...props } = this.props
    return (
      <input
        {...props}
        className={`${css`
          border: 1px solid ${Color.inputBorderGray()};
          width: 100%;
          line-height: 2rem;
          font-size: 1.7rem;
          padding: 1rem;
          &:focus {
            outline: none;
            ::placeholder {
              color: ${Color.lightGray()};
            }
          }
          ::placeholder {
            color: ${Color.gray()};
          }
        `} ${className}`}
        ref={inputRef}
        onChange={event => onChange(renderText(event.target.value))}
      />
    )
  }
}

function renderText(text) {
  let newText = text
  while (
    newText !== '' &&
    (newText[0] === ' ' ||
      (newText[newText.length - 1] === ' ' &&
        newText[newText.length - 2] === ' '))
  ) {
    if (newText[0] === ' ') {
      newText = newText.substring(1)
    }
    if (
      newText[newText.length - 1] === ' ' &&
      newText[newText.length - 2] === ' '
    ) {
      newText = newText.slice(0, -1)
    }
  }
  return newText
}
