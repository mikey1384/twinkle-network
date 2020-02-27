import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Peer from 'simple-peer';
import Incoming from './Incoming';
import Outgoing from './Outgoing';
import { useMyState } from 'helpers/hooks';
import { socket } from 'constants/io';

VideoCall.propTypes = {
  channelId: PropTypes.number.isRequired
};

export default function VideoCall({ channelId }) {
  const { userId } = useMyState();
  const videoRef = useRef(null);
  const peerRef = useRef({});
  const streamRef = useRef(null);

  useEffect(() => {
    socket.on('answer_signal_received', onSignal);
    function onSignal(data) {
      const peerId = data.from;
      if (peerId !== userId) {
        console.log(data.signal);
        peerRef.current.signal(data.signal);
      }
    }
    return function cleanUp() {
      socket.removeListener('answer_signal_received', onSignal);
    };
  });

  return (
    <div
      style={{
        width: '50rem',
        height: '30rem',
        position: 'fixed',
        left: '1rem',
        top: '7rem',
        zIndex: 1000
      }}
    >
      <Outgoing
        innerRef={videoRef}
        onSetStream={stream => (streamRef.current = stream)}
      />
      <Incoming channelId={channelId} />
      <Button filled color="blue" onClick={handleStart}>
        Start
      </Button>
      <Button
        filled
        color="green"
        onClick={() => {
          videoRef.current.srcObject.getTracks().forEach(track => {
            console.log(track);
            track.stop();
          });
        }}
      >
        Stop Camera
      </Button>
    </div>
  );

  function handleStart() {
    peerRef.current = new Peer({
      initiator: true,
      stream: streamRef.current
    });

    peerRef.current.on('signal', signal => {
      socket.emit('send_call_signal', {
        from: userId,
        signal,
        channelId
      });
    });
  }
}
