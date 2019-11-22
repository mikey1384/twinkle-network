import React from 'react';
import PropTypes from 'prop-types';
import { memo, Color, mobileMaxWidth } from 'constants/css';
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

function Square({ count, className, img, shade, onClick, color, style }) {
  return (
    <div
      className={`${css`
        background-repeat: no-repeat;
        background-position: center;
        font-size: 1.5rem;
        &.blurred {
          background: ${Color.brownOrange()};
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
        @media (max-width: ${mobileMaxWidth}) {
          font-size: 1rem;
        }
      `} ${shade} ${className}`}
      style={{ position: 'relative', ...(style || {}) }}
      onClick={onClick}
    >
      {img && (
        <img
          {...img}
          style={img?.style || {}}
          className={css`
            width: 100%;
          `}
        />
      )}
      {count > 1 && (
        <div
          className={css`
            cursor: default;
            position: absolute;
            font-weight: bold;
            left: 18px;
            bottom: -2px;
            color: ${color === 'black' ? '#fff' : '#000'};
            @media (max-width: ${mobileMaxWidth}) {
              left: 10px;
            }
          `}
        >
          &times;{count}
        </div>
      )}
    </div>
  );
}

export default memo(Square);
