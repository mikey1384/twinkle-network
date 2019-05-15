import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';

Square.propTypes = {
  className: PropTypes.string,
  count: PropTypes.number,
  color: PropTypes.string,
  img: PropTypes.object,
  onClick: PropTypes.func,
  shade: PropTypes.string,
  style: PropTypes.object
};

export default function Square({
  count,
  className,
  img,
  shade,
  onClick,
  color,
  style
}) {
  return (
    <div
      className={`${css`
        background-repeat: no-repeat;
        background-position: center;
        font-size: 1.5rem;
        &.blurred {
          > img {
            opacity: 0.2;
          }
        }
        &.highlighted {
          cursor: pointer;
        }
        &:focus {
          outline: none;
        }
      `} ${shade} ${className}`}
      style={{ position: 'relative', ...style }}
      onClick={onClick}
    >
      {img && <img {...img} />}
      {count > 1 && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: '-5px',
            color: color === 'black' ? '#fff' : '#000'
          }}
        >
          &times;{count}
        </div>
      )}
    </div>
  );
}
