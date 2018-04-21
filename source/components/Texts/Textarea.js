import React from 'react'
import PropTypes from 'prop-types'
import { Color } from 'constants/css'
import { css } from 'emotion'
import TextareaAutosize from 'react-textarea-autosize'

Textarea.propTypes = {
  innerRef: PropTypes.func
}
export default function Textarea({ innerRef, ...props }) {
  return (
    <TextareaAutosize
      {...props}
      ref={innerRef}
      className={css`
        width: 100%;
        line-height: 1.5;
        position: relative;
        font-size: 1.6rem;
        padding: 1rem;
        border: 1px solid ${Color.inputBorderGray()};
        &:focus {
          outline: none;
          border: 1px solid ${Color.logoBlue()};
          box-shadow: 0px 0px 3px ${Color.logoBlue(0.8)};
          ::placeholder {
            color: ${Color.lightGray()};
          }
        }
        ::placeholder {
          color: ${Color.gray()};
        }
      `}
    />
  )
}
