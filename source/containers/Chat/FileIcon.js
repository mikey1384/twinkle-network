import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';

FileIcon.propTypes = {
  fileType: PropTypes.string.isRequired,
  size: PropTypes.string,
  style: PropTypes.object
};

export default function FileIcon({ fileType, size = '7x', style }) {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...style
      }}
    >
      {fileType === 'other' && <Icon size={size} icon="file" />}
      {fileType !== 'other' && <Icon size={size} icon={`file-${fileType}`} />}
    </div>
  );
}
