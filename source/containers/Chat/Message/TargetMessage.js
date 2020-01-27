import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Image from '../Image';
import FileIcon from '../FileIcon';
import ImageModal from '../Modals/ImageModal';
import UsernameText from 'components/Texts/UsernameText';
import { unix } from 'moment';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';
import {
  getFileInfoFromFileName,
  processedStringWithURL,
  renderFileSize
} from 'helpers/stringHelpers';
import { css } from 'emotion';
import { cloudFrontURL } from 'constants/defaultValues';
import { isMobile } from 'helpers';

TargetMessage.propTypes = {
  message: PropTypes.object.isRequired
};

export default function TargetMessage({ message }) {
  const [imageModalShown, setImageModalShown] = useState(false);
  const fileType = useMemo(() => {
    return message.fileName
      ? getFileInfoFromFileName(message.fileName)?.fileType
      : null;
  }, [message.fileName]);
  const src = useMemo(() => {
    if (!message.filePath) return '';
    return `${cloudFrontURL}/attachments/chat/${
      message.filePath
    }/${encodeURIComponent(message.fileName)}`;
  }, [message.fileName, message.filePath]);

  return (
    <div
      style={{
        marginTop: '0.5rem',
        marginBottom: '1rem',
        padding: '1rem',
        background: Color.wellGray(),
        display: 'flex',
        justifyContent: 'space-between',
        borderRadius
      }}
      className={css`
        width: 85%;
        @media (max-width: ${mobileMaxWidth}) {
          width: 100%;
        }
      `}
    >
      <div>
        <p style={{ fontWeight: 'bold' }}>
          <UsernameText
            color={Color.black()}
            user={{ id: message.userId, username: message.username }}
          />{' '}
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
        <p
          dangerouslySetInnerHTML={{
            __html: processedStringWithURL(message.content) || message.fileName
          }}
          style={{ marginTop: '0.5rem' }}
          className={css`
            @media (max-width: ${mobileMaxWidth}) {
              font-size: 1.3rem;
            }
          `}
        />
      </div>
      {fileType && message.fileName && (
        <div
          className={css`
            color: ${Color.black()};
            cursor: pointer;
            height: 12rem;
            max-width: ${fileType === 'image' ? '12rem' : '15rem'};
            &:hover {
              color: #000;
            }
            @media (max-width: ${mobileMaxWidth}) {
              max-width: ${fileType === 'image' ? '7rem' : '9rem'};
              height: ${fileType === 'image' ? '7rem' : '11rem'};
            }
          `}
          style={{
            display: 'flex',
            flexDirection: 'column'
          }}
          onClick={handleFileClick}
        >
          {fileType === 'image' ? (
            <Image imageUrl={src} />
          ) : (
            <FileIcon size="5x" fileType={fileType} />
          )}
          {fileType !== 'image' && (
            <div
              style={{
                marginTop: '1rem',
                textAlign: 'center'
              }}
              className={css`
                font-size: 1.3rem;
                @media (max-width: ${mobileMaxWidth}) {
                  font-size: 1rem;
                }
              `}
            >
              <p
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%'
                }}
              >
                {message.fileName}
              </p>
              <span>
                <b>Download</b>
              </span>
              {message.fileSize && !isMobile(navigator) && (
                <span> {renderFileSize(message.fileSize)}</span>
              )}
            </div>
          )}
        </div>
      )}
      {imageModalShown && (
        <ImageModal
          onHide={() => setImageModalShown(false)}
          fileName={message.fileName}
          src={src}
        />
      )}
    </div>
  );

  function handleFileClick() {
    if (fileType === 'image') {
      return setImageModalShown(true);
    }
    window.open(src);
  }
}
