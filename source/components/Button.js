import PropTypes from 'prop-types';
import React from 'react';
import { css } from 'emotion';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';

Button.propTypes = {
  alert: PropTypes.bool,
  warning: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  filled: PropTypes.bool,
  stretch: PropTypes.bool,
  gold: PropTypes.bool,
  love: PropTypes.bool,
  hoverClass: PropTypes.string,
  info: PropTypes.bool,
  logo: PropTypes.bool,
  logoGreen: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node,
  danger: PropTypes.bool,
  ocean: PropTypes.bool,
  onHover: PropTypes.bool,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  opacity: PropTypes.number,
  peace: PropTypes.bool,
  primary: PropTypes.bool,
  snow: PropTypes.bool,
  success: PropTypes.bool,
  style: PropTypes.object,
  transparent: PropTypes.bool,
  wood: PropTypes.bool
};

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
  danger,
  filled,
  info,
  logoGreen,
  ocean,
  opacity,
  primary,
  stretch,
  success,
  peace,
  warning,
  wood,
  onMouseEnter = () => {},
  onMouseLeave = () => {},
  snow,
  style = {},
  transparent
}) {
  let Button;
  const buttonColor = opacity => ({
    default: Color.black(opacity),
    alert: Color.logoGreen(opacity),
    info: Color.lightBlue(opacity),
    love: Color.pink(opacity),
    primary: Color.blue(opacity),
    logo: Color.logoBlue(opacity),
    logoGreen: Color.logoGreen(opacity),
    ocean: Color.oceanBlue(opacity),
    success: Color.green(opacity),
    danger: Color.red(opacity),
    gold: Color.gold(opacity),
    peace: Color.logoGreen(opacity),
    snow: Color.white(opacity),
    transparent: Color.black(opacity),
    warning: Color.orange(opacity),
    wood: Color.brown(opacity)
  });

  let colorKey = 'default';
  if (alert) colorKey = 'alert';
  if (danger) colorKey = 'danger';
  if (gold) colorKey = 'gold';
  if (info) colorKey = 'info';
  if (logo) colorKey = 'logo';
  if (logoGreen) colorKey = 'logoGreen';
  if (love) colorKey = 'love';
  if (ocean) colorKey = 'ocean';
  if (peace) colorKey = 'peace';
  if (primary) colorKey = 'primary';
  if (snow) colorKey = 'snow';
  if (success) colorKey = 'success';
  if (warning) colorKey = 'warning';
  if (wood) colorKey = 'wood';
  if (onHover) colorKey = hoverClass;
  const backgroundOpacity = filled ? 1 : opacity || 0;
  const backgroundHoverOpacity = transparent ? 0 : 0.9;
  const backgroundDisabledOpacity = filled ? 0.2 : 0;
  const textOpacity = disabled ? 0.2 : transparent ? 0.5 : 1;

  return (
    <button
      style={{ ...style, ...(stretch ? { width: '100%' } : {}) }}
      className={`${css`
        cursor: ${disabled ? 'default' : 'pointer'};
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: sans-serif, Arial, Helvetica;
        text-transform: uppercase;
        font-weight: bold;
        line-height: 1;
        font-size: 1.5rem;
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
        border: 1px solid
          ${snow
            ? disabled
              ? Color.borderGray()
              : Color.whiteGray()
            : buttonColor(
                disabled ? backgroundDisabledOpacity : backgroundOpacity
              )[colorKey]};
        border-radius: ${borderRadius};
        transition: background 0.2s;
        ${snow
          ? disabled
            ? 'opacity: 0.5;'
            : `box-shadow: 0 0 1px ${Color.black(0.8)};`
          : ''} &:focus {
          outline: ${(transparent || disabled || snow) && 0};
        }
        &:hover {
          background: ${snow
            ? '#fff'
            : buttonColor(
                disabled ? backgroundDisabledOpacity : backgroundHoverOpacity
              )[colorKey]};
          color: ${renderHoverColor()};
          border-color: ${buttonColor(
            snow
              ? disabled
                ? Color.black(0.1)
                : Color.whiteGray()
              : disabled
              ? backgroundDisabledOpacity
              : backgroundHoverOpacity
          )[colorKey]};
          ${snow
            ? disabled
              ? ''
              : `box-shadow: 0 0 3px ${Color.black()};`
            : ''};
        }
        @media (max-width: ${mobileMaxWidth}) {
          font-size: 1.3rem;
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
          ${stretch ? 'border-radius: 0;' : ''};
        }
      `} ${className} unselectable`}
      ref={ref => {
        Button = ref;
      }}
      onClick={event => {
        if (Button !== null) Button.blur();
        if (onClick) onClick(event);
      }}
      disabled={disabled}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </button>
  );

  function renderHoverColor() {
    if (disabled) {
      if (snow) {
        return Color.black(0.7);
      }
      if (!filled) {
        return buttonColor(textOpacity)[colorKey];
      }
    } else {
      if (snow) {
        return Color.black();
      }
      if (transparent) {
        return buttonColor(1)[colorKey];
      }
    }
    return '#fff';
  }
}
