import PropTypes from 'prop-types'
import React from 'react'
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
  success: PropTypes.bool,
  style: PropTypes.object
}
export default function Button({
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
  ...props
}) {
  let Button
  let buttonColor = opacity => Color.buttonGray(opacity)
  if (info) buttonColor = opacity => Color.lightBlue(opacity)
  if (love) buttonColor = opacity => Color.pink(opacity)
  if (primary) buttonColor = opacity => Color.blue(opacity)
  if (logo) buttonColor = opacity => Color.logoBlue(opacity)
  if (success) buttonColor = opacity => Color.green(opacity)
  if (warning) buttonColor = opacity => Color.orange(opacity)
  if (gold) buttonColor = opacity => Color.gold(opacity)
  if (danger) buttonColor = opacity => Color.red(opacity)
  const isDefault =
    !info &&
    !primary &&
    !success &&
    !warning &&
    !danger &&
    !love &&
    !gold &&
    !logo
  return (
    <button
      {...props}
      css={`
        cursor: ${disabled ? 'default' : 'pointer'};
        overflow: hidden;
        font-family: 'Helvetica Neue';
        font-size: 1.5rem;
        text-transform: uppercase;
        padding: 1rem;
        color: ${filled ? '#fff' : buttonColor(disabled ? 0.2 : 1)};
        background: ${filled
          ? buttonColor(isDefault ? 0 : disabled ? 0.2 : 1)
          : Color.gray(0)};
        font-weight: bold;
        border: 1px solid
          ${filled
            ? buttonColor(isDefault ? 0 : disabled ? 0.2 : 1)
            : Color.gray(0)};
        border-radius: ${borderRadius};
        transition: background 0.2s;
        &:focus {
          outline: ${(isDefault || disabled) && 0};
        }
        &:hover {
          background: ${isDefault
            ? Color.gray(0)
            : buttonColor(disabled ? 0.2 : 0.6)};
          color: ${isDefault
            ? filled ? '#fff' : disabled ? buttonColor(0.2) : Color.darkGray()
            : '#fff'};
          border-color: ${isDefault
            ? filled ? '#fff' : Color.gray(0)
            : buttonColor(disabled ? 0.2 : 0.6)};
        }
      `}
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
