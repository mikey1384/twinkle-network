import React from 'react';
import PropTypes from 'prop-types';
import { borderRadius } from 'constants/css';

Tag.propTypes = {
  index: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};
export default function Tag({ index, label, onClick }) {
  return (
    <span
      style={{
        marginLeft: index > 0 && '0.5rem',
        backgroundColor: '#18aae0',
        color: '#fff',
        paddingTop: '3px',
        paddingBottom: '3px',
        paddingLeft: '8px',
        paddingRight: '8px',
        borderRadius,
        cursor: 'pointer'
      }}
      onClick={onClick}
    >
      {label} &times;
    </span>
  );
}
