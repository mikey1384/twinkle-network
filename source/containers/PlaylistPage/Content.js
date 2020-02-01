import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Playlist from 'components/Playlist';

Content.propTypes = {
  match: PropTypes.object.isRequired
};

export default function Content({
  match: {
    params: { contentId }
  }
}) {
  const [background, setBackground] = useState();
  const [title, setTitle] = useState('');
  return (
    <div
      style={{
        background,
        padding: '1rem'
      }}
    >
      {title && <p style={{ fontSize: '3rem', fontWeight: 'bold' }}>{title}</p>}
      <div style={{ marginTop: '1rem' }}>
        <Playlist
          playlistId={Number(contentId)}
          onLoad={({ exists, title }) => {
            setTitle(title);
            setBackground(exists ? '#fff' : null);
          }}
        />
      </div>
    </div>
  );
}
