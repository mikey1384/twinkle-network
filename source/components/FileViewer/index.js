import React from 'react';
import PropTypes from 'prop-types';
import FileInfo from './FileInfo';
import ImagePreview from './ImagePreview';
import VideoPlayer from './VideoPlayer';
import { cloudFrontURL } from 'constants/defaultValues';
import { getFileInfoFromFileName } from 'helpers/stringHelpers';

FileViewer.propTypes = {
  autoPlay: PropTypes.bool,
  contentId: PropTypes.number,
  contextType: PropTypes.string.isRequired,
  isMuted: PropTypes.bool,
  isThumb: PropTypes.bool,
  filePath: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  fileSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  modalOverModal: PropTypes.bool,
  style: PropTypes.object,
  thumbUrl: PropTypes.string,
  videoHeight: PropTypes.string
};

export default function FileViewer({
  autoPlay,
  contentId,
  contextType,
  isMuted = true,
  isThumb,
  filePath,
  fileName,
  fileSize,
  modalOverModal,
  style,
  thumbUrl,
  videoHeight
}) {
  const { fileType } = getFileInfoFromFileName(fileName);
  const src = `${cloudFrontURL}/attachments/${contextType}/${filePath}/${encodeURIComponent(
    fileName
  )}`;

  return (
    <div
      style={{
        width: '100%',
        padding:
          !isThumb && !['image', 'video', 'audio'].includes(fileType)
            ? '1rem'
            : '',
        ...style
      }}
    >
      {fileType === 'image' ? (
        <ImagePreview
          isThumb={isThumb}
          modalOverModal={modalOverModal}
          src={src}
          fileName={fileName}
        />
      ) : fileType === 'video' || fileType === 'audio' ? (
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
        >
          {!isThumb && (
            <div
              style={{
                width: '100%',
                padding: contextType === 'feed' && '0 1rem 0 1rem'
              }}
            >
              <a
                style={{ fontWeight: 'bold' }}
                href={src}
                target="_blank"
                rel="noopener noreferrer"
              >
                {fileName}
              </a>
            </div>
          )}
          <VideoPlayer
            autoPlay={autoPlay}
            contentId={contentId}
            contextType={contextType}
            fileType={fileType}
            isMuted={isMuted}
            isThumb={isThumb}
            src={src}
            thumbUrl={thumbUrl}
            videoHeight={videoHeight}
          />
        </div>
      ) : (
        <FileInfo
          isThumb={isThumb}
          fileName={fileName}
          fileType={fileType}
          fileSize={fileSize}
          src={src}
        />
      )}
    </div>
  );
}
