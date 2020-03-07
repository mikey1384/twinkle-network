import React, { useEffect } from 'react';
import { useChatContext } from 'contexts';
import Video from './Video';

export default function Incoming() {
  const {
    state: { peerStreams },
    actions: { onSetPeerStreams }
  } = useChatContext();

  useEffect(() => {
    return function cleanUp() {
      onSetPeerStreams({});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return Object.keys(peerStreams).map(peerId => (
    <Video key={peerId} stream={peerStreams[peerId]} />
  ));
}
