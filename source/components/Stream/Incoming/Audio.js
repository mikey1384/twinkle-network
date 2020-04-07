import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

Audio.propTypes = {
  stream: PropTypes.object.isRequired
};

export default function Audio({ stream }) {
  const audioRef = useRef(stream);
  useEffect(() => {
    const currentAudio = audioRef.current;
    if (audioRef.current && !audioRef.current.srcObject) {
      audioRef.current.srcObject = stream;
    }

    return function cleanUp() {
      currentAudio.srcObject?.getTracks()?.forEach((track) => {
        track.stop();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <audio
      autoPlay
      style={{ display: 'none', height: 0, width: 0 }}
      ref={audioRef}
    />
  );
}
