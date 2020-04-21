import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';

VideoThumbnail.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  renderThumbnail: PropTypes.bool,
  snapshotAtTime: PropTypes.number,
  thumbnailHandler: PropTypes.func,
  videoUrl: PropTypes.string.isRequired
};

export default function VideoThumbnail({
  thumbnailHandler,
  width,
  height,
  snapshotAtTime,
  videoUrl,
  renderThumbnail
}) {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [metadataLoaded, setMetadataLoaded] = useState(false);
  const [seeked, setSeeked] = useState(false);
  const [snapshot, setSnapshot] = useState(null);
  const [suspended, setSuspended] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (metadataLoaded && dataLoaded && suspended) {
      if (
        !videoRef.current.currentTime ||
        videoRef.current.currentTime < snapshotAtTime
      ) {
        videoRef.current.currentTime = snapshotAtTime;
      }

      if (seeked && !snapshot) {
        handleLoadSnapShot();
      }
    }
    function handleLoadSnapShot() {
      try {
        canvasRef.current.height = videoRef.current.videoHeight;
        canvasRef.current.width = videoRef.current.videoWidth;

        // resize thumbnail or no ?
        if (!width || !height) {
          canvasRef.current.getContext('2d').drawImage(videoRef.current, 0, 0);
        } else {
          canvasRef.current
            .getContext('2d')
            .drawImage(videoRef.current, 0, 0, width, height);
        }

        const thumbnail = canvasRef.current.toDataURL('image/png');

        // Remove video & canvas elements (no longer needed)
        videoRef.current.src = ''; // setting to empty string stops video from loading
        videoRef.current.remove();
        videoRef.current.remove();

        setSnapshot(thumbnail);

        // pass the thumbnail url back to parent component's thumbnail handler (if any)
        if (thumbnailHandler) {
          thumbnailHandler(thumbnail);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [
    dataLoaded,
    height,
    metadataLoaded,
    seeked,
    snapshot,
    snapshotAtTime,
    suspended,
    thumbnailHandler,
    width
  ]);

  if (!snapshot) {
    return (
      <div>
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
          src={videoUrl}
          onLoadedMetadata={() => setMetadataLoaded(true)}
          onLoadedData={() => setDataLoaded(true)}
          onSuspend={() => setSuspended(true)}
          onSeeked={() => setSeeked(true)}
        ></video>
      </div>
    );
  } else {
    if (renderThumbnail) {
      return (
        <div>
          <img src={snapshot} alt="my video thumbnail" />
        </div>
      );
    } else {
      return null;
    }
  }
}
