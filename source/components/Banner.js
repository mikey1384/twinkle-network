import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'emotion'
import { Color } from 'constants/css'

Banner.propTypes = {
  children: PropTypes.node.isRequired,
  primary: PropTypes.bool,
  love: PropTypes.bool
}
export default function Banner({ children, primary, love }) {
  const backgroundColor = {
    primary: Color.blue(),
    love: Color.pink(),
    default: Color.lightGray()
  }
  let colorKey = 'default'
  if (primary) colorKey = 'primary'
  if (love) colorKey = 'love'
  return (
    <div
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
    >
      {children}
    </div>
  )
}
