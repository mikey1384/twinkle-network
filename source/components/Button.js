import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';

Button.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  filled: PropTypes.bool,
  stretch: PropTypes.bool,
  hoverColor: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node,
  onHover: PropTypes.bool,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  opacity: PropTypes.number,
  skeuomorphic: PropTypes.bool,
  style: PropTypes.object,
  transparent: PropTypes.bool
};

export default function Button({
  className,
  color = 'black',
  disabled,
  onClick,
  onHover,
  children = null,
  hoverColor,
  filled,
  opacity,
  stretch,
  onMouseEnter = () => {},
  onMouseLeave = () => {},
  skeuomorphic,
  style = {},
  transparent
}) {
  const colorKey = onHover ? hoverColor : color;
  const backgroundOpacity = filled ? 1 : skeuomorphic ? 0.5 : opacity || 0;
  const backgroundHoverOpacity = transparent ? 0 : 0.9;
  const backgroundDisabledOpacity = filled || skeuomorphic ? 0.2 : 0;
  const textOpacity = disabled ? 0.2 : transparent ? 0.5 : 1;
  const ButtonRef = useRef(null);

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
        color: ${filled || opacity ? '#fff' : Color[colorKey](textOpacity)};
        background: ${skeuomorphic
          ? '#fff'
          : Color[colorKey](
              disabled ? backgroundDisabledOpacity : backgroundOpacity
            )};
        border: 1px solid
          ${Color[colorKey](
            disabled ? backgroundDisabledOpacity : backgroundOpacity
          )};
        border-radius: ${borderRadius};
        ${skeuomorphic
          ? disabled
            ? 'opacity: 0.5;'
            : `box-shadow: 0 0 1px ${Color[colorKey](0.5)};`
          : ''} &:focus {
          outline: ${(transparent || disabled || skeuomorphic) && 0};
        }
        &:hover {
          background: ${skeuomorphic
            ? '#fff'
            : Color[colorKey](
                disabled ? backgroundDisabledOpacity : backgroundHoverOpacity
              )};
          color: ${renderHoverColor()};
          border-color: ${Color[colorKey](
            disabled ? backgroundDisabledOpacity : backgroundHoverOpacity
          )};
          ${skeuomorphic
            ? disabled
              ? ''
              : `box-shadow: 0 0 3px ${Color[colorKey]()};`
            : ''};
        }
        @media (max-width: ${mobileMaxWidth}) {
          font-size: 1.3rem;
          &:hover {
            background: ${skeuomorphic
              ? '#fff'
              : Color[colorKey](
                  disabled ? backgroundDisabledOpacity : backgroundOpacity
                )};
            color: ${filled || opacity ? '#fff' : Color[colorKey](textOpacity)};
            border: 1px solid
              ${Color[colorKey](
                disabled ? backgroundDisabledOpacity : backgroundOpacity
              )};
          }
          ${stretch ? 'border-radius: 0;' : ''};
        }
      `} ${className} unselectable`}
      ref={ButtonRef}
      onClick={event => {
        if (ButtonRef.current !== null) ButtonRef.current.blur();
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
      if (!filled) {
        return Color[colorKey](textOpacity);
      }
    } else if (skeuomorphic || transparent) {
      return Color[colorKey]();
    }
    return '#fff';
  }
}
