import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import PlaylistsPanel from './PlaylistsPanel';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import ButtonGroup from 'components/Buttons/ButtonGroup';
import SelectPlaylistsToPinModal from '../Modals/SelectPlaylistsToPinModal';
import ReorderFeaturedPlaylists from '../Modals/ReorderFeaturedPlaylists';
import { loadFeaturedPlaylists } from 'helpers/requestHelpers';
import { connect } from 'react-redux';
import {
  closeReorderFeaturedPlaylists,
  closeSelectPlaylistsToPinModal,
  getPinnedPlaylists,
  openReorderFeaturedPlaylists,
  openSelectPlaylistsToPinModal
} from 'redux/actions/VideoActions';

FeaturedPlaylistsPanel.propTypes = {
  canPinPlaylists: PropTypes.bool,
  closeReorderFeaturedPlaylists: PropTypes.func.isRequired,
  closeSelectPlaylistsToPinModal: PropTypes.func.isRequired,
  featuredPlaylists: PropTypes.array.isRequired,
  getPinnedPlaylists: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  loadMorePlaylistsToPinButton: PropTypes.bool.isRequired,
  openReorderFeaturedPlaylists: PropTypes.func.isRequired,
  openSelectPlaylistsToPinModal: PropTypes.func.isRequired,
  playlistsLoaded: PropTypes.bool.isRequired,
  playlistsToPin: PropTypes.array.isRequired,
  reorderFeaturedPlaylistsShown: PropTypes.bool.isRequired,
  selectPlaylistsToPinModalShown: PropTypes.bool.isRequired,
  userId: PropTypes.number
};

function FeaturedPlaylistsPanel({
  canPinPlaylists,
  closeReorderFeaturedPlaylists,
  closeSelectPlaylistsToPinModal,
  featuredPlaylists,
  getPinnedPlaylists,
  history,
  loadMorePlaylistsToPinButton,
  openReorderFeaturedPlaylists,
  openSelectPlaylistsToPinModal,
  playlistsLoaded,
  playlistsToPin,
  reorderFeaturedPlaylistsShown,
  selectPlaylistsToPinModalShown,
  userId
}) {
  useEffect(() => {
    init();
    async function init() {
      if (history.action === 'PUSH' || !playlistsLoaded) {
        const playlists = await loadFeaturedPlaylists();
        getPinnedPlaylists(playlists);
      }
    }
  }, []);

  const menuButtons = [
    {
      label: 'Select Playlists',
      onClick: openSelectPlaylistsToPinModal,
      skeuomorphic: true,
      color: 'darkerGray'
    }
  ];
  if (featuredPlaylists.length > 0) {
    menuButtons.push({
      label: 'Reorder Playlists',
      onClick: openReorderFeaturedPlaylists,
      skeuomorphic: true,
      color: 'darkerGray'
    });
  }

  return (
    <ErrorBoundary>
      <PlaylistsPanel
        buttonGroupShown={!!canPinPlaylists}
        buttonGroup={() => (
          <ButtonGroup style={{ marginLeft: 'auto' }} buttons={menuButtons} />
        )}
        title="Featured Playlists"
        userId={userId}
        playlists={featuredPlaylists}
        loaded={playlistsLoaded}
      />
      {selectPlaylistsToPinModalShown && (
        <SelectPlaylistsToPinModal
          playlistsToPin={playlistsToPin}
          pinnedPlaylists={featuredPlaylists}
          selectedPlaylists={featuredPlaylists.map(playlist => {
            return playlist.id;
          })}
          loadMoreButton={loadMorePlaylistsToPinButton}
          onHide={closeSelectPlaylistsToPinModal}
        />
      )}
      {reorderFeaturedPlaylistsShown && (
        <ReorderFeaturedPlaylists
          pinnedPlaylists={featuredPlaylists}
          playlistIds={featuredPlaylists.map(playlist => playlist.id)}
          onHide={closeReorderFeaturedPlaylists}
        />
      )}
    </ErrorBoundary>
  );
}

export default connect(
  state => ({
    canPinPlaylists: state.UserReducer.canPinPlaylists,
    loadMorePlaylistsToPinButton:
      state.VideoReducer.loadMorePlaylistsToPinButton,
    featuredPlaylists: state.VideoReducer.pinnedPlaylists,
    playlistsLoaded: state.VideoReducer.pinnedPlaylistsLoaded,
    playlistsToPin: state.VideoReducer.playlistsToPin,
    reorderFeaturedPlaylistsShown:
      state.VideoReducer.reorderFeaturedPlaylistsShown,
    selectPlaylistsToPinModalShown:
      state.VideoReducer.selectPlaylistsToPinModalShown,
    userId: state.UserReducer.userId
  }),
  {
    closeReorderFeaturedPlaylists,
    closeSelectPlaylistsToPinModal,
    getPinnedPlaylists,
    openReorderFeaturedPlaylists,
    openSelectPlaylistsToPinModal
  }
)(FeaturedPlaylistsPanel);
