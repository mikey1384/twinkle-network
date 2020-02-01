import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { truncateText } from 'helpers/stringHelpers';
import { useContentState } from 'helpers/hooks';
import YouTubeIcon from './YoutubeIcon.svg';
import ErrorBoundary from 'components/ErrorBoundary';

WebsiteContent.propTypes = {
  attachment: PropTypes.object.isRequired
};

export default function WebsiteContent({ attachment }) {
  const history = useHistory();
  const { content, thumbUrl } = useContentState({
    contentType: attachment.contentType,
    contentId: attachment.id
  });
  const fallbackImage = '/img/link.png';
  return (
    <ErrorBoundary>
      <div
        style={{
          width: '8rem',
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
                left: 'CALC(50% - 2rem)',
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
    </ErrorBoundary>
  );
}
