import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import PlaylistsPanel from './Panels/PlaylistsPanel';
import ButtonGroup from 'components/Buttons/ButtonGroup';
import SelectPlaylistsToPinModal from './Modals/SelectPlaylistsToPinModal';
import ReorderPinnedPlaylistsModal from './Modals/ReorderPinnedPlaylistsModal';
import { connect } from 'react-redux';
import {
  closeReorderPinnedPlaylistsModal,
  closeSelectPlaylistsToPinModal,
  getPinnedPlaylists,
  openReorderPinnedPlaylistsModal,
  openSelectPlaylistsToPinModal
} from 'redux/actions/VideoActions';

Work.propTypes = {
  canPinPlaylists: PropTypes.bool,
  closeReorderPinnedPlaylistsModal: PropTypes.func.isRequired,
  closeSelectPlaylistsToPinModal: PropTypes.func.isRequired,
  getPinnedPlaylists: PropTypes.func.isRequired,
  loadMorePlaylistsToPinButton: PropTypes.bool.isRequired,
  openReorderPinnedPlaylistsModal: PropTypes.func.isRequired,
  openSelectPlaylistsToPinModal: PropTypes.func.isRequired,
  playlists: PropTypes.array.isRequired,
  playlistsLoaded: PropTypes.bool.isRequired,
  playlistsToPin: PropTypes.array.isRequired,
  reorderPinnedPlaylistsModalShown: PropTypes.bool.isRequired,
  selectPlaylistsToPinModalShown: PropTypes.bool.isRequired,
  userId: PropTypes.number
};

function Work({
  canPinPlaylists,
  closeReorderPinnedPlaylistsModal,
  closeSelectPlaylistsToPinModal,
  getPinnedPlaylists,
  loadMorePlaylistsToPinButton,
  openReorderPinnedPlaylistsModal,
  openSelectPlaylistsToPinModal,
  playlists,
  playlistsLoaded,
  playlistsToPin,
  reorderPinnedPlaylistsModalShown,
  selectPlaylistsToPinModalShown,
  userId
}) {
  useEffect(() => {
    getPinnedPlaylists();
  }, []);

  const pinnedPlaylistButtons =
    playlists.length > 0
      ? [
          {
            label: 'Select Playlists',
            onClick: openSelectPlaylistsToPinModal,
            buttonClass: 'snow'
          },
          {
            label: 'Reorder Playlists',
            onClick: openReorderPinnedPlaylistsModal,
            buttonClass: 'snow'
          }
        ]
      : [
          {
            label: 'Select Playlists',
            onClick: openSelectPlaylistsToPinModal,
            buttonClass: 'snow'
          }
        ];
  return (
    <div>
      <PlaylistsPanel
        key={'pinnedPlaylists'}
        buttonGroupShown={!!canPinPlaylists}
        buttonGroup={() => (
          <ButtonGroup
            style={{ marginLeft: 'auto' }}
            buttons={pinnedPlaylistButtons}
          />
        )}
        title="Featured Playlists"
        userId={userId}
        playlists={playlists}
        loaded={playlistsLoaded}
      />
      {selectPlaylistsToPinModalShown && (
        <SelectPlaylistsToPinModal
          playlistsToPin={playlistsToPin}
          pinnedPlaylists={playlists}
          selectedPlaylists={playlists.map(playlist => {
            return playlist.id;
          })}
          loadMoreButton={loadMorePlaylistsToPinButton}
          onHide={closeSelectPlaylistsToPinModal}
        />
      )}
      {reorderPinnedPlaylistsModalShown && (
        <ReorderPinnedPlaylistsModal
          pinnedPlaylists={playlists}
          playlistIds={playlists.map(playlist => {
            return playlist.id;
          })}
          onHide={closeReorderPinnedPlaylistsModal}
        />
      )}
    </div>
  );
}

export default connect(
  state => ({
    canPinPlaylists: state.UserReducer.canPinPlaylists,
    loadMorePlaylistsToPinButton:
      state.VideoReducer.loadMorePlaylistsToPinButton,
    playlists: state.VideoReducer.pinnedPlaylists,
    playlistsLoaded: state.VideoReducer.pinnedPlaylistsLoaded,
    playlistsToPin: state.VideoReducer.playlistsToPin,
    reorderPinnedPlaylistsModalShown:
      state.VideoReducer.reorderPinnedPlaylistsModalShown,
    selectPlaylistsToPinModalShown:
      state.VideoReducer.selectPlaylistsToPinModalShown,
    userId: state.UserReducer.userId
  }),
  {
    closeReorderPinnedPlaylistsModal,
    closeSelectPlaylistsToPinModal,
    getPinnedPlaylists,
    openReorderPinnedPlaylistsModal,
    openSelectPlaylistsToPinModal
  }
)(Work);
