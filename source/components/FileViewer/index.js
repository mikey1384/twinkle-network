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
        ...style
      }}
    >
      {fileType === 'image' ? (
        <ImagePreview
          modalOverModal={modalOverModal}
          src={src}
          fileName={fileName}
        />
      ) : fileType === 'video' || fileType === 'audio' ? (
        <div>
          <div>
            <a
              style={{ fontWeight: 'bold' }}
              href={src}
              target="_blank"
              rel="noopener noreferrer"
            >
              {fileName}
            </a>
          </div>
          <div style={{ width: '100%' }} onClick={handlePlayerClick}>
            <ReactPlayer
              ref={PlayerRef}
              playing={!mobile && autoPlay}
              muted={!mobile && autoPlay && muted}
              style={{ marginTop: '1rem' }}
              width="100%"
              height={fileType === 'video' ? videoHeight || '30vw' : '5rem'}
              url={src}
              controls
            />
          </div>
        </div>
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

  function handlePlayerClick() {
    if (!mobile && muted) {
      setMuted(false);
      PlayerRef.current.getInternalPlayer()?.pause();
    }
  }
}
