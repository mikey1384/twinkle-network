import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';

Video.propTypes = {
  numVideos: PropTypes.number,
  stream: PropTypes.object.isRequired
};
export default function Video({ numVideos, stream }) {
  const videoRef = useRef(stream);
  useEffect(() => {
    if (videoRef.current && !videoRef.current.srcObject) {
      const video = videoRef.current;
      video.srcObject = stream;
      video.volume = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        width: `${100 / numVideos}%`,
        height: '100%',
        paddingTop: '1rem',
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <video
        className={css`
          &::-webkit-media-controls-volume-control-container {
            display: none;
          }
          &::-webkit-media-controls-volume-slider {
            display: none;
          }
          &::-webkit-media-controls-mute-button {
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
          minWidth: '40%',
          maxWidth: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
        autoPlay
        controls
        ref={videoRef}
      />
    </div>
  );
}
