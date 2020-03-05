import React from 'react';
import PropTypes from 'prop-types';
import { borderRadius, innerBorderRadius, Color } from 'constants/css';

StatusTag.propTypes = {
  large: PropTypes.bool,
  status: PropTypes.string
};

export default function StatusTag({ large, status = 'online' }) {
  const backgroundColor = {
    online: Color.green(),
    busy: Color.red(),
    away: Color.orange()
  };

  return large ? (
    <div
      style={{
        top: '74%',
        left: '70%',
        background: '#fff',
        position: 'absolute',
        border: '3px solid #fff',
        borderRadius
      }}
    >
      <div
        style={{
          background: backgroundColor[status],
          color: '#fff',
          padding: '0.3rem',
          minWidth: '5rem',
          fontSize: '1.4rem',
          textAlign: 'center',
          borderRadius: innerBorderRadius,
          fontWeight: 'bold'
        }}
      >
        {status}
      </div>
    </div>
  ) : (
    <div
      style={{
        top: '70%',
        left: '67%',
        background: '#fff',
        position: 'absolute',
        border: '2px solid #fff',
        borderRadius: '47%'
      }}
    >
      <div
        style={{
          background: backgroundColor[status],
          padding: '0.3rem',
          width: '1rem',
          height: '1rem',
          textAlign: 'center',
          borderRadius: '50%'
        }}
      />
    </div>
  );
}
