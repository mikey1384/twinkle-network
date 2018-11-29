import React from 'react';
import PropTypes from 'prop-types';
import { Color } from 'constants/css';

FullTextReveal.propTypes = {
  direction: PropTypes.string,
  show: PropTypes.bool,
  style: PropTypes.object,
  text: PropTypes.string.isRequired,
  width: PropTypes.string
};
export default function FullTextReveal({
  direction = 'right',
  style,
  show,
  text,
  width = '500px'
}) {
  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          float: 'left',
          marginTop: 0,
          display: show ? 'block' : 'none',
          zIndex: 10,
          padding: '0.5rem',
          top: '100%',
          right: direction === 'right' ? 'auto' : 0,
          left: direction === 'left' ? 'auto' : 0,
          minWidth: '10rem',
          position: 'absolute',
          background: '#fff',
          boxShadow: `0 0 1px ${Color.black(0.9)}`,
          fontWeight: 'normal',
          lineHeight: 1.5,
          ...style
        }}
      >
        {text}
      </div>
    </div>
  );
}
