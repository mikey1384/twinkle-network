import React, { useEffect, useRef } from 'react';
import { useSearch, useScrollPosition } from 'helpers/hooks';
import PropTypes from 'prop-types';
import ButtonGroup from 'components/Buttons/ButtonGroup';
import FeaturedPlaylistsPanel from './Panels/FeaturedPlaylistsPanel';
import PlaylistsPanel from './Panels/PlaylistsPanel';
import AddPlaylistModal from 'components/Modals/AddPlaylistModal';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { scrollElementToCenter } from 'helpers';
import { useAppContext } from 'context';

Videos.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};

export default function Videos({ history, location }) {
  const {
    explore: {
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
    },
    user: {
      state: { userId }
    },
    view: {
      state: { scrollPositions },
      actions: { onRecordScrollPosition }
    },
    requestHelpers: { loadPlaylists, searchContent }
  } = useAppContext();
  useScrollPosition({
    scrollPositions,
    pathname: location.pathname,
    onRecordScrollPosition,
    currentSection: '/videos'
  });
  const { handleSearch, searching, searchText } = useSearch({
    onSearch: searchPlaylist,
    onClear: () =>
      onSetSearchedPlaylists({ playlists: [], loadMoreButton: false })
  });
  const AllPlaylistsPanelRef = useRef(null);

  useEffect(() => {
    init();

    async function init() {
      const { results, loadMoreButton } = await loadPlaylists();
      onLoadPlaylists({
        playlists: results,
        loadMoreButton
      });
    }
  }, []);

  const playlists = !stringIsEmpty(searchText)
    ? searchedPlaylists
    : allPlaylists;

  return (
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
          !stringIsEmpty(searchText)
            ? loadMoreSearchedPlaylistsButton
            : loadMorePlaylistsButton
        }
        userId={userId}
        playlists={playlists}
        loaded={allPlaylistsLoaded}
        isSearching={searching}
        onSearch={handleSearch}
        searchQuery={searchText}
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
  );

  async function searchPlaylist(text) {
    const { results, loadMoreButton } = await searchContent({
      filter: 'playlist',
      searchText: text,
      limit: 3
    });
    onSetSearchedPlaylists({ playlists: results, loadMoreButton });
  }
}
