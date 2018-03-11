import PropTypes from 'prop-types'
import React from 'react'
import { css } from 'emotion'
import { borderRadius, Color } from 'constants/css'

Button.propTypes = {
  warning: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  filled: PropTypes.bool,
  gold: PropTypes.bool,
  love: PropTypes.bool,
  info: PropTypes.bool,
  logo: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node,
  danger: PropTypes.bool,
  primary: PropTypes.bool,
  snow: PropTypes.bool,
  success: PropTypes.bool,
  style: PropTypes.object,
  transparent: PropTypes.bool
}
export default function Button({
  className,
  disabled,
  onClick,
  children = null,
  logo,
  gold,
  love,
  filled,
  info,
  primary,
  success,
  warning,
  danger,
  snow,
  style = {},
  transparent
}) {
  let Button
  const buttonColor = opacity => ({
    default: Color.buttonGray(opacity),
    info: Color.lightBlue(opacity),
    love: Color.pink(opacity),
    primary: Color.blue(opacity),
    logo: Color.logoBlue(opacity),
    success: Color.green(opacity),
    warning: Color.orange(opacity),
    gold: Color.gold(opacity),
    danger: Color.red(opacity),
    snow: Color.white(opacity),
    transparent: Color.buttonGray(opacity)
  })

  let colorKey = 'default'
  if (info) colorKey = 'info'
  if (love) colorKey = 'love'
  if (primary) colorKey = 'primary'
  if (logo) colorKey = 'logo'
  if (success) colorKey = 'success'
  if (warning) colorKey = 'warning'
  if (gold) colorKey = 'gold'
  if (danger) colorKey = 'danger'
  if (snow) colorKey = 'snow'
  if (transparent) colorKey = 'transparent'

  const backgroundOpacity = filled ? 1 : 0
  const backgroundHoverOpacity = transparent ? 0 : 0.9
  const backgroundDisabledOpacity = filled ? 0.2 : 0
  const textOpacity = disabled ? 0.2 : 1

  return (
    <button
      style={style}
      className={`${css`
        cursor: ${disabled ? 'default' : 'pointer'};
        overflow: hidden;
        font-family: 'Helvetica Neue';
        font-size: 1.5rem;
        text-transform: uppercase;
        padding: 1rem;
        color: ${filled
          ? '#fff'
          : snow ? Color.black(0.7) : buttonColor(textOpacity)[colorKey]};
        background: ${snow
          ? '#fff'
          : buttonColor(
              disabled ? backgroundDisabledOpacity : backgroundOpacity
            )[colorKey]};
        font-weight: bold;
        border: 1px solid
          ${snow
            ? Color.whiteGray()
            : buttonColor(
                disabled ? backgroundDisabledOpacity : backgroundOpacity
              )[colorKey]};
        border-radius: ${borderRadius};
        transition: background 0.2s;
        ${snow ? `box-shadow: 0 0 1px ${Color.black(0.8)};` : ''} &:focus {
          outline: ${(transparent || disabled || snow) && 0};
        }
        &:hover {
          background: ${snow
            ? '#fff'
            : buttonColor(
                disabled ? backgroundDisabledOpacity : backgroundHoverOpacity
              )[colorKey]};
          color: ${disabled && !filled
            ? buttonColor(textOpacity)[colorKey]
            : transparent ? Color.black() : snow ? Color.black() : '#fff'};
          border-color: ${buttonColor(
            disabled ? backgroundDisabledOpacity : backgroundHoverOpacity
          )[colorKey]};
          ${snow ? `box-shadow: 0 0 3px ${Color.black()};` : ''};
        }
      `} ${className} unselectable`}
      ref={ref => {
        Button = ref
      }}
      onClick={event => {
        if (disabled) return
        if (Button !== null) Button.blur()
        if (onClick) onClick(event)
      }}
    >
      {children}
    </button>
  )
}
