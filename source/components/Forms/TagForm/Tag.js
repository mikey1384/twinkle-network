import React from 'react';
import PropTypes from 'prop-types';
import { borderRadius } from 'constants/css';

Tag.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  renderTagLabel: PropTypes.func
};
export default function Tag({ label, onClick, renderTagLabel }) {
  return (
    <div
      style={{
        marginRight: '0.5rem',
        marginBottom: '1rem',
        backgroundColor: '#18aae0',
        display: 'inline-block',
        color: '#fff',
        paddingTop: '0.5rem',
        paddingBottom: '0.5rem',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        borderRadius,
        cursor: 'pointer'
      }}
      onClick={onClick}
    >
      {renderTagLabel?.(label) || label} &times;
    </div>
  );
}
