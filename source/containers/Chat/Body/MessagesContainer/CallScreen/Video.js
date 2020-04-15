import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';

Video.propTypes = {
  stream: PropTypes.object.isRequired
};

export default function Video({ stream }) {
  const videoRef = useRef(stream);
  useEffect(() => {
    const video = videoRef.current;
    if (videoRef.current && !videoRef.current.srcObject) {
      const clonedStream = stream.clone();
      video.srcObject = clonedStream;
    }
    return function cleanUp() {
      video.srcObject?.getTracks()?.forEach((track) => {
        track.stop();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        width: '50%',
        height: '100%',
        paddingTop: '1rem',
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <video
        className={css`
          &::-webkit-media-controls-volume-slider {
            display: none;
          }
          &::-webkit-media-controls-play-button {
            display: none;
          }
          &::-webkit-media-controls-timeline {
            display: none;
          }
        `}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
        autoPlay
        playsInline
        controls
        ref={videoRef}
      />
    </div>
  );
}
