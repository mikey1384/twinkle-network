import React, { useEffect, useMemo, useRef } from 'react';
import PlaylistsPanel from './PlaylistsPanel';
import ErrorBoundary from 'components/ErrorBoundary';
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
        featuredPlaylistsLoaded,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featuredPlaylistsLoaded]);

  const menuButtons = useMemo(() => {
    const buttons = [
      {
        label: 'Select Playlists',
        onClick: handleOpenSelectPlaylistsToPinModal,
        skeuomorphic: true,
        color: 'darkerGray'
      }
    ];
    if (featuredPlaylists.length > 0) {
      buttons.push({
        label: 'Reorder Playlists',
        onClick: onOpenReorderFeaturedPlaylists,
        skeuomorphic: true,
        color: 'darkerGray'
      });
    }
    return buttons;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featuredPlaylists.length]);

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
        loaded={featuredPlaylistsLoaded || prevLoaded.current}
      />
      {selectPlaylistsToFeatureModalShown && (
        <SelectPlaylistsToPinModal
          selectedPlaylists={featuredPlaylists.map(playlist => {
            return playlist.id;
          })}
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
