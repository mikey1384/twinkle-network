import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'emotion'
import { Color } from 'constants/css'

Banner.propTypes = {
  children: PropTypes.node,
  danger: PropTypes.bool,
  innerRef: PropTypes.func,
  primary: PropTypes.bool,
  style: PropTypes.object,
  love: PropTypes.bool
}
export default function Banner({ children, danger, innerRef, primary, love, style = {} }) {
  const backgroundColor = {
    danger: Color.red(),
    primary: Color.blue(),
    love: Color.pink(),
    default: Color.lightGray()
  }
  let colorKey = 'default'
  if (danger) colorKey = 'danger'
  if (primary) colorKey = 'primary'
  if (love) colorKey = 'love'
  return (
    <div
      ref={innerRef}
      className={css`
        display: flex;
        width: 100%;
        background: ${backgroundColor[colorKey]};
        color: #fff;
        padding: 1.5rem;
        text-align: center;
        font-size: 2rem;
        flex-direction: column;
        justify-content: center;
      `}
      style={style}
    >
      {children}
    </div>
  )
}
