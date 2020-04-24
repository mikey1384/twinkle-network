import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import { css } from 'emotion';

ExtractedThumb.propTypes = {
  isHidden: PropTypes.bool,
  onThumbnailLoad: PropTypes.func,
  src: PropTypes.string.isRequired,
  style: PropTypes.object,
  thumbUrl: PropTypes.string
};

export default function ExtractedThumb({
  isHidden,
  src,
  onThumbnailLoad,
  style,
  thumbUrl
}) {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [metadataLoaded, setMetadataLoaded] = useState(false);
  const [seeked, setSeeked] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [suspended, setSuspended] = useState(false);
  const videoRef = useRef({});
  const canvasRef = useRef(null);
  useEffect(() => {
    if (thumbUrl) {
      setThumbnail(thumbUrl);
    } else {
      if (videoRef.current && metadataLoaded && dataLoaded && suspended) {
        if (!videoRef.current?.currentTime) {
          videoRef.current.currentTime = videoRef.current.duration / 2;
        }
        if (seeked && !thumbnail) {
          handleLoadThumbnail();
        }
      }
    }
    function handleLoadThumbnail() {
      try {
        canvasRef.current.height = videoRef.current.videoHeight;
        canvasRef.current.width = videoRef.current.videoWidth;

        canvasRef.current.getContext('2d').drawImage(videoRef.current, 0, 0);
        const thumbnail = canvasRef.current.toDataURL('image/png');

        videoRef.current.src = '';
        videoRef.current.remove();
        videoRef.current.remove();
        setThumbnail(thumbnail);

        if (onThumbnailLoad) {
          onThumbnailLoad(thumbnail);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [
    dataLoaded,
    metadataLoaded,
    onThumbnailLoad,
    seeked,
    suspended,
    thumbUrl,
    thumbnail
  ]);

  return thumbnail ? (
    isHidden ? null : (
      <img
        style={{ objectFit: 'cover', ...style }}
        src={thumbnail}
        alt="video thumbnail"
      />
    )
  ) : (
    <div style={style}>
      {!isHidden && <Loading style={{ width: '100%', height: '100%' }} />}
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
