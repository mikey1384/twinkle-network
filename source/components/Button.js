import PropTypes from 'prop-types'
import React from 'react'
import { css } from 'emotion'
import { borderRadius, Color, mobileMaxWidth } from 'constants/css'

Button.propTypes = {
  alert: PropTypes.bool,
  warning: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  filled: PropTypes.bool,
  gold: PropTypes.bool,
  love: PropTypes.bool,
  hoverClass: PropTypes.string,
  info: PropTypes.bool,
  logo: PropTypes.bool,
  logoGreen: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node,
  danger: PropTypes.bool,
  onHover: PropTypes.bool,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  opacity: PropTypes.number,
  peace: PropTypes.bool,
  primary: PropTypes.bool,
  snow: PropTypes.bool,
  success: PropTypes.bool,
  style: PropTypes.object,
  transparent: PropTypes.bool
}
export default function Button({
  alert,
  className,
  disabled,
  onClick,
  onHover,
  children = null,
  logo,
  hoverClass,
  gold,
  love,
  filled,
  info,
  logoGreen,
  opacity,
  primary,
  success,
  peace,
  warning,
  danger,
  onMouseEnter = () => {},
  onMouseLeave = () => {},
  snow,
  style = {},
  transparent
}) {
  let Button
  const buttonColor = opacity => ({
    default: Color.buttonGray(opacity),
    alert: Color.logoGreen(opacity),
    info: Color.lightBlue(opacity),
    love: Color.pink(opacity),
    primary: Color.blue(opacity),
    logo: Color.logoBlue(opacity),
    logoGreen: Color.logoGreen(opacity),
    success: Color.green(opacity),
    warning: Color.orange(opacity),
    gold: Color.gold(opacity),
    danger: Color.red(opacity),
    snow: Color.white(opacity),
    peace: Color.logoGreen(opacity),
    transparent: Color.buttonGray(opacity)
  })

  let colorKey = 'default'
  if (info) colorKey = 'info'
  if (love) colorKey = 'love'
  if (primary) colorKey = 'primary'
  if (logo) colorKey = 'logo'
  if (logoGreen) colorKey = 'logoGreen'
  if (success) colorKey = 'success'
  if (alert) colorKey = 'alert'
  if (warning) colorKey = 'warning'
  if (gold) colorKey = 'gold'
  if (danger) colorKey = 'danger'
  if (snow) colorKey = 'snow'
  if (peace) colorKey = 'peace'
  if (transparent) colorKey = 'transparent'
  if (onHover) colorKey = hoverClass
  const backgroundOpacity = filled ? 1 : opacity || 0
  const backgroundHoverOpacity = transparent ? 0 : 0.9
  const backgroundDisabledOpacity = filled ? 0.2 : 0
  const textOpacity = disabled ? 0.2 : 1

  return (
    <button
      style={style}
      className={`${css`
        cursor: ${disabled ? 'default' : 'pointer'};
        overflow: hidden;
        font-family: 'Helvetica Neue', Helvetica, 'Liberation Sans', Arial,
          sans-serif;
        font-size: 1.5rem;
        text-transform: uppercase;
        padding: 1rem;
        color: ${filled || opacity
          ? '#fff'
          : snow
            ? Color.black(0.7)
            : buttonColor(textOpacity)[colorKey]};
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
            : transparent
              ? Color.black()
              : snow
                ? Color.black()
                : '#fff'};
          border-color: ${buttonColor(
            disabled ? backgroundDisabledOpacity : backgroundHoverOpacity
          )[colorKey]};
          ${snow ? `box-shadow: 0 0 3px ${Color.black()};` : ''};
        }
        @media (max-width: ${mobileMaxWidth}) {
          &:hover {
            background: ${snow
              ? '#fff'
              : buttonColor(
                  disabled ? backgroundDisabledOpacity : backgroundOpacity
                )[colorKey]};
            color: ${filled || opacity
              ? '#fff'
              : snow
                ? Color.black(0.7)
                : buttonColor(textOpacity)[colorKey]};
            border: 1px solid
              ${snow
                ? Color.whiteGray()
                : buttonColor(
                    disabled ? backgroundDisabledOpacity : backgroundOpacity
                  )[colorKey]};
          }
        }
      `} ${className} unselectable`}
      ref={ref => {
        Button = ref
      }}
      onClick={event => {
        if (Button !== null) Button.blur()
        if (onClick) onClick(event)
      }}
      disabled={disabled}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </button>
  )
}
