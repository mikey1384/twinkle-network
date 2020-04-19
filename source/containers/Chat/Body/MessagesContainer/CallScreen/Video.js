import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { useChatContext } from 'contexts';
import { useMyState } from 'helpers/hooks';

Video.propTypes = {
  stream: PropTypes.object.isRequired,
  userId: PropTypes.number.isRequired
};

export default function Video({ stream, userId }) {
  const { userId: myId } = useMyState();
  const videoRef = useRef(stream);
  const {
    state: { callMuted },
    actions: { onChangeMuted }
  } = useChatContext();
  useEffect(() => {
    const video = videoRef.current;
    if (videoRef.current && !videoRef.current.srcObject) {
      const clonedStream = stream.clone();
      video.srcObject = clonedStream;
      video.muted = callMuted || userId === myId;
      video.onvolumechange = (event) => {
        onChangeMuted(event.target.muted);
      };
    }
    return function cleanUp() {
      video.srcObject?.getTracks()?.forEach((track) => {
        track.stop();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        width: '50%',
        height: '100%',
        paddingTop: '1rem',
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <video
        className={css`
          &::-webkit-media-controls-volume-slider {
            display: none;
          }
          &::-webkit-media-controls-play-button {
            display: none;
          }
          &::-webkit-media-controls-timeline {
            display: none;
          }
        `}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
        autoPlay
        playsInline
        controls
        ref={videoRef}
      />
    </div>
  );
}
