import React, { useEffect } from 'react';
import { useChatContext } from 'contexts';
import Audio from './Audio';

export default function Incoming() {
  const {
    state: { channelOnCall, peerStreams },
    actions: { onSetPeerStreams }
  } = useChatContext();

  useEffect(() => {
    return function cleanUp() {
      onSetPeerStreams({});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return Object.entries(peerStreams)
    .filter(([peerId]) => !channelOnCall?.members[peerId]?.streamHidden)
    .map(([peerId, stream]) => <Audio key={peerId} stream={stream} />);
}
