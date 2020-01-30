import React from 'react';
import PropTypes from 'prop-types';
import FileIcon from 'components/FileIcon';
import Image from 'components/Image';
import { truncateText } from 'helpers/stringHelpers';

FileContent.propTypes = {
  imageUrl: PropTypes.string,
  file: PropTypes.object.isRequired,
  fileType: PropTypes.string
};

export default function FileContent({ imageUrl, file, fileType }) {
  return (
    <div
      style={{ width: fileType === 'image' ? '8rem' : '5rem', height: '4rem' }}
    >
      {fileType === 'image' ? (
        <Image imageUrl={imageUrl} />
      ) : (
        <FileIcon size="3x" fileType={fileType} />
      )}
      <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
        {truncateText({ text: file.name, limit: 10 })}
      </div>
    </div>
  );
}
