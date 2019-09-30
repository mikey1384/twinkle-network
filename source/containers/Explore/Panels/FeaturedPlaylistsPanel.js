import React, { useEffect } from 'react';
import PlaylistsPanel from './PlaylistsPanel';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import ButtonGroup from 'components/Buttons/ButtonGroup';
import SelectPlaylistsToPinModal from '../Modals/SelectPlaylistsToPinModal';
import ReorderFeaturedPlaylists from '../Modals/ReorderFeaturedPlaylists';
import { useAppContext } from 'contexts';

export default function FeaturedPlaylistsPanel() {
  const {
    explore: {
      state: {
        videos: {
          featuredPlaylists,
          loadMorePlaylistsToPinButton,
          featuredPlaylistsLoaded,
          playlistsToPin,
          reorderFeaturedPlaylistsShown,
          selectPlaylistsToFeatureModalShown
        }
      },
      actions: {
        onCloseReorderFeaturedPlaylists,
        onCloseSelectPlaylistsToPinModal,
        onLoadFeaturedPlaylists,
        onOpenReorderFeaturedPlaylists,
        onOpenSelectPlaylistsToPinModal
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
      onLoadFeaturedPlaylists(playlists);
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
      onClick: onOpenReorderFeaturedPlaylists,
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
        loaded={featuredPlaylistsLoaded}
      />
      {selectPlaylistsToFeatureModalShown && (
        <SelectPlaylistsToPinModal
          playlistsToPin={playlistsToPin}
          selectedPlaylists={featuredPlaylists.map(playlist => {
            return playlist.id;
          })}
          loadMoreButton={loadMorePlaylistsToPinButton}
          onHide={onCloseSelectPlaylistsToPinModal}
        />
      )}
      {reorderFeaturedPlaylistsShown && (
        <ReorderFeaturedPlaylists
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
