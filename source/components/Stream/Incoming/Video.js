import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

Video.propTypes = {
  stream: PropTypes.object.isRequired
};

export default function Video({ stream }) {
  const videoRef = useRef(stream);
  useEffect(() => {
    if (videoRef.current && !videoRef.current.srcObject) {
      videoRef.current.srcObject = stream;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    return function cleanUp() {
      video.srcObject.getTracks().forEach(track => {
        track.stop();
      });
    };
  }, []);

  return (
    <video
      autoPlay
      style={{ display: 'none', height: 0, width: 0 }}
      ref={videoRef}
    />
  );
}
