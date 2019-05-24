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
        width: 100%;
        background-repeat: no-repeat;
        background-position: center;
        font-size: 1.5rem;
        &.blurred {
          > img {
            opacity: 0.1;
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
      {img && <img {...img} style={{ ...(img?.style || {}), width: '100%' }} />}
      {count > 1 && (
        <div
          style={{
            cursor: 'default',
            position: 'absolute',
            fontWeight: 'bold',
            left: '18px',
            bottom: '-2px',
            color: color === 'black' ? '#fff' : '#000'
          }}
        >
          &times;{count}
        </div>
      )}
    </div>
  );
}
