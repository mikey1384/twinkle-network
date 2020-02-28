import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Peer from 'simple-peer';
import Outgoing from './Outgoing';
import { useMyState } from 'helpers/hooks';
import { socket } from 'constants/io';

CallScreen.propTypes = {
  channelId: PropTypes.number.isRequired,
  style: PropTypes.object
};

export default function CallScreen({ channelId, style }) {
  const { userId } = useMyState();
  const [callConnected, setCallConnected] = useState(false);
  const videoRef = useRef(null);
  const peerRef = useRef({});
  const streamRef = useRef(null);

  useEffect(() => {
    socket.on('answer_signal_received', onSignal);
    function onSignal(data) {
      const peerId = data.from;
      if (peerId !== userId) {
        console.log(data.signal);
        setCallConnected(true);
        peerRef.current.signal(data.signal);
      }
    }
    return function cleanUp() {
      socket.removeListener('answer_signal_received', onSignal);
    };
  });

  useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ width: '100%', ...style }}>
      {!callConnected && (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          Calling...
        </div>
      )}
      {callConnected && (
        <Outgoing
          innerRef={videoRef}
          onSetStream={stream => (streamRef.current = stream)}
        />
      )}
    </div>
  );
}
