import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'emotion'
import { Color } from 'constants/css'
import { renderText } from 'helpers/stringHelpers'

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
