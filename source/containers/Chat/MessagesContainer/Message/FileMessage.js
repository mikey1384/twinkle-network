import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import FileInfo from './FileInfo';
import ImagePreview from './ImagePreview';
import { cloudFrontURL } from 'constants/defaultValues';
import {
  getFileTypeFromFileName,
  processedStringWithURL
} from 'helpers/stringHelpers';

FileMessage.propTypes = {
  content: PropTypes.string,
  filePath: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  fileSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isLastMsg: PropTypes.bool,
  scrollAtBottom: PropTypes.bool,
  setScrollToBottom: PropTypes.func.isRequired
};
export default function FileMessage({
  content,
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
      ) : (
        <FileInfo
          fileName={fileName}
          fileType={fileType}
          fileSize={fileSize}
          src={src}
        />
      )}
      <span
        dangerouslySetInnerHTML={{
          __html: processedStringWithURL(content)
        }}
      />
    </div>
  );
}
