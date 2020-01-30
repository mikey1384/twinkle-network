import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import ErrorBoundary from 'components/ErrorBoundary';
import { truncateText } from 'helpers/stringHelpers';
import { useContentState } from 'helpers/hooks';
import { useHistory } from 'react-router-dom';
import YouTubeIcon from './YoutubeIcon.svg';

Attachment.propTypes = {
  attachment: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired
};

export default function Attachment({ attachment, onClose }) {
  const history = useHistory();
  const { content, thumbUrl } = useContentState({
    contentType: attachment.contentType,
    contentId: attachment.id
  });
  const fallbackImage = '/img/link.png';
  return (
    <ErrorBoundary
      style={{
        width: '8rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative'
      }}
    >
      <Icon
        icon="times"
        style={{
          zIndex: 1,
          display: 'flex',
          background: '#000',
          color: '#fff',
          borderRadius: '50%',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0.2rem',
          width: '2rem',
          height: '2rem',
          position: 'absolute',
          cursor: 'pointer',
          right: '-0.5rem',
          top: '-1rem'
        }}
        onClick={onClose}
      />
      {attachment.contentType === 'file' ? (
        <div>This is a file</div>
      ) : (
        <>
          <div
            style={{
              cursor: 'pointer',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={() =>
              history.push(
                `/${attachment.contentType === 'url' ? 'links' : 'videos'}/${
                  attachment.id
                }`
              )
            }
          >
            <div style={{ fontSize: '2.5rem' }}>
              {attachment.contentType === 'video' && (
                <img
                  style={{
                    width: '4rem',
                    height: '3rem',
                    position: 'absolute',
                    left: '2.1rem',
                    top: '0.5rem'
                  }}
                  src={YouTubeIcon}
                />
              )}
              <img
                alt="Thumbnail"
                src={
                  attachment.contentType === 'video'
                    ? `https://img.youtube.com/vi/${content}/mqdefault.jpg`
                    : thumbUrl || fallbackImage
                }
                style={{
                  display: 'block',
                  width: '100%',
                  height: '4rem',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  margin: 'auto'
                }}
              />
            </div>
            <div style={{ marginTop: '0.5rem' }}>
              {truncateText({ text: attachment.title, limit: 20 })}
            </div>
          </div>
        </>
      )}
    </ErrorBoundary>
  );
}
