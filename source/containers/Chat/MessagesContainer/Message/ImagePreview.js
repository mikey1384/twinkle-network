import React from 'react';
import PropTypes from 'prop-types';

ImagePreview.propTypes = {
  src: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired
};

export default function ImagePreview({ src, fileName }) {
  return (
    <div>
      <img
        style={{ maxWidth: '100%', height: '25vw', objectFit: 'contain' }}
        src={src}
        rel={fileName}
      />
    </div>
  );
}
