import PropTypes from 'prop-types'
import React from 'react'
import { css } from 'emotion'
import { borderRadius, Color } from 'constants/css'

Button.propTypes = {
  warning: PropTypes.bool,
  className: PropTypes.string,
  filled: PropTypes.bool,
  gold: PropTypes.bool,
  love: PropTypes.bool,
  info: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node,
  danger: PropTypes.bool,
  primary: PropTypes.bool,
  success: PropTypes.bool,
  style: PropTypes.object
}
export default function Button({
  onClick,
  children = null,
  className,
  gold,
  love,
  filled,
  info,
  style = {},
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
  if (success) buttonColor = opacity => Color.green(opacity)
  if (warning) buttonColor = opacity => Color.orange(opacity)
  if (gold) buttonColor = opacity => Color.gold(opacity)
  if (danger) buttonColor = opacity => Color.red(opacity)
  const isDefault = !info && !primary && !success && !warning && !danger && !love && !gold
  return (
    <button
      {...props}
      className={`${css`
        cursor: pointer;
        font-family: "Helvetica Neue";
        font-size: 1.5rem;
        text-transform: uppercase;
        padding: 1rem;
        color: ${buttonColor()};
        background: ${Color.gray(0)};
        font-weight: bold;
        border: 2px solid ${buttonColor(0)};
        border-radius: ${borderRadius};
        &:hover {
          background: ${isDefault ? Color.gray(0) : buttonColor(0.6)};
          color: ${isDefault ? Color.darkGray() : '#fff'};
          border-color: ${isDefault ? Color.gray(0) : buttonColor()};
        }
      `} ${className}`}
      ref={ref => {
        Button = ref
      }}
      style={{
        ...style,
        overflow: 'hidden',
        background: filled && buttonColor(0.6),
        borderColor: filled && buttonColor(),
        color: filled && '#fff'
      }}
      onClick={event => {
        if (Button !== null) Button.blur()
        if (onClick) onClick(event)
      }}
    >
      {children}
    </button>
  )
}
