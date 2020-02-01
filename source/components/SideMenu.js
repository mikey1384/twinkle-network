import React from 'react';
import PropTypes from 'prop-types';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';

SideMenu.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object
};

export default function SideMenu({ children, className, style }) {
  return (
    <div
      style={style}
      className={`${className ? `${className} ` : ''}${css`
        top: CALC(50vh - 11rem);
        height: auto;
        width: 19rem;
        display: flex;
        position: fixed;
        justify-content: center;
        flex-direction: column;
        font-size: 2rem;
        font-family: sans-serif, Arial, Helvetica;
        > a {
          padding: 1.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          text-align: center;
          width: 100%;
          justify-content: center;
          color: ${Color.darkGray()};
          text-decoration: none;
        }
        > a:hover {
          font-weight: bold;
          color: ${Color.black()};
        }
        > a.active {
          font-weight: bold;
          color: ${Color.black()};
        }
        @media (max-width: ${mobileMaxWidth}) {
          display: none;
        }
      `}`}
    >
      {children}
    </div>
  );
}
