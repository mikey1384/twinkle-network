import React from 'react';
import PropTypes from 'prop-types';
import FileInfo from './FileInfo';
import ImagePreview from './ImagePreview';
import ReactPlayer from 'react-player';
import { cloudFrontURL } from 'constants/defaultValues';
import { getFileInfoFromFileName } from 'helpers/stringHelpers';

FileViewer.propTypes = {
  filePath: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  fileSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  modalOverModal: PropTypes.bool
};

export default function FileViewer({
  filePath,
  fileName,
  fileSize,
  modalOverModal
}) {
  const { fileType } = getFileInfoFromFileName(fileName);
  const src = `${cloudFrontURL}/attachments/chat/${filePath}/${encodeURIComponent(
    fileName
  )}`;

  return (
    <div
      style={{
        marginTop: '1rem',
        width: '100%'
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
          <ReactPlayer
            style={{ marginTop: '1rem' }}
            width="100%"
            height={fileType === 'video' ? '30vw' : '5rem'}
            url={src}
            controls
          />
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
}
