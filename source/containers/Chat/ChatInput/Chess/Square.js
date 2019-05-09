import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';

Square.propTypes = {
  className: PropTypes.string,
  count: PropTypes.number,
  player: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
  shade: PropTypes.string
};

export default function Square({
  count,
  className,
  shade,
  onClick,
  style,
  player
}) {
  return (
    <div
      className={`${css`
        background-repeat: no-repeat;
        background-position: center;
        font-size: 1.5rem;
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
      {count > 1 && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: '-5px',
            color: player === 'black' ? '#fff' : '#000'
          }}
        >
          &times;{count}
        </div>
      )}
    </div>
  );
}
