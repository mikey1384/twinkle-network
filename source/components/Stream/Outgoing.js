import React, { useEffect, useRef } from 'react';
import { useChatContext } from 'contexts';

export default function Outgoing() {
  const videoRef = useRef(null);
  const {
    actions: { onSetMyStream }
  } = useChatContext();
  useEffect(() => {
    const currentVideo = videoRef.current;
    init();
    async function init() {
      const options = { video: true, audio: true };
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia(options);
        currentVideo.srcObject = stream;
        currentVideo.volume = 0;
        onSetMyStream(stream);
      }
    }
    return function cleanUp() {
      onSetMyStream(null);
      currentVideo.srcObject.getTracks().forEach(track => {
        track.stop();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <video
      autoPlay
      style={{ position: 'absolute', bottom: 0, right: 0, width: '25%' }}
      ref={videoRef}
    ></video>
  );
}
