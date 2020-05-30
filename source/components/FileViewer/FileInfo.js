import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { css } from 'emotion';
import {
  borderRadius,
  Color,
  desktopMinWidth,
  mobileMaxWidth
} from 'constants/css';
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
        height: '100%',
        background: !isThumb && Color.wellGray(),
        padding: !isThumb && '1rem',
        borderRadius
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: isThumb ? 'flex-end' : 'center',
          alignItems: 'center',
          height: '100%'
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
              className={css`
                height: 7rem;
                @media (max-width: ${mobileMaxWidth}) {
                  height: 6rem;
                }
              `}
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
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-end'
              }}
              onClick={() => window.open(src)}
            >
              <span
                className={css`
                  cursor: pointer;
                  color: ${Color.black()};
                  &:hover {
                    color: #000;
                    @media (min-width: ${desktopMinWidth}) {
                      text-decoration: underline;
                    }
                  }
                  line-height: 1;
                  @media (max-width: ${mobileMaxWidth}) {
                    font-size: 1.3rem;
                  }
                `}
              >
                Download
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
