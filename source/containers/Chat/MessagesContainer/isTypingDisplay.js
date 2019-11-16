import React from 'react';
import PropTypes from 'prop-types';
import { Color } from 'css';

isTypingDisplay.propTypes = {
  many: PropTypes.number
};

export default function isTypingDisplay({ many }) {
  let isMultiple = many >= 2;
  let msg = isMultiple
    ? 'Somebody is typing...'
    : 'Several people are typing...';
  return (
    <div
      style={{
        color: Color.gray(),
        fontSize: '1.2rem'
      }}
    >
      {msg}
    </div>
  );
}
