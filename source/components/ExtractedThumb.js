import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import { css } from 'emotion';

VideoThumbnail.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  thumbnailHandler: PropTypes.func,
  src: PropTypes.string.isRequired,
  style: PropTypes.object
};

export default function VideoThumbnail({
  src,
  thumbnailHandler,
  width,
  height,
  style
}) {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [metadataLoaded, setMetadataLoaded] = useState(false);
  const [seeked, setSeeked] = useState(false);
  const [snapshot, setSnapshot] = useState(null);
  const [suspended, setSuspended] = useState(false);
  const videoRef = useRef({});
  const canvasRef = useRef(null);
  useEffect(() => {
    if (videoRef.current && metadataLoaded && dataLoaded && suspended) {
      if (!videoRef.current?.currentTime) {
        videoRef.current.currentTime = videoRef.current.duration / 2;
      }

      if (seeked && !snapshot) {
        handleLoadSnapShot();
      }
    }
    function handleLoadSnapShot() {
      try {
        canvasRef.current.height = videoRef.current.videoHeight;
        canvasRef.current.width = videoRef.current.videoWidth;

        if (!width || !height) {
          canvasRef.current.getContext('2d').drawImage(videoRef.current, 0, 0);
        } else {
          canvasRef.current
            .getContext('2d')
            .drawImage(videoRef.current, 0, 0, width, height);
        }
        const thumbnail = canvasRef.current.toDataURL('image/png');

        videoRef.current.src = '';
        videoRef.current.remove();
        videoRef.current.remove();
        setSnapshot(thumbnail);

        if (thumbnailHandler) {
          thumbnailHandler(thumbnail);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [
    dataLoaded,
    height,
    metadataLoaded,
    seeked,
    snapshot,
    suspended,
    thumbnailHandler,
    width
  ]);

  return snapshot ? (
    <img
      style={{ objectFit: 'cover', ...style }}
      src={snapshot}
      alt="my video thumbnail"
    />
  ) : (
    <div style={style}>
      <Loading style={{ width: '100%', height: '100%' }} />
      <canvas
        className={css`
          display: block;
          height: 1px;
          left: 0;
          object-fit: contain;
          position: fixed;
          top: 0;
          width: 1px;
          z-index: -1;
        `}
        ref={canvasRef}
      ></canvas>
      <video
        crossOrigin="anonymous"
        muted
        className={css`
          display: block;
          height: 1px;
          left: 0;
          object-fit: contain;
          position: fixed;
          top: 0;
          width: 1px;
          z-index: -1;
        `}
        ref={videoRef}
        src={src}
        onLoadedMetadata={() => setMetadataLoaded(true)}
        onLoadedData={() => setDataLoaded(true)}
        onSuspend={() => setSuspended(true)}
        onSeeked={() => setSeeked(true)}
      ></video>
    </div>
  );
}
