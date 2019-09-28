import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import PlaylistsPanel from './PlaylistsPanel';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import ButtonGroup from 'components/Buttons/ButtonGroup';
import SelectPlaylistsToPinModal from '../Modals/SelectPlaylistsToPinModal';
import ReorderFeaturedPlaylists from '../Modals/ReorderFeaturedPlaylists';
import { connect } from 'react-redux';
import {
  openReorderFeaturedPlaylists,
  onOpenSelectPlaylistsToPinModal
} from 'redux/actions/VideoActions';
import { useAppContext } from 'context';

FeaturedPlaylistsPanel.propTypes = {
  featuredPlaylists: PropTypes.array.isRequired,
  loadMorePlaylistsToPinButton: PropTypes.bool.isRequired,
  openReorderFeaturedPlaylists: PropTypes.func.isRequired,
  onOpenSelectPlaylistsToPinModal: PropTypes.func.isRequired,
  playlistsLoaded: PropTypes.bool.isRequired,
  playlistsToPin: PropTypes.array.isRequired,
  reorderFeaturedPlaylistsShown: PropTypes.bool.isRequired,
  selectPlaylistsToPinModalShown: PropTypes.bool.isRequired
};

function FeaturedPlaylistsPanel({
  featuredPlaylists,
  loadMorePlaylistsToPinButton,
  openReorderFeaturedPlaylists,
  onOpenSelectPlaylistsToPinModal,
  playlistsLoaded,
  playlistsToPin,
  reorderFeaturedPlaylistsShown,
  selectPlaylistsToPinModalShown
}) {
  const {
    explore: {
      actions: {
        onCloseReorderFeaturedPlaylists,
        onCloseSelectPlaylistsToPinModal,
        onGetPinnedPlaylists
      }
    },
    user: {
      state: { canPinPlaylists, userId }
    },
    requestHelpers: { loadFeaturedPlaylists, loadPlaylistList }
  } = useAppContext();
  useEffect(() => {
    init();
    async function init() {
      const playlists = await loadFeaturedPlaylists();
      onGetPinnedPlaylists(playlists);
    }
  }, []);
  const menuButtons = [
    {
      label: 'Select Playlists',
      onClick: handleOpenSelectPlaylistsToPinModal,
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
          onHide={onCloseSelectPlaylistsToPinModal}
        />
      )}
      {reorderFeaturedPlaylistsShown && (
        <ReorderFeaturedPlaylists
          pinnedPlaylists={featuredPlaylists}
          playlistIds={featuredPlaylists.map(playlist => playlist.id)}
          onHide={onCloseReorderFeaturedPlaylists}
        />
      )}
    </ErrorBoundary>
  );

  async function handleOpenSelectPlaylistsToPinModal() {
    const data = await loadPlaylistList();
    onOpenSelectPlaylistsToPinModal(data);
  }
}

export default connect(
  state => ({
    loadMorePlaylistsToPinButton:
      state.VideoReducer.loadMorePlaylistsToPinButton,
    featuredPlaylists: state.VideoReducer.pinnedPlaylists,
    playlistsLoaded: state.VideoReducer.pinnedPlaylistsLoaded,
    playlistsToPin: state.VideoReducer.playlistsToPin,
    reorderFeaturedPlaylistsShown:
      state.VideoReducer.reorderFeaturedPlaylistsShown,
    selectPlaylistsToPinModalShown:
      state.VideoReducer.selectPlaylistsToPinModalShown
  }),
  {
    openReorderFeaturedPlaylists,
    onOpenSelectPlaylistsToPinModal
  }
)(FeaturedPlaylistsPanel);
