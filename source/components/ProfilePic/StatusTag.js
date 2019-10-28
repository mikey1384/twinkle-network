import React from 'react';
import PropTypes from 'prop-types';
import { borderRadius, innerBorderRadius, Color } from 'constants/css';

StatusTag.propTypes = {
  status: PropTypes.string
};

export default function StatusTag({ status }) {
  const backgroundColor = {
    online: Color.green(),
    offline: Color.gray(),
    busy: Color.yellow(),
    away: Color.red()
  };

  return (
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
  );
}
