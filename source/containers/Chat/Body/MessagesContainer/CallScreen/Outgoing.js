import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

Outgoing.propTypes = {
  innerRef: PropTypes.object.isRequired,
  onSetStream: PropTypes.func.isRequired
};

export default function Outgoing({ innerRef, onSetStream }) {
  useEffect(() => {
    init();
    async function init() {
      const options = { video: true, audio: false };
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia(options);
        console.log('setting my stream', stream, innerRef.current);
        innerRef.current.srcObject = stream;
        onSetStream(stream);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <video style={{ width: '100%' }} ref={innerRef} controls></video>;
}
