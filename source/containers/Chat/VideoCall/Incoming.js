import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Peer from 'simple-peer';
import { useMyState } from 'helpers/hooks';
import { socket } from 'constants/io';

Incoming.propTypes = {
  channelId: PropTypes.number.isRequired
};
export default function Incoming({ channelId }) {
  const { userId } = useMyState();
  const [peerStream, setPeerStream] = useState(null);
  const [currentPeerId, setCurrentPeerId] = useState(null);
  const peerRef = useRef({});
  const peerVideoRef = useRef(null);
  const streaming = useRef(false);

  useEffect(() => {
    socket.on('call_signal_received', onSignal);
    function onSignal(data) {
      const peerId = data.from;
      if (!currentPeerId && peerId !== userId) {
        peerRef.current = new Peer({
          initiator: false
        });
        setCurrentPeerId(peerId);
        peerRef.current.signal(data.signal);

        peerRef.current.on('signal', signal => {
          socket.emit('send_answer_signal', {
            from: userId,
            signal,
            channelId
          });
        });

        peerRef.current.on('stream', stream => {
          console.log('Got peer stream!!!');
          setPeerStream(stream);
        });

        peerRef.current.on('error', e => {
          console.log('Peer error %s:', peerId, e);
        });
      }
    }
    return function cleanUp() {
      socket.removeListener('call_signal_received', onSignal);
    };
  });

  useEffect(() => {
    if (peerStream && !streaming.current) {
      peerVideoRef.current.srcObject = peerStream;
      streaming.current = true;
    }
  }, [currentPeerId, peerStream]);

  return <video style={{ width: '100%' }} ref={peerVideoRef} controls />;
}
