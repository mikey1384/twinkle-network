import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useChatContext } from 'contexts';

Outgoing.propTypes = {
  innerRef: PropTypes.object.isRequired
};

export default function Outgoing({ innerRef }) {
  const {
    actions: { onSetMyStream }
  } = useChatContext();
  useEffect(() => {
    const videoRef = innerRef.current;
    init();
    async function init() {
      const options = { video: true, audio: true };
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia(options);
        videoRef.srcObject = stream;
        videoRef.volume = 0;
        onSetMyStream(stream);
      }
    }
    return function cleanUp() {
      onSetMyStream(null);
      videoRef.srcObject.getTracks().forEach(track => {
        track.stop();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <video
      autoPlay
      style={{ position: 'absolute', bottom: 0, right: 0, width: '25%' }}
      ref={innerRef}
    ></video>
  );
}
