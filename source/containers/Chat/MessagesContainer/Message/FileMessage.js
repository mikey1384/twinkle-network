import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import FileInfo from './FileInfo';
import DropdownButton from 'components/Buttons/DropdownButton';
import ImagePreview from './ImagePreview';
import ReactPlayer from 'react-player';
import { cloudFrontURL } from 'constants/defaultValues';
import {
  getFileTypeFromFileName,
  processedStringWithURL
} from 'helpers/stringHelpers';

FileMessage.propTypes = {
  authLevel: PropTypes.number,
  canDelete: PropTypes.bool,
  content: PropTypes.string,
  filePath: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  fileSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isLastMsg: PropTypes.bool,
  messageId: PropTypes.number,
  myId: PropTypes.number,
  onDelete: PropTypes.func.isRequired,
  scrollAtBottom: PropTypes.bool,
  setScrollToBottom: PropTypes.func.isRequired,
  uploaderAuthLevel: PropTypes.number,
  uploaderId: PropTypes.number.isRequired
};

export default function FileMessage({
  authLevel,
  canDelete,
  content,
  filePath,
  fileName,
  fileSize,
  isLastMsg,
  messageId,
  myId,
  onDelete,
  scrollAtBottom,
  setScrollToBottom,
  uploaderAuthLevel,
  uploaderId
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
  const userIsUploader = myId === uploaderId;
  const userCanDeleteThis =
    (canDelete && authLevel > uploaderAuthLevel) || userIsUploader;
  const dropdownButtonShown =
    !!messageId && (userIsUploader || userCanDeleteThis);

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
      <span
        dangerouslySetInnerHTML={{
          __html: processedStringWithURL(content)
        }}
      />
      {dropdownButtonShown && (
        <DropdownButton
          skeuomorphic
          color="darkerGray"
          style={{ position: 'absolute', top: 0, right: '5px' }}
          direction="left"
          opacity={0.8}
          menuProps={[
            {
              label: 'Remove',
              onClick: () => onDelete({ fileName, filePath, messageId })
            }
          ]}
        />
      )}
    </div>
  );
}
