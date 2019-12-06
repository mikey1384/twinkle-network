import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Image from '../Image';
import FileIcon from '../FileIcon';
import { unix } from 'moment';
import { borderRadius, Color } from 'constants/css';
import { getFileInfoFromFileName, renderFileSize } from 'helpers/stringHelpers';
import { cloudFrontURL } from 'constants/defaultValues';

TargetMessage.propTypes = {
  message: PropTypes.object.isRequired
};

export default function TargetMessage({ message }) {
  const fileType = useMemo(() => {
    return message.fileName
      ? getFileInfoFromFileName(message.fileName)?.fileType
      : null;
  }, [message.fileName]);
  const imageSrc = useMemo(() => {
    if (!message.filePath || fileType !== 'image') return '';
    return `${cloudFrontURL}/attachments/chat/${
      message.filePath
    }/${encodeURIComponent(message.fileName)}`;
  }, [message.fileName, message.filePath, fileType]);

  return (
    <div
      style={{
        marginTop: '0.5rem',
        marginBottom: '1rem',
        padding: '1rem',
        background: Color.wellGray(),
        width: '85%',
        display: 'flex',
        justifyContent: 'space-between',
        borderRadius
      }}
    >
      <div>
        <p style={{ fontWeight: 'bold' }}>
          {message.username}{' '}
          <small
            style={{
              fontWeight: 'normal',
              fontSize: '1rem',
              color: Color.darkGray()
            }}
          >
            {unix(message.timeStamp).format('LLL')}
          </small>
        </p>
        <p style={{ marginTop: '0.5rem' }}>
          {message.content || message.fileName}
        </p>
      </div>
      {fileType && message.fileName && (
        <div
          style={{
            display: 'flex',
            maxWidth: imageSrc ? '12rem' : '30rem',
            height: '10rem'
          }}
        >
          {imageSrc ? (
            <Image imageUrl={imageSrc} />
          ) : (
            <FileIcon size="5x" fileType={fileType} />
          )}
          {!imageSrc && (
            <div style={{ marginLeft: '1rem', fontSize: '1.3rem' }}>
              <p>{message.fileName}</p>
              {message.fileSize && <p>{renderFileSize(message.fileSize)}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
