import React from 'react';
import PropTypes from 'prop-types';

EntriesContainer.propTypes = {
  style: PropTypes.object
};

export default function EntriesContainer({ style }) {
  return <div style={style}>entries</div>;
}
