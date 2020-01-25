import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { useChatContext } from 'contexts';
import { Color, borderRadius } from 'constants/css';
import { getFileInfoFromFileName, renderFileSize } from 'helpers/stringHelpers';
import { cloudFrontURL } from 'constants/defaultValues';
import Image from '../../Image';
import FileIcon from '../../FileIcon';

TargetMessagePreview.propTypes = {
  onClose: PropTypes.func.isRequired
};

export default function TargetMessagePreview({ onClose }) {
  const {
    state: { replyTarget }
  } = useChatContext();
  const fileType = useMemo(() => {
    return replyTarget.fileName
      ? getFileInfoFromFileName(replyTarget.fileName)?.fileType
      : null;
  }, [replyTarget.fileName]);
  const imageSrc = useMemo(() => {
    if (!replyTarget.filePath || fileType !== 'image') return '';
    return `${cloudFrontURL}/attachments/chat/${
      replyTarget.filePath
    }/${encodeURIComponent(replyTarget.fileName)}`;
  }, [fileType, replyTarget.fileName, replyTarget.filePath]);

  return (
    <div
      style={{
        height: '12rem',
        width: '100%',
        position: 'relative',
        padding: '1rem 6rem 2rem 0.5rem',
        marginBottom: '2px'
      }}
    >
      <Icon
        icon="times"
        size="lg"
        style={{
          position: 'absolute',
          right: '1.7rem',
          top: '4rem',
          cursor: 'pointer'
        }}
        onClick={onClose}
      />
      <div
        style={{
          padding: '1rem',
          height: '100%',
          width: '100%',
          background: Color.targetGray(),
          borderRadius,
          overflow: 'scroll',
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <p
            style={{
              fontWeight: 'bold',
              color: Color.black()
            }}
          >
            {replyTarget.username}
          </p>
          <div style={{ marginTop: '0.5rem', paddingBottom: '1rem' }}>
            {replyTarget.content || replyTarget.fileName}
          </div>
        </div>
        {fileType && replyTarget.fileName && (
          <div
            style={{ display: 'flex', maxWidth: imageSrc ? '12rem' : '30rem' }}
          >
            {imageSrc ? (
              <Image imageUrl={imageSrc} />
            ) : (
              <FileIcon size="5x" fileType={fileType} />
            )}
            {!imageSrc && (
              <div style={{ marginLeft: '1rem', fontSize: '1.3rem' }}>
                <p>{replyTarget.fileName}</p>
                {replyTarget.fileSize && (
                  <p>{renderFileSize(replyTarget.fileSize)}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
