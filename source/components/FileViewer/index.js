import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import FileInfo from './FileInfo';
import ImagePreview from './ImagePreview';
import ReactPlayer from 'react-player';
import { cloudFrontURL } from 'constants/defaultValues';
import { getFileInfoFromFileName } from 'helpers/stringHelpers';
import { isMobile } from 'helpers';

FileViewer.propTypes = {
  autoPlay: PropTypes.bool,
  contextType: PropTypes.string.isRequired,
  isThumb: PropTypes.bool,
  filePath: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  fileSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  modalOverModal: PropTypes.bool,
  style: PropTypes.object,
  videoHeight: PropTypes.string
};

export default function FileViewer({
  autoPlay,
  contextType,
  isThumb,
  filePath,
  fileName,
  fileSize,
  modalOverModal,
  style,
  videoHeight
}) {
  const mobile = useMemo(() => isMobile(navigator), []);
  const [muted, setMuted] = useState(true);
  const PlayerRef = useRef(null);
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
          <div
            style={{
              marginTop: isThumb ? 0 : '1rem',
              width: '100%',
              position: 'relative',
              paddingTop: '56.25%'
            }}
            onClick={handlePlayerClick}
          >
            <ReactPlayer
              ref={PlayerRef}
              playing={!mobile && autoPlay && !isThumb}
              muted={(!mobile && autoPlay && muted) || isThumb}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                right: 0,
                left: 0,
                bottom: 0
              }}
              width="100%"
              height={
                fileType === 'video'
                  ? videoHeight || (isMobile(navigator) ? '37vw' : '30vw')
                  : '5rem'
              }
              url={src}
              controls={(!isThumb && mobile) || !muted || !autoPlay}
            />
          </div>
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

  function handlePlayerClick() {
    if (!mobile && muted && autoPlay) {
      setMuted(false);
      PlayerRef.current.getInternalPlayer()?.pause();
    }
  }
}
