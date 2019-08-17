import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import SortableListGroup from 'components/SortableListGroup';
import { objectify } from 'helpers';
import { uploadFeaturedPlaylists } from 'helpers/requestHelpers';
import { connect } from 'react-redux';
import { changePinnedPlaylists } from 'redux/actions/VideoActions';
import { isEqual } from 'lodash';

ReorderFeaturedPlaylists.propTypes = {
  dispatch: PropTypes.func.isRequired,
  pinnedPlaylists: PropTypes.array.isRequired,
  playlistIds: PropTypes.array.isRequired,
  onHide: PropTypes.func.isRequired,
  changePinnedPlaylists: PropTypes.func.isRequired
};

function ReorderFeaturedPlaylists({
  changePinnedPlaylists,
  dispatch,
  onHide,
  pinnedPlaylists: playlists,
  playlistIds: initialPlaylistIds
}) {
  const [playlistIds, setPlaylistIds] = useState(initialPlaylistIds);
  const [disabled, setDisabled] = useState(false);
  const listItemObj = objectify(playlists);

  return (
    <Modal onHide={onHide}>
      <header>Reorder Pinned Playlists</header>
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
            isEqual(playlistIds, playlists.map(playlist => playlist.id)) ||
            disabled
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
      dispatch,
      selectedPlaylists: playlistIds
    });
    changePinnedPlaylists(newSelectedPlaylists);
    onHide();
  }
}

export default connect(
  null,
  dispatch => ({
    dispatch,
    changePinnedPlaylists: selectedPlaylists =>
      dispatch(changePinnedPlaylists(selectedPlaylists))
  })
)(ReorderFeaturedPlaylists);
