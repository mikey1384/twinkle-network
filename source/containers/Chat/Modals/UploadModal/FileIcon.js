import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';

FileIcon.propTypes = {
  fileType: PropTypes.string.isRequired
};

export default function FileIcon({ fileType }) {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {fileType === 'other' && <Icon size="7x" icon="file" />}
      {fileType !== 'other' && <Icon size="7x" icon={`file-${fileType}`} />}
    </div>
  );
}
