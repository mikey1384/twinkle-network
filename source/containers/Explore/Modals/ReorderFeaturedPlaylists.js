import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import SortableListGroup from 'components/SortableListGroup';
import { objectify } from 'helpers';
import { isEqual } from 'lodash';
import { useAppContext } from 'contexts';

ReorderFeaturedPlaylists.propTypes = {
  playlistIds: PropTypes.array.isRequired,
  onHide: PropTypes.func.isRequired
};

export default function ReorderFeaturedPlaylists({
  onHide,
  playlistIds: initialPlaylistIds
}) {
  const {
    explore: {
      state: {
        videos: { featuredPlaylists }
      },
      actions: { onChangeFeaturedPlaylists }
    },
    requestHelpers: { uploadFeaturedPlaylists }
  } = useAppContext();
  const [playlistIds, setPlaylistIds] = useState(initialPlaylistIds);
  const [disabled, setDisabled] = useState(false);
  const listItemObj = objectify(featuredPlaylists);

  return (
    <Modal onHide={onHide}>
      <header>Reorder Featured Playlists</header>
      <main>
        <SortableListGroup
          listItemObj={listItemObj}
          onMove={handleMove}
          itemIds={playlistIds}
        />
      </main>
      <footer>
        <Button transparent style={{ marginRight: '0.7rem' }} onClick={onHide}>
          Cancel
        </Button>
        <Button
          disabled={
            isEqual(
              playlistIds,
              featuredPlaylists.map(playlist => playlist.id)
            ) || disabled
          }
          color="blue"
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
    setDisabled(true);
    const newSelectedPlaylists = await uploadFeaturedPlaylists({
      selectedPlaylists: playlistIds
    });
    onChangeFeaturedPlaylists(newSelectedPlaylists);
    onHide();
  }
}
