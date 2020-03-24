import React, { useEffect, useRef } from 'react';
import { useChatContext } from 'contexts';

export default function Outgoing() {
  const videoRef = useRef(null);
  const mounted = useRef(true);
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
        if (mounted.current) {
          currentVideo.srcObject = stream;
          currentVideo.volume = 0;
          onSetMyStream(stream);
        }
      }
    }

    return function cleanUp() {
      mounted.current = false;
      onSetMyStream(null);
      currentVideo.srcObject?.getTracks()?.forEach(track => {
        track.stop();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <video
      autoPlay
      style={{ display: 'none', height: 0, width: 0 }}
      ref={videoRef}
    />
  );
}
