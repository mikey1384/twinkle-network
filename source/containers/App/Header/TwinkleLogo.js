import React from 'react';
import PropTypes from 'prop-types';
import { Color } from 'constants/css';
import { css } from 'emotion';

TwinkleLogo.propTypes = {
  style: PropTypes.object
};

export default function TwinkleLogo({ style }) {
  return (
    <div
      style={style}
      className={`desktop ${css`
        cursor: pointer;
        position: relative;
        width: 10rem;
        height: 2rem;
      `}`}
      onClick={() => {
        window.location.href = '/';
      }}
    >
      <div
        onClick={() => (document.getElementById('App').scrollTop = 0)}
        className={css`
          font-size: 2rem;
          font-weight: bold;
          font-family: sans-serif, Arial, Helvetica;
          line-height: 0.9;
          color: ${Color.gray()};
          > .logo {
            line-height: 1;
          }
          > .logo-twin {
            color: ${Color.logoBlue()};
          }
          > .logo-kle {
            color: ${Color.logoGreen()};
          }
        `}
      >
        <span className="logo logo-twin">Twin</span>
        <span className="logo logo-kle">kle</span>
      </div>
    </div>
  );
}
