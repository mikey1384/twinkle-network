import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

Outgoing.propTypes = {
  innerRef: PropTypes.object.isRequired,
  onSetStream: PropTypes.func.isRequired
};

export default function Outgoing({ innerRef, onSetStream }) {
  useEffect(() => {
    const videoRef = innerRef.current;
    init();
    async function init() {
      const options = { video: true, audio: true };
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia(options);
        console.log('setting my stream', stream, innerRef.current);
        videoRef.srcObject = stream;
        videoRef.volume = 0;
        onSetStream(stream);
      }
    }
    return function cleanUp() {
      videoRef.srcObject.getTracks().forEach(track => {
        track.stop();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <video autoPlay style={{ width: '100%' }} ref={innerRef}></video>;
}
