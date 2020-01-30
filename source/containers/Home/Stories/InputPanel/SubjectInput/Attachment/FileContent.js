import React from 'react';
import PropTypes from 'prop-types';
import FileIcon from 'components/FileIcon';
import { truncateText } from 'helpers/stringHelpers';

FileContent.propTypes = {
  attachment: PropTypes.object.isRequired,
  fileType: PropTypes.string
};

export default function FileContent({ attachment, fileType }) {
  return (
    <div style={{ width: '6rem' }}>
      <FileIcon size="3x" fileType={fileType} />
      <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
        {truncateText({ text: attachment.name, limit: 20 })}
      </div>
    </div>
  );
}
