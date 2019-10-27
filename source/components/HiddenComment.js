import React from 'react';
import PropTypes from 'prop-types';
import {borderRadius, Color} from 'constants/css';

HiddenComment.propTypes = {
  onClick: PropTypes.func
};

export default function HiddenComment({onClick}) {
  return (
    <div
      style={{
        background: Color.darkerGray(),
        color: '#fff',
        textAlign: 'center',
        padding: '1rem',
        borderRadius,
        border: `1px solid ${Color.black()}`,
        fontSize: '1.7rem',
        cursor: 'pointer'
      }}
      onClick={onClick}
    >
      Submit your own response to view this comment. Tap here
    </div>
  );
}
