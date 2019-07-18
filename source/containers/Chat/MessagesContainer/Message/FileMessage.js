import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import FileInfo from './FileInfo';
import ImagePreview from './ImagePreview';
import ReactPlayer from 'react-player';
import { cloudFrontURL } from 'constants/defaultValues';
import { getFileTypeFromFileName } from 'helpers/stringHelpers';

FileMessage.propTypes = {
  filePath: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  fileSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isLastMsg: PropTypes.bool,
  scrollAtBottom: PropTypes.bool,
  setScrollToBottom: PropTypes.func.isRequired
};

export default function FileMessage({
  filePath,
  fileName,
  fileSize,
  isLastMsg,
  scrollAtBottom,
  setScrollToBottom
}) {
  useEffect(() => {
    if (scrollAtBottom && isLastMsg) {
      setScrollToBottom();
    }
  }, []);
  const fileType = getFileTypeFromFileName(fileName);
  const src = `${cloudFrontURL}/attachments/chat/${filePath}/${encodeURIComponent(
    fileName
  )}`;

  return (
    <div style={{ marginTop: '1rem' }}>
      {fileType === 'image' ? (
        <ImagePreview src={src} fileName={fileName} />
      ) : fileType === 'video' ? (
        <ReactPlayer width="70%" height="100%" url={src} controls />
      ) : (
        <FileInfo
          fileName={fileName}
          fileType={fileType}
          fileSize={fileSize}
          src={src}
        />
      )}
    </div>
  );
}
