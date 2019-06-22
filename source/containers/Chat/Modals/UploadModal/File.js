import React from 'react';
import PropTypes from 'prop-types';

File.propTypes = {
  fileSize: PropTypes.number,
  fileType: PropTypes.string
};

export default function File({ fileSize, fileType }) {
  return (
    <div>
      {fileSize}
      {fileType}
      !!
    </div>
  );
}
