import React from 'react';
import PropTypes from 'prop-types';
import FileInfo from './FileInfo';
import ImagePreview from './ImagePreview';
import { cloudFrontURL } from 'constants/defaultValues';
import { getFileTypeFromFileName } from 'helpers/stringHelpers';

FileMessage.propTypes = {
  content: PropTypes.string,
  filePath: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  fileSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
export default function FileMessage({ content, filePath, fileName, fileSize }) {
  const fileType = getFileTypeFromFileName(fileName);
  const src = `${cloudFrontURL}/attachments/chat/${filePath}/${encodeURIComponent(
    fileName
  )}`;
  return (
    <div style={{ marginTop: '1rem' }}>
      {fileType === 'image' ? (
        <ImagePreview src={src} fileName={fileName} />
      ) : (
        <FileInfo
          fileName={fileName}
          fileType={fileType}
          fileSize={fileSize}
          src={src}
        />
      )}
      {content}
    </div>
  );
}
