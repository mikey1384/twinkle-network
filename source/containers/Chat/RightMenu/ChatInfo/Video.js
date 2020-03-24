import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

Video.propTypes = {
  myVideoRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
};

export default function Video({ myVideoRef }) {
  useEffect(() => {
    const video = myVideoRef.current;
    return function cleanUp() {
      video.srcObject.getVideoTracks()[0].stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <video
      style={{
        width: '100%',
        maxHeight: '20rem'
      }}
      autoPlay
      playsInline
      ref={myVideoRef}
    />
  );
}
