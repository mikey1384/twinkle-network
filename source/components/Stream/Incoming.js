import React, { useEffect, useRef } from 'react';
import { useChatContext } from 'contexts';

export default function Incoming() {
  const {
    state: { peerStream },
    actions: { onSetPeerStream }
  } = useChatContext();
  const peerVideoRef = useRef(null);
  const streaming = useRef(false);

  useEffect(() => {
    const videoRef = peerVideoRef.current;
    if (videoRef && peerStream && !streaming.current && !videoRef.srcObject) {
      videoRef.srcObject = peerStream;
      streaming.current = true;
    }
  }, [peerStream]);

  useEffect(() => {
    const videoRef = peerVideoRef.current;
    return function cleanUp() {
      onSetPeerStream(null);
      videoRef.srcObject.getTracks().forEach(track => {
        track.stop();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <video
      autoPlay
      style={{ display: 'none', height: 0, width: 0 }}
      ref={peerVideoRef}
    />
  );
}
