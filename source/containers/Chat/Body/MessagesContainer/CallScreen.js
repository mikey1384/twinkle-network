import React from 'react';
import PropTypes from 'prop-types';

CallScreen.propTypes = {
  style: PropTypes.object
};

export default function CallScreen({ style }) {
  return (
    <div style={{ width: '100%', ...style }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        Calling...
      </div>
    </div>
  );
}
