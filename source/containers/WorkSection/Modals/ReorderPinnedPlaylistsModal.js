import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import SortableListGroup from 'components/SortableListGroup';
import { connect } from 'react-redux';
import { changePinnedPlaylists } from 'redux/actions/VideoActions';
import { isEqual } from 'lodash';

ReorderPinnedPlaylistsModal.propTypes = {
  pinnedPlaylists: PropTypes.array.isRequired,
  playlistIds: PropTypes.array.isRequired,
  onHide: PropTypes.func.isRequired,
  changePinnedPlaylists: PropTypes.func.isRequired
};

function ReorderPinnedPlaylistsModal({
  changePinnedPlaylists,
  onHide,
  pinnedPlaylists: playlists,
  playlistIds: initialPlaylistIds
}) {
  const [playlistIds, setPlaylistIds] = useState(initialPlaylistIds);
  const listItems = playlistIds.reduce((result, playlistId) => {
    for (let i = 0; i < playlists.length; i++) {
      if (playlists[i].id === playlistId) {
        result.push({
          label: playlists[i].title,
          id: playlistId
        });
      }
    }
    return result;
  }, []);

  return (
    <Modal onHide={onHide}>
      <header>Reorder Pinned Playlists</header>
      <main>
        <SortableListGroup listItems={listItems} onMove={handleMove} />
      </main>
      <footer>
        <Button transparent style={{ marginRight: '0.7rem' }} onClick={onHide}>
          Cancel
        </Button>
        <Button
          disabled={isEqual(
            playlistIds,
            playlists.map(playlist => playlist.id)
          )}
          primary
          onClick={handleSubmit}
        >
          Done
        </Button>
      </footer>
    </Modal>
  );

  function handleMove({ sourceId, targetId }) {
    const sourceIndex = playlistIds.indexOf(sourceId);
    const targetIndex = playlistIds.indexOf(targetId);
    const newPlaylistIds = [...playlistIds];
    newPlaylistIds.splice(sourceIndex, 1);
    newPlaylistIds.splice(targetIndex, 0, sourceId);
    setPlaylistIds(newPlaylistIds);
  }

  async function handleSubmit() {
    await changePinnedPlaylists(playlistIds);
    onHide();
  }
}

export default connect(
  null,
  { changePinnedPlaylists }
)(ReorderPinnedPlaylistsModal);
