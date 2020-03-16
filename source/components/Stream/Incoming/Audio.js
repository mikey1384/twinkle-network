import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

Audio.propTypes = {
  stream: PropTypes.object.isRequired
};

export default function Audio({ stream }) {
  const audioRef = useRef(stream);
  useEffect(() => {
    if (audioRef.current && !audioRef.current.srcObject) {
      audioRef.current.srcObject = stream;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    return function cleanUp() {
      audio.srcObject.getTracks().forEach(track => {
        track.stop();
      });
    };
  }, []);

  return (
    <audio
      autoPlay
      style={{ display: 'none', height: 0, width: 0 }}
      ref={audioRef}
    />
  );
}
