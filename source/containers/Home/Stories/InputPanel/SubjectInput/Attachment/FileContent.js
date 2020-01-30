import React from 'react';
import PropTypes from 'prop-types';

FileContent.propTypes = {
  attachment: PropTypes.object.isRequired
};

export default function FileContent({ attachment }) {
  return (
    <div>
      <div>{attachment.fileType}</div>
    </div>
  );
}
