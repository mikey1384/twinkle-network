import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Playlist from 'components/Playlist';
import Link from 'components/Link';
import ErrorBoundary from 'components/ErrorBoundary';

PlaylistModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  onLinkClick: PropTypes.func,
  playlistId: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired
};

export default function PlaylistModal({
  onHide,
  onLinkClick,
  playlistId,
  title
}) {
  return (
    <Modal onHide={onHide}>
      <ErrorBoundary>
        <header>
          <Link style={{ fontSize: '2.5rem' }} to={`/playlists/${playlistId}`}>
            {title}
          </Link>
        </header>
        <main>
          <Playlist onLinkClick={onLinkClick} playlistId={playlistId} />
        </main>
        <footer>
          <Button transparent onClick={onHide}>
            Close
          </Button>
        </footer>
      </ErrorBoundary>
    </Modal>
  );
}
