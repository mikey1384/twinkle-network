import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

YouTubeSubscribe.propTypes = {
  channelName: PropTypes.string,
  channelCode: PropTypes.string.isRequired,
  theme: PropTypes.string,
  layout: PropTypes.string,
  count: PropTypes.string
};

export default function YouTubeSubscribe({
  channelName = '',
  channelCode = 'UCaYhcUwRBNscFNUKTjgPFiA',
  theme = 'full',
  layout = 'default',
  count = 'default'
}) {
  const YouTubeSubscribeRef = useRef(null);
  const initialized = useRef(false);
  useEffect(() => {
    if (initialized.current) {
      return;
    }

    const youtubescript = document.createElement('script');
    youtubescript.src = 'https://apis.google.com/js/platform.js';
    YouTubeSubscribeRef.current.parentNode.appendChild(youtubescript);
    initialized.current = true;
  }, []);

  return (
    <section className="youtubeSubscribe">
      <div
        ref={YouTubeSubscribeRef}
        className="g-ytsubscribe"
        data-theme={theme}
        data-layout={layout}
        data-count={count}
        data-channel={channelName}
        data-channelid={channelCode}
      />
    </section>
  );
}
