import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ExtractedThumb from 'components/ExtractedThumb';
import Icon from 'components/Icon';
import ReactPlayer from 'react-player';
import { v1 as uuidv1 } from 'uuid';
import { isMobile } from 'helpers';
import { useAppContext, useContentContext } from 'contexts';

VideoPlayer.propTypes = {
  autoPlay: PropTypes.bool,
  contentId: PropTypes.number,
  contextType: PropTypes.string,
  fileType: PropTypes.string,
  isMuted: PropTypes.bool,
  isThumb: PropTypes.bool,
  src: PropTypes.string,
  thumbUrl: PropTypes.string,
  videoHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default function VideoPlayer({
  autoPlay,
  contentId,
  contextType,
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
    actions: { onSetThumbUrl }
  } = useContentContext();
  const [muted, setMuted] = useState(isMuted);
  const mobile = isMobile(navigator);
  const PlayerRef = useRef(null);
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
      {contextType === 'chat' && (
        <ExtractedThumb
          src={src}
          isHidden
          onThumbnailLoad={handleThumbnailLoad}
          thumbUrl={thumbUrl}
        />
      )}
      <ReactPlayer
        loop={!mobile && autoPlay && muted}
        ref={PlayerRef}
        playing={!mobile && autoPlay}
        playsInline
        muted={(!mobile && autoPlay && muted) || isThumb}
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
        controls={(!isThumb && mobile) || !muted || !autoPlay}
      />
      {!isThumb && !mobile && autoPlay && muted && (
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

  function handlePlayerClick() {
    if (!mobile && muted && autoPlay) {
      setMuted(false);
      PlayerRef.current.getInternalPlayer()?.pause();
    }
  }

  function handleThumbnailLoad(thumb) {
    const dataUri = thumb.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(dataUri, 'base64');
    const file = new File([buffer], 'thumb.png');
    handleUploadThumb();

    async function handleUploadThumb() {
      const thumbUrl = await uploadThumb({
        contentType: 'chat',
        contentId,
        file,
        path: uuidv1()
      });
      onSetThumbUrl({
        contentId,
        contentType: 'chat',
        thumbUrl
      });
    }
  }
}
