import React, { useEffect, useRef } from 'react';
import { useChatContext } from 'contexts';

export default function Incoming() {
  const {
    state: { currentPeerId, peerStream }
  } = useChatContext();
  const peerVideoRef = useRef(null);
  const streaming = useRef(false);

  useEffect(() => {
    const videoRef = peerVideoRef.current;
    if (videoRef && peerStream && !streaming.current && !videoRef.srcObject) {
      videoRef.srcObject = peerStream;
      streaming.current = true;
    }
  }, [currentPeerId, peerStream]);

  return (
    <video
      autoPlay
      style={{
        position: 'absolute',
        width: '40%',
        top: '1.5rem',
        left: '30%'
      }}
      ref={peerVideoRef}
      controls
    />
  );
}
