import React, { useEffect, useRef, useMemo } from 'react';
import PlaylistsPanel from './PlaylistsPanel';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import ButtonGroup from 'components/Buttons/ButtonGroup';
import SelectPlaylistsToPinModal from '../Modals/SelectPlaylistsToPinModal';
import ReorderFeaturedPlaylists from '../Modals/ReorderFeaturedPlaylists';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useExploreContext } from 'contexts';

export default function FeaturedPlaylistsPanel() {
  const {
    requestHelpers: { loadFeaturedPlaylists, loadPlaylistList }
  } = useAppContext();
  const { canPinPlaylists, userId } = useMyState();
  const {
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
  } = useExploreContext();
  const prevLoaded = useRef(false);
  useEffect(() => {
    if (!featuredPlaylistsLoaded) {
      init();
    }
    async function init() {
      const playlists = await loadFeaturedPlaylists();
      onLoadFeaturedPlaylists(playlists);
      prevLoaded.current = true;
    }
  }, [featuredPlaylistsLoaded]);
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

  return useMemo(
    () => (
      <ErrorBoundary>
        <PlaylistsPanel
          buttonGroupShown={!!canPinPlaylists}
          buttonGroup={() => (
            <ButtonGroup style={{ marginLeft: 'auto' }} buttons={menuButtons} />
          )}
          title="Featured Playlists"
          userId={userId}
          playlists={featuredPlaylists}
          loaded={featuredPlaylistsLoaded || prevLoaded.current}
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
    ),
    [
      featuredPlaylists,
      loadMorePlaylistsToPinButton,
      menuButtons,
      featuredPlaylistsLoaded,
      playlistsToPin,
      reorderFeaturedPlaylistsShown,
      selectPlaylistsToFeatureModalShown
    ]
  );

  async function handleOpenSelectPlaylistsToPinModal() {
    const data = await loadPlaylistList();
    onOpenSelectPlaylistsToPinModal(data);
  }
}
