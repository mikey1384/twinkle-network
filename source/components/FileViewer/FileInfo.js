import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { css } from 'emotion';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';
import { renderFileSize } from 'helpers/stringHelpers';

FileInfo.propTypes = {
  fileName: PropTypes.string.isRequired,
  fileType: PropTypes.string.isRequired,
  fileSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isThumb: PropTypes.bool,
  src: PropTypes.string.isRequired
};

export default function FileInfo({
  fileName,
  fileType,
  fileSize,
  isThumb,
  src
}) {
  return (
    <div
      style={{
        width: '100%',
        background: !isThumb && Color.wellGray(),
        padding: !isThumb && '1rem',
        borderRadius
      }}
      className={css`
        width: 70%;
        @media (max-width: ${mobileMaxWidth}) {
          width: 100%;
        }
      `}
    >
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: isThumb ? 'flex-end' : 'center'
        }}
      >
        <div
          className={
            isThumb
              ? ''
              : css`
                  color: ${Color.black()};
                  cursor: pointer;
                  &:hover {
                    color: #000;
                  }
                `
          }
          onClick={() => window.open(src)}
        >
          <Icon
            className={css`
              font-size: 10rem;
              @media (max-width: ${mobileMaxWidth}) {
                font-size: 7rem;
              }
            `}
            icon={fileType === 'other' ? 'file' : `file-${fileType}`}
          />
        </div>
        {!isThumb && (
          <div
            style={{
              width: '100%',
              marginLeft: '1rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div
              style={{
                displahy: 'flex',
                flexDirection: 'column',
                width: '100%'
              }}
            >
              <div style={{ width: '100%' }}>
                <a
                  style={{ fontWeight: 'bold' }}
                  className={css`
                    @media (max-width: ${mobileMaxWidth}) {
                      font-size: 1.5rem;
                    }
                  `}
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {fileName}
                </a>
              </div>
              <div
                className={css`
                  font-size: 1.2rem;
                  @media (max-width: ${mobileMaxWidth}) {
                    font-size: 1rem;
                  }
                `}
              >
                {renderFileSize(fileSize)}
              </div>
            </div>
            <p
              style={{
                fontWeight: 'bold',
                cursor: 'pointer',
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-end'
              }}
              className={css`
                color: ${Color.black()};
                &:hover {
                  color: #000;
                }
                line-height: 1;
                @media (max-width: ${mobileMaxWidth}) {
                  font-size: 1.3rem;
                }
              `}
              onClick={() => window.open(src)}
            >
              Download
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
