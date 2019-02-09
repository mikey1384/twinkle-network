import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Playlist from 'components/Playlist';
import Link from 'components/Link';

export default class PlaylistModal extends Component {
  static propTypes = {
    onHide: PropTypes.func.isRequired,
    onLinkClick: PropTypes.func,
    playlistId: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired
  };

  render() {
    const { onHide, onLinkClick, playlistId, title } = this.props;
    return (
      <Modal onHide={onHide}>
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
      </Modal>
    );
  }
}
