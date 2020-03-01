import React, { useEffect, useRef } from 'react';
import { useChatContext } from 'contexts';

export default function Incoming() {
  const {
    state: { currentPeerId, peerStream },
    actions: { onSetPeerStream }
  } = useChatContext();
  const peerVideoRef = useRef(null);
  const streaming = useRef(false);

  useEffect(() => {
    const videoRef = peerVideoRef.current;
    if (videoRef && peerStream && !streaming.current && !videoRef.srcObject) {
      console.log('streaming from peer', videoRef.srcObject, peerStream);
      videoRef.srcObject = peerStream;
      streaming.current = true;
    }
  }, [currentPeerId, peerStream]);

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
