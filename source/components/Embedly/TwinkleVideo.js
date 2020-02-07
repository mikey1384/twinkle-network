import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import VideoPlayer from 'components/VideoPlayer';
import Link from 'components/Link';
import { css } from 'emotion';
import { mobileMaxWidth } from 'constants/css';
import { useAppContext, useContentContext } from 'contexts';
import { useContentState } from 'helpers/hooks';

TwinkleVideo.propTypes = {
  style: PropTypes.object,
  videoId: PropTypes.number.isRequired
};

export default function TwinkleVideo({ style, videoId }) {
  const {
    requestHelpers: { loadContent }
  } = useAppContext();
  const {
    actions: { onInitContent }
  } = useContentContext();
  const {
    loaded,
    notFound,
    byUser,
    content,
    hasHqThumb,
    rewardLevel,
    uploader
  } = useContentState({
    contentId: videoId,
    contentType: 'video'
  });
  useEffect(() => {
    if (!loaded) {
      init();
    }

    async function init() {
      const data = await loadContent({
        contentId: videoId,
        contentType: 'video'
      });
      onInitContent({ ...data, contentType: 'video' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return !notFound ? (
    <div style={{ position: 'relative', ...style }}>
      {!loaded ? (
        <Loading style={{ height: '100%' }} />
      ) : (
        <VideoPlayer
          style={{ width: '100%', height: '100%' }}
          byUser={!!byUser}
          rewardLevel={rewardLevel}
          hasHqThumb={hasHqThumb}
          uploader={uploader}
          videoCode={content}
          videoId={videoId}
        />
      )}
      {loaded && (
        <div
          style={{
            width: '100%',
            marginTop: rewardLevel > 0 ? '-1.5rem' : '-3.5rem'
          }}
        >
          <Link
            className={css`
              font-weight: bold;
              font-size: 1.7rem;
              @media (max-width: ${mobileMaxWidth}) {
                font-size: 1rem;
              }
            `}
            to={`/videos/${videoId}`}
          >
            Comment or post subjects about this video
          </Link>
        </div>
      )}
    </div>
  ) : null;
}
