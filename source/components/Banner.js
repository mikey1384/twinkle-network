import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { Color } from 'constants/css';

Banner.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
  innerRef: PropTypes.func,
  style: PropTypes.object,
  onClick: PropTypes.func
};

export default function Banner({
  children,
  color = 'pink',
  innerRef,
  onClick,
  style = {}
}) {
  return (
    <div
      ref={innerRef}
      className={css`
        display: flex;
        width: 100%;
        background: ${Color[color]()};
        color: #fff;
        padding: 1.5rem;
        text-align: center;
        font-size: 2rem;
        flex-direction: column;
        justify-content: center;
        &:hover {
          ${onClick ? 'opacity: 0.8;' : ''};
        }
      `}
      style={{
        ...style,
        cursor: onClick && 'pointer'
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
