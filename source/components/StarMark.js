import React from 'react';
import PropTypes from 'prop-types';

StarMark.propTypes = {
  size: PropTypes.number,
  style: PropTypes.object
};
export default function StarMark({ style, size = 6 }) {
  return (
    <img
      style={{
        ...style,
        width: `${size}rem`,
        height: `${size}rem`,
        position: 'absolute'
      }}
      src={'/img/star.png'}
    />
  );
}
