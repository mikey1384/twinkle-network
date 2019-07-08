import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { css } from 'emotion';
import { connect } from 'react-redux';
import { borderRadius, Color } from 'constants/css';
import { renderFileSize } from 'helpers/stringHelpers';

FileInfo.propTypes = {
  fileName: PropTypes.string.isRequired,
  fileType: PropTypes.string.isRequired,
  fileSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  profileTheme: PropTypes.string,
  src: PropTypes.string.isRequired
};

function FileInfo({ fileName, fileType, fileSize, profileTheme, src }) {
  const themeColor = profileTheme || 'logoBlue';
  return (
    <div
      style={{
        background: Color.lightGray(),
        padding: '1rem',
        width: '70%',
        borderRadius
      }}
    >
      <div style={{ display: 'flex', width: '100%' }}>
        <div>
          {fileType === 'other' ? (
            <Icon color={themeColor} size="7x" icon="file" />
          ) : (
            <Icon color={themeColor} size="7x" icon={`file-${fileType}`} />
          )}
        </div>
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
            style={{ displahy: 'flex', flexDirection: 'column', width: '100%' }}
          >
            <div style={{ width: '100%' }}>
              <a
                style={{ fontWeight: 'bold' }}
                href={src}
                target="_blank"
                rel="noopener noreferrer"
              >
                {fileName}
              </a>
            </div>
            <div>{renderFileSize(fileSize)}</div>
          </div>
          <div
            style={{
              fontWeight: 'bold',
              cursor: 'pointer',
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-end'
            }}
            className={css`
              color: ${Color.darkerGray()};
              &:hover {
                color: ${Color.black()};
              }
            `}
            onClick={() => window.open(src)}
          >
            Download
          </div>
        </div>
      </div>
    </div>
  );
}

export default connect(state => ({
  profileTheme: state.UserReducer.profileTheme
}))(FileInfo);
