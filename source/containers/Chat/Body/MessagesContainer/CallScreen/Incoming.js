import React, { useEffect, useRef } from 'react';
import { useChatContext } from 'contexts';

export default function Incoming() {
  const {
    state: { currentPeerId, peerStream }
  } = useChatContext();
  const peerVideoRef = useRef(null);
  const streaming = useRef(false);

  useEffect(() => {
    if (peerStream && !streaming.current) {
      peerVideoRef.current.srcObject = peerStream;
      streaming.current = true;
    }
  }, [currentPeerId, peerStream]);

  return (
    <video autoPlay style={{ width: '100%' }} ref={peerVideoRef} controls />
  );
}
