import React, { useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import ButtonGroup from 'components/Buttons/ButtonGroup';
import FeaturedPlaylistsPanel from './Panels/FeaturedPlaylistsPanel';
import PlaylistsPanel from './Panels/PlaylistsPanel';
import AddPlaylistModal from 'components/Modals/AddPlaylistModal';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { scrollElementToCenter } from 'helpers';
import { useMyState, useSearch, useScrollPosition } from 'helpers/hooks';
import {
  useAppContext,
  useViewContext,
  useExploreContext,
  useInputContext
} from 'contexts';

Videos.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};

export default function Videos({ history, location }) {
  const {
    requestHelpers: { loadPlaylists, searchContent }
  } = useAppContext();
  const { userId } = useMyState();
  const {
    state: {
      videos: {
        addPlaylistModalShown,
        loadMorePlaylistsButton,
        loadMoreSearchedPlaylistsButton,
        allPlaylistsLoaded,
        allPlaylists,
        searchedPlaylists
      }
    },
    actions: {
      onCloseAddPlaylistModal,
      onLoadPlaylists,
      onOpenAddPlaylistModal,
      onSetSearchedPlaylists,
      onUploadPlaylist
    }
  } = useExploreContext();
  const {
    state: { playlistSearchText },
    actions: { onSetSearchText }
  } = useInputContext();
  const {
    actions: { onRecordScrollPosition },
    state: { scrollPositions }
  } = useViewContext();
  useScrollPosition({
    onRecordScrollPosition,
    pathname: location.pathname,
    scrollPositions
  });
  const { handleSearch, searching } = useSearch({
    onSearch: handleSearchPlaylist,
    onClear: () =>
      onSetSearchedPlaylists({ playlists: [], loadMoreButton: false }),
    onSetSearchText: searchText =>
      onSetSearchText({ category: 'playlist', searchText })
  });
  const AllPlaylistsPanelRef = useRef(null);
  const prevLoaded = useRef(false);

  useEffect(() => {
    if (!allPlaylistsLoaded) {
      init();
    }
    async function init() {
      const { results, loadMoreButton } = await loadPlaylists();
      onLoadPlaylists({
        playlists: results,
        loadMoreButton
      });
      prevLoaded.current = true;
    }
  }, [allPlaylistsLoaded]);

  const playlists = !stringIsEmpty(playlistSearchText)
    ? searchedPlaylists
    : allPlaylists;

  return useMemo(
    () => (
      <div>
        <FeaturedPlaylistsPanel history={history} />
        <PlaylistsPanel
          key={'allplaylists'}
          innerRef={AllPlaylistsPanelRef}
          buttonGroup={() => (
            <ButtonGroup
              style={{ marginLeft: 'auto' }}
              buttons={[
                {
                  label: '+ Add Playlist',
                  onClick: onOpenAddPlaylistModal,
                  skeuomorphic: true,
                  color: 'darkerGray',
                  disabled: !userId
                }
              ]}
            />
          )}
          title="All Playlists"
          loadMoreButton={
            !stringIsEmpty(playlistSearchText)
              ? loadMoreSearchedPlaylistsButton
              : loadMorePlaylistsButton
          }
          userId={userId}
          playlists={playlists}
          loaded={allPlaylistsLoaded || prevLoaded.current}
          isSearching={searching}
          onSearch={handleSearch}
          searchQuery={playlistSearchText}
        />
        {addPlaylistModalShown && (
          <AddPlaylistModal
            onUploadPlaylist={onUploadPlaylist}
            onHide={onCloseAddPlaylistModal}
            focusPlaylistPanelAfterUpload={() =>
              scrollElementToCenter(AllPlaylistsPanelRef.current, 150)
            }
          />
        )}
      </div>
    ),
    [
      userId,
      addPlaylistModalShown,
      loadMorePlaylistsButton,
      loadMoreSearchedPlaylistsButton,
      allPlaylistsLoaded,
      playlists,
      playlistSearchText,
      searching
    ]
  );

  async function handleSearchPlaylist(text) {
    const { results, loadMoreButton } = await searchContent({
      filter: 'playlist',
      searchText: text,
      limit: 3
    });
    onSetSearchedPlaylists({ playlists: results, loadMoreButton });
  }
}
