import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { Color } from 'constants/css';

FullTextReveal.propTypes = {
  direction: PropTypes.string,
  show: PropTypes.bool,
  style: PropTypes.object,
  text: PropTypes.string.isRequired
};
export default function FullTextReveal({
  direction = 'right',
  style,
  show,
  text
}) {
  return (
    <ErrorBoundary style={{ position: 'relative' }}>
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
          width: '100%',
          position: 'absolute',
          background: '#fff',
          boxShadow: `0 0 1px ${Color.black(0.9)}`,
          fontWeight: 'normal',
          lineHeight: 1.5,
          whiteSpace: 'pre-wrap',
          overflowWrap: 'break-word',
          ...style
        }}
      >
        {text}
      </div>
    </ErrorBoundary>
  );
}
