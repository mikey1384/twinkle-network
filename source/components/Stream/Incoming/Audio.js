import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useChatContext } from 'contexts';

Audio.propTypes = {
  stream: PropTypes.object.isRequired
};

export default function Audio({ stream }) {
  const { pathname } = useLocation();
  const audioRef = useRef(stream);
  const {
    state: { callMuted },
    state: { channelOnCall, selectedChannelId }
  } = useChatContext();
  useEffect(() => {
    const currentAudio = audioRef.current;
    if (audioRef.current && !audioRef.current.srcObject) {
      const clonedStream = stream.clone();
      audioRef.current.srcObject = clonedStream;
    }

    return function cleanUp() {
      currentAudio.srcObject?.getTracks()?.forEach((track) => {
        track.stop();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pathname === '/chat' && channelOnCall.id === selectedChannelId) {
      audioRef.current.muted = true;
    } else {
      audioRef.current.muted = callMuted;
    }
  }, [callMuted, channelOnCall.id, pathname, selectedChannelId]);

  return (
    <audio
      autoPlay
      style={{ display: 'none', height: 0, width: 0 }}
      ref={audioRef}
    />
  );
}
