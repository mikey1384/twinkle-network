import React from 'react';
import PropTypes from 'prop-types';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import { useMyState } from 'helpers/hooks';

FilterBar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  color: PropTypes.string,
  bordered: PropTypes.bool,
  dropdownButton: PropTypes.node,
  innerRef: PropTypes.func,
  inverted: PropTypes.bool,
  style: PropTypes.object
};

export default function FilterBar({
  color,
  bordered,
  className,
  children,
  innerRef,
  inverted,
  dropdownButton,
  style
}) {
  const { profileTheme } = useMyState();
  const themeColor = color || profileTheme;
  const selectedOpacity = 1;
  return (
    <div
      style={style}
      ref={innerRef}
      className={`${css`
        background: ${inverted ? Color[themeColor](0.7) : '#fff'};
        height: 6rem;
        margin-bottom: 1rem;
        ${
          !inverted && bordered
            ? `
        border-top: 1px solid ${Color.borderGray()};
        border-left: 1px solid ${Color.borderGray()};
        border-right: 1px solid ${Color.borderGray()};
        border-radius: ${borderRadius};
        `
            : ''
        };
        display: flex;
        font-size: 1.7rem;
        width: 100%;
        align-items: center;
        justify-content: space-between;
        > .filter-section {
          width: 30%;
          height: 100%;
          padding: 0.5rem 1rem;
          display: flex;
          justify-content: flex-end;
          border-bottom: ${inverted ? '' : `1px solid ${Color.borderGray()}`};
        };
        > .nav-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 100%;
          width: ${!dropdownButton ? '100%' : '70%'};
          > nav {
            font-family: sans-serif, Arial, Helvetica;
            font-weight: bold;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            width: 100%;
            border-bottom: ${inverted ? '' : `1px solid ${Color.borderGray()}`};
            color: ${inverted ? '#fff' : Color.gray()};
            > a {
              color: ${inverted ? '#fff' : Color.gray()};
              text-decoration: none;
            }
            &.alert {
              color: ${Color.gold()}!important;
            }
          }
          > nav.active {
            background: ${inverted ? Color[themeColor](selectedOpacity) : ''};
            border-bottom: ${
              inverted ? '' : `3px solid ${Color[themeColor](selectedOpacity)}`
            };
            color: ${inverted ? '#fff' : Color[themeColor](selectedOpacity)};
            > a {
              color: ${inverted ? '#fff' : Color[themeColor](selectedOpacity)};
            }
            @media (max-width: ${mobileMaxWidth}) {
              border-bottom: ${
                inverted
                  ? ''
                  : `4px solid ${Color[themeColor](selectedOpacity)}`
              };
            }
          }
          > nav.active.alert {
            border-bottom: 3px solid ${Color.gold()}!important;
          }
          > nav:first-of-type {
            ${
              !inverted && bordered ? 'border-bottom-left-radius: 5px;' : ''
            } @media (max-width: ${mobileMaxWidth}) {
              border-bottom-left-radius: 0;
            }
          }
          > nav:last-child {
            @media (max-width: ${mobileMaxWidth}) {
              border-bottom-right-radius: 0;
            }
            ${
              !inverted && bordered && !dropdownButton
                ? 'border-bottom-right-radius: 5px;'
                : ''
            };
          }
          > nav:hover {
            transition: border-bottom 0.5s, background 0.5s;
            background: ${inverted ? Color[themeColor](selectedOpacity) : ''};
            color: ${inverted ? '#fff' : Color[themeColor](selectedOpacity)};
            border-bottom: ${
              inverted ? '' : `3px solid ${Color[themeColor](selectedOpacity)}`
            };
            &.alert {
              color: ${Color.gold()}!important;
              border-bottom: 3px solid ${Color.gold()}!important;
            }
            > a {
              color: ${inverted ? '#fff' : Color[themeColor](selectedOpacity)};
              transition: color 0.5s, font-weight 0.5s;
              font-weight: bold;
            }
          }
        }
        @media (max-width: ${mobileMaxWidth}) {
          height: 5.5rem;
          border-radius: 0;
          border-left: none;
          border-right: none;
        }
      `} ${className}`}
    >
      <div className="nav-section">{children}</div>
      {dropdownButton && <div className="filter-section">{dropdownButton}</div>}
    </div>
  );
}
