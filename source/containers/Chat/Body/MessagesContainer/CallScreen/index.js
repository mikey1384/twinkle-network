import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Peer from 'simple-peer';
import Incoming from './Incoming';
import Outgoing from './Outgoing';
import Icon from 'components/Icon';
import Button from 'components/Button';
import { useMyState } from 'helpers/hooks';
import { socket } from 'constants/io';

CallScreen.propTypes = {
  channelOnCall: PropTypes.object.isRequired,
  style: PropTypes.object
};

export default function CallScreen({ channelOnCall, style }) {
  const { userId } = useMyState();
  const [incomingShown, setIncomingShown] = useState(false);
  const [stream, setStream] = useState(null);
  const isMakingCall = useMemo(() => {
    return channelOnCall.callerId && channelOnCall.callerId === userId;
  }, [channelOnCall, userId]);
  const isReceivingCall = useMemo(() => {
    return channelOnCall.callerId && channelOnCall.callerId !== userId;
  }, [channelOnCall, userId]);
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

  useEffect(() => {
    console.log(stream);
    if (userId === channelOnCall.callerId && stream && !streamRef.current) {
      peerRef.current = new Peer({
        config: {
          iceServers: [
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:stun3.l.google.com:19302' },
            { urls: 'stun:stun4.l.google.com:19302' },
            { urls: 'stun:stun.stunprotocol.org:3478' },
            { urls: 'stun:global.stun.twilio.com:3478?transport=udp' }
          ]
        },
        initiator: true,
        stream,
        enableTrickle: true
      });
      peerRef.current.on('signal', signal => {
        socket.emit('send_call_signal', {
          from: userId,
          signal,
          channelId: channelOnCall.id
        });
      });
    }
    streamRef.current = stream;
  }, [channelOnCall.callerId, channelOnCall.id, stream, userId]);

  return (
    <div style={{ width: '100%', ...style }}>
      {isReceivingCall && !incomingShown && (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Button filled color="green">
            <Icon icon="phone-volume" />
            <span
              style={{ marginLeft: '1rem' }}
              onClick={() => setIncomingShown(true)}
            >
              Answer
            </span>
          </Button>
        </div>
      )}
      {incomingShown && <Incoming />}
      {isMakingCall && <Outgoing innerRef={videoRef} onSetStream={setStream} />}
    </div>
  );
}
