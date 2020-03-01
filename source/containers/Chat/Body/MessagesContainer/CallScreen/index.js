import React, { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import Peer from 'simple-peer';
import Incoming from './Incoming';
import Outgoing from './Outgoing';
import Icon from 'components/Icon';
import Button from 'components/Button';
import { useChatContext } from 'contexts';
import { useMyState } from 'helpers/hooks';
import { socket } from 'constants/io';

CallScreen.propTypes = {
  channelOnCall: PropTypes.object.isRequired,
  style: PropTypes.object
};

export default function CallScreen({ channelOnCall, style }) {
  const {
    state: { myStream },
    actions: { onSetPeerStream, onShowIncoming }
  } = useChatContext();
  const { userId } = useMyState();
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
    socket.on('answer_signal_received', handleSignal);
    function handleSignal(data) {
      const peerId = data.from;
      if (peerId !== userId) {
        try {
          peerRef.current.signal(data.signal);
        } catch (error) {
          console.error(error);
        }
      }
    }
    return function cleanUp() {
      socket.removeListener('answer_signal_received', handleSignal);
    };
  });

  useEffect(() => {
    if (userId === channelOnCall.callerId && myStream && !streamRef.current) {
      streamRef.current = myStream;
      try {
        peerRef.current = new Peer({
          config: {
            iceServers: [
              {
                urls: 'turn:18.177.176.36:3478?transport=udp',
                username: 'test',
                credential: 'test'
              }
            ]
          },
          initiator: true,
          stream: myStream
        });
        socket.emit('send_peer', {
          peerId: userId,
          channelId: channelOnCall.id
        });
        peerRef.current.on('signal', signal => {
          socket.emit('send_call_signal', {
            peerId: userId,
            signal,
            channelId: channelOnCall.id
          });
        });
        peerRef.current.on('stream', stream => {
          onShowIncoming();
          onSetPeerStream(stream);
        });
      } catch (error) {
        console.error(error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelOnCall.callerId, channelOnCall.id, myStream, userId]);

  return (
    <div style={{ width: '100%', position: 'relative', ...style }}>
      {isMakingCall && !channelOnCall.incomingShown && (
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
      {isReceivingCall && !channelOnCall.incomingShown && (
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
              onClick={() => onShowIncoming()}
            >
              Answer
            </span>
          </Button>
        </div>
      )}
      {channelOnCall.incomingShown && <Incoming />}
      {(isMakingCall || channelOnCall.incomingShown) && (
        <Outgoing innerRef={videoRef} />
      )}
    </div>
  );
}
