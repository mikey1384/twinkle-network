import React from 'react';
import PropTypes from 'prop-types';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';

FilterBar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  bordered: PropTypes.bool,
  dropdownButton: PropTypes.node,
  info: PropTypes.bool,
  innerRef: PropTypes.func,
  success: PropTypes.bool,
  style: PropTypes.object
};
export default function FilterBar({
  bordered,
  className,
  children,
  info,
  innerRef,
  dropdownButton,
  style,
  success
}) {
  const color = {
    default: Color.blue(),
    success: Color.green(),
    info: Color.lightBlue()
  };
  let colorKey = 'default';
  if (info) colorKey = 'info';
  if (success) colorKey = 'success';
  return (
    <div
      style={style}
      ref={innerRef}
      className={`${css`
        background: #fff;
        height: 6rem;
        margin-bottom: 1rem;
        ${
          bordered
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
        .filter-section {
          width: 30%;
          height: 100%;
          padding: 0.5rem 1rem;
          display: flex;
          justify-content: flex-end;
          border-bottom: 1px solid ${Color.borderGray()};
        };
        .nav-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 100%;
          width: ${!dropdownButton ? '100%' : '70%'};
          > nav {
            font-family: sans-serif;
            font-weight: bold;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            width: 100%;
            border-bottom: 1px solid ${Color.borderGray()};
            color: ${Color.gray()};
            > a {
              color: ${Color.gray()};
              text-decoration: none;
            }
            &.alert {
              color: ${Color.pink()}!important;
            }
          }
          > nav.active {
            border-bottom: 3px solid ${color[colorKey]};
            color: ${color[colorKey]};
            > a {
              color: ${color[colorKey]};
            }
            @media (max-width: ${mobileMaxWidth}) {
              border-bottom: 4px solid ${color[colorKey]};
            }
          }
          > nav.active.alert {
            border-bottom: 3px solid ${Color.pink()}!important;
          }
          > nav:first-child {
            ${
              bordered ? 'border-bottom-left-radius: 5px;' : ''
            } @media (max-width: ${mobileMaxWidth}) {
              border-bottom-left-radius: 0;
            }
          }
          > nav:last-child {
            @media (max-width: ${mobileMaxWidth}) {
              border-bottom-right-radius: 0;
            }
            ${
              bordered && !dropdownButton
                ? 'border-bottom-right-radius: 5px;'
                : ''
            };
          }
          > nav:hover {
            transition: border-bottom 0.5s;
            color: ${color[colorKey]};
            border-bottom: 3px solid ${color[colorKey]};
            &.alert {
              color: ${Color.pink()}!important;
              border-bottom: 3px solid ${Color.pink()}!important;
            }
            > a {
              color: ${color[colorKey]};
              transition: color 0.5s, font-weight 0.5s;
              font-weight: bold;
            }
          }
        }
        @media (max-width: ${mobileMaxWidth}) {
          height: 7rem;
          border-radius: 0;
          border-left: none;
          border-right: none;
          border-top: none;
        }
      `} ${className}`}
    >
      <div className="nav-section">{children}</div>
      {dropdownButton && <div className="filter-section">{dropdownButton}</div>}
    </div>
  );
}
