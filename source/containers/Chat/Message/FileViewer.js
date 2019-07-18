import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import FileInfo from './FileInfo';
import ImagePreview from './ImagePreview';
import ReactPlayer from 'react-player';
import { cloudFrontURL } from 'constants/defaultValues';
import { getFileTypeFromFileName } from 'helpers/stringHelpers';

FileViewer.propTypes = {
  filePath: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  fileSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isLastMsg: PropTypes.bool,
  modalOverModal: PropTypes.bool,
  scrollAtBottom: PropTypes.bool,
  setScrollToBottom: PropTypes.func
};

export default function FileViewer({
  filePath,
  fileName,
  fileSize,
  isLastMsg,
  modalOverModal,
  scrollAtBottom,
  setScrollToBottom
}) {
  useEffect(() => {
    if (scrollAtBottom && isLastMsg) {
      setScrollToBottom?.();
    }
  }, []);
  const fileType = getFileTypeFromFileName(fileName);
  const src = `${cloudFrontURL}/attachments/chat/${filePath}/${encodeURIComponent(
    fileName
  )}`;

  return (
    <div style={{ marginTop: '1rem' }}>
      {fileType === 'image' ? (
        <ImagePreview
          modalOverModal={modalOverModal}
          src={src}
          fileName={fileName}
        />
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
