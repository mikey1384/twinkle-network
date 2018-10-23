import React from 'react';
import PropTypes from 'prop-types';
import { Color } from 'constants/css';
import { css } from 'emotion';

DropdownList.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  direction: PropTypes.string,
  style: PropTypes.object
};
export default function DropdownList({
  children,
  className,
  direction = 'right',
  style = {}
}) {
  return (
    <ul
      style={style}
      className={`${css`
        float: left;
        margin-top: 0;
        display: block;
        z-index: 10;
        padding: 0;
        top: 100%;
        right: ${direction === 'right' ? 'auto' : 0};
        left: ${direction === 'left' ? 'auto' : 0};
        min-width: 10rem;
        border: none;
        list-style: none;
        position: absolute;
        background: #fff;
        box-shadow: 1px 1px 2px ${Color.black(0.49)};
        font-weight: normal !important;
        line-height: 1.5;
        li {
          display: inline-block;
          clear: both;
          float: left;
          border-radius: 0 !important;
          border: none !important;
          padding: 1rem;
          text-align: center;
          font-size: 1.5rem;
          color: ${Color.darkGray()};
          cursor: pointer;
          border-bottom: none !important;
          width: 100%;
          &:hover {
            background: ${Color.headingGray()};
          }
          a {
            text-decoration: none;
          }
        }
      `} ${className}`}
    >
      {children}
    </ul>
  );
}
