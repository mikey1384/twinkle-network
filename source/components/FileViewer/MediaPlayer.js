import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ExtractedThumb from 'components/ExtractedThumb';
import Icon from 'components/Icon';
import ReactPlayer from 'react-player';
import { v1 as uuidv1 } from 'uuid';
import { useAppContext, useContentContext } from 'contexts';
import { useContentState } from 'helpers/hooks';
import { isMobile } from 'helpers';

MediaPlayer.propTypes = {
  autoPlay: PropTypes.bool,
  contentId: PropTypes.number,
  contentType: PropTypes.string,
  fileType: PropTypes.string,
  isMuted: PropTypes.bool,
  isThumb: PropTypes.bool,
  src: PropTypes.string,
  thumbUrl: PropTypes.string,
  videoHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default function MediaPlayer({
  autoPlay,
  contentId,
  contentType,
  fileType,
  isMuted,
  isThumb,
  src,
  thumbUrl,
  videoHeight
}) {
  const {
    requestHelpers: { uploadThumb }
  } = useAppContext();
  const {
    actions: { onSetThumbUrl, onSetVideoCurrentTime, onSetVideoStarted }
  } = useContentContext();
  const { currentTime = 0 } = useContentState({ contentType, contentId });
  const [muted, setMuted] = useState(isMuted);
  const [paused, setPaused] = useState(false);
  const [timeAt, setTimeAt] = useState(0);
  const PlayerRef = useRef(null);
  const mobile = isMobile(navigator);
  const looping = useMemo(() => !mobile && !currentTime && autoPlay && muted, [
    autoPlay,
    currentTime,
    mobile,
    muted
  ]);

  useEffect(() => {
    if (currentTime > 0) {
      PlayerRef.current.seekTo(currentTime);
      setPaused(true);
    }

    return function cleanUp() {
      onSetVideoStarted({
        contentType,
        contentId,
        started: false
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return function setCurrentTimeBeforeUnmount() {
      if (timeAt > 0 && !looping) {
        onSetVideoCurrentTime({
          contentType,
          contentId,
          currentTime: timeAt
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeAt, looping]);

  const light = useMemo(() => {
    if (looping || currentTime) {
      return false;
    }
    return thumbUrl;
  }, [currentTime, looping, thumbUrl]);

  const isMobileThumb = isThumb && mobile;

  return (
    <div
      style={{
        marginTop: isThumb ? 0 : '1rem',
        width: '100%',
        position: 'relative',
        paddingTop:
          fileType === 'video' ? '56.25%' : fileType === 'audio' ? '3rem' : ''
      }}
      onClick={handlePlayerClick}
    >
      <ExtractedThumb
        src={src}
        isHidden={!isMobileThumb}
        style={{ width: '100%', height: '7rem' }}
        onThumbnailLoad={handleThumbnailLoad}
        thumbUrl={thumbUrl}
      />
      {!isMobileThumb && (
        <ReactPlayer
          loop={looping}
          light={light}
          ref={PlayerRef}
          playing={autoPlay && !paused}
          playsinline
          muted={isThumb || looping}
          onPlay={handlePlay}
          onProgress={handleVideoProgress}
          onReady={handleReady}
          style={{
            cursor: muted ? 'pointer' : 'default',
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            paddingBottom:
              fileType === 'audio' || fileType === 'video' ? '1rem' : 0
          }}
          width="100%"
          height={fileType === 'video' ? videoHeight || '100%' : '5rem'}
          url={src}
          controls={!isThumb && !looping}
        />
      )}
      {!isThumb && looping && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '5rem',
            fontWeight: 'bold',
            background: '#fff',
            color: '#000',
            position: 'absolute',
            top: '0',
            fontSize: '2rem',
            padding: '1rem'
          }}
        >
          <Icon size="lg" icon="volume-mute" />
          <span style={{ marginLeft: '0.7rem' }}>TAP TO UNMUTE</span>
        </div>
      )}
    </div>
  );

  function handlePlay() {
    if (!looping) {
      onSetVideoStarted({
        contentType,
        contentId,
        started: true
      });
    }
  }

  function handlePlayerClick() {
    if (looping) {
      setMuted(false);
      PlayerRef.current.getInternalPlayer()?.pause();
    }
  }

  function handleReady() {
    if (light) {
      PlayerRef.current.getInternalPlayer()?.play();
    }
  }

  function handleThumbnailLoad(thumb) {
    const dataUri = thumb.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(dataUri, 'base64');
    const file = new File([buffer], 'thumb.png');
    handleUploadThumb();

    async function handleUploadThumb() {
      const thumbUrl = await uploadThumb({
        contentType,
        contentId,
        file,
        path: uuidv1()
      });
      onSetThumbUrl({
        contentId,
        contentType,
        thumbUrl
      });
    }
  }

  function handleVideoProgress() {
    setTimeAt(PlayerRef.current.getCurrentTime());
  }
}
