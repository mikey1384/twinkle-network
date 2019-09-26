import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import UsernameText from './Texts/UsernameText';
import Link from 'components/Link';
import FullTextReveal from 'components/Texts/FullTextReveal';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import VideoThumbImage from 'components/VideoThumbImage';
import Icon from 'components/Icon';
import { cleanString } from 'helpers/stringHelpers';
import { textIsOverflown } from 'helpers';
import { Color } from 'constants/css';
import { css } from 'emotion';
import { useAppContext } from 'context';

VideoThumb.propTypes = {
  className: PropTypes.string,
  clickSafe: PropTypes.bool,
  style: PropTypes.object,
  to: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  video: PropTypes.shape({
    byUser: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    content: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    rewardLevel: PropTypes.number,
    likes: PropTypes.array,
    title: PropTypes.string.isRequired
  }).isRequired
};

function VideoThumb({ className, clickSafe, style, to, user, video }) {
  const {
    user: {
      state: { profileTheme }
    }
  } = useAppContext();
  const [onTitleHover, setOnTitleHover] = useState(false);
  const ThumbLabelRef = useRef(null);

  return (
    <ErrorBoundary style={style}>
      <div
        className={`${className} ${css`
          display: flex;
          width: 100%;
          flex-direction: column;
          align-items: flex-end;
          position: relative;
          font-size: 1.5rem;
          box-shadow: 0 0 5px ${Color.darkerGray()};
          background: ${Color.whiteGray()};
          border-radius: 1px;
          p {
            font-weight: bold;
          }
        `}`}
      >
        <div style={{ width: '100%' }}>
          <Link to={`/${to}`} onClickAsync={onLinkClick}>
            <VideoThumbImage
              height="65%"
              videoId={video.id}
              rewardLevel={video.rewardLevel}
              src={`https://img.youtube.com/vi/${video.content}/mqdefault.jpg`}
            />
          </Link>
        </div>
        <div
          style={{
            height: '8rem',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            padding: '0 1rem'
          }}
        >
          <div
            onMouseOver={onMouseOver}
            onMouseLeave={() => setOnTitleHover(false)}
            style={{ width: '100%' }}
          >
            <p
              ref={ThumbLabelRef}
              style={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                lineHeight: 'normal'
              }}
            >
              <a
                style={{
                  color: video.byUser ? Color[profileTheme](0.9) : Color.blue()
                }}
                href={`/${to}`}
                onClick={onLinkClick}
              >
                {cleanString(video.title)}
              </a>
            </p>
            <FullTextReveal
              show={onTitleHover}
              text={cleanString(video.title)}
            />
          </div>
          <div style={{ width: '100%', fontSize: '1.2rem' }}>
            <div className="username">
              Added by <UsernameText user={user} />
            </div>
            {video.likes?.length > 0 && (
              <div style={{ marginTop: '0.5rem' }}>
                <Icon icon="thumbs-up" />
                &nbsp;&times;&nbsp;
                {video.likes.length}
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
  function onLinkClick() {
    return Promise.resolve(clickSafe);
  }
  function onMouseOver() {
    if (textIsOverflown(ThumbLabelRef.current)) {
      setOnTitleHover(true);
    }
  }
}
