import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'emotion'
import { Color } from 'constants/css'

Banner.propTypes = {
  children: PropTypes.node,
  danger: PropTypes.bool,
  innerRef: PropTypes.func,
  info: PropTypes.bool,
  logo: PropTypes.bool,
  primary: PropTypes.bool,
  style: PropTypes.object,
  love: PropTypes.bool,
  onClick: PropTypes.func
}
export default function Banner({
  children,
  danger,
  info,
  innerRef,
  logo,
  onClick,
  primary,
  love,
  style = {}
}) {
  const backgroundColor = {
    danger: Color.red(),
    primary: Color.blue(),
    logo: Color.logoBlue(),
    love: Color.pink(),
    info: Color.lightBlue(),
    default: Color.lightGray()
  }
  let colorKey = 'default'
  if (danger) colorKey = 'danger'
  if (primary) colorKey = 'primary'
  if (love) colorKey = 'love'
  if (logo) colorKey = 'logo'
  if (info) colorKey = 'info'
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
        &:hover {
          ${onClick ? 'opacity: 0.8;' : ''};
        }
      `}
      style={{
        ...style,
        cursor: onClick && 'pointer'
      }}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
