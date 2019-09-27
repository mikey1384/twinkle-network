import React, { useEffect, useRef } from 'react';
import { useSearch, useScrollPosition } from 'helpers/hooks';
import PropTypes from 'prop-types';
import ButtonGroup from 'components/Buttons/ButtonGroup';
import FeaturedPlaylistPanel from './Panels/FeaturedPlaylistsPanel';
import PlaylistsPanel from './Panels/PlaylistsPanel';
import AddPlaylistModal from 'components/Modals/AddPlaylistModal';
import { stringIsEmpty } from 'helpers/stringHelpers';
import {
  onLoadPlaylists,
  openAddVideoModal,
  openAddPlaylistModal,
  setSearchedPlaylists,
  postPlaylist
} from 'redux/actions/VideoActions';
import { connect } from 'react-redux';
import { scrollElementToCenter } from 'helpers';
import { useAppContext } from 'context';

Videos.propTypes = {
  addPlaylistModalShown: PropTypes.bool.isRequired,
  onLoadPlaylists: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  loadMorePlaylistsButton: PropTypes.bool.isRequired,
  loadMoreSearchedPlaylistsButton: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  openAddPlaylistModal: PropTypes.func.isRequired,
  playlists: PropTypes.array.isRequired,
  playlistsLoaded: PropTypes.bool.isRequired,
  searchedPlaylists: PropTypes.array.isRequired,
  setSearchedPlaylists: PropTypes.func.isRequired,
  postPlaylist: PropTypes.func.isRequired
};

function Videos({
  addPlaylistModalShown,
  onLoadPlaylists,
  history,
  loadMorePlaylistsButton,
  loadMoreSearchedPlaylistsButton,
  location,
  openAddPlaylistModal,
  playlists: allPlaylists = [],
  postPlaylist,
  playlistsLoaded,
  searchedPlaylists,
  setSearchedPlaylists
}) {
  const {
    explore: {
      actions: { onCloseAddPlaylistModal }
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
      setSearchedPlaylists({ playlists: [], loadMoreButton: false })
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
      <FeaturedPlaylistPanel history={history} />
      <PlaylistsPanel
        key={'allplaylists'}
        innerRef={AllPlaylistsPanelRef}
        buttonGroup={() => (
          <ButtonGroup
            style={{ marginLeft: 'auto' }}
            buttons={[
              {
                label: '+ Add Playlist',
                onClick: openAddPlaylistModal,
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
        loaded={playlistsLoaded}
        isSearching={searching}
        onSearch={handleSearch}
        searchQuery={searchText}
      />
      {addPlaylistModalShown && (
        <AddPlaylistModal
          postPlaylist={postPlaylist}
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
    setSearchedPlaylists({ playlists: results, loadMoreButton });
  }
}

export default connect(
  state => ({
    addPlaylistModalShown: state.VideoReducer.addPlaylistModalShown,
    addVideoModalShown: state.VideoReducer.addVideoModalShown,
    loadMorePlaylistsButton: state.VideoReducer.loadMorePlaylistsButton,
    loadMoreSearchedPlaylistsButton:
      state.VideoReducer.loadMoreSearchedPlaylistsButton,
    playlistsLoaded: state.VideoReducer.allPlaylistsLoaded,
    playlists: state.VideoReducer.allPlaylists,
    searchedPlaylists: state.VideoReducer.searchedPlaylists
  }),
  {
    onLoadPlaylists,
    openAddVideoModal,
    openAddPlaylistModal,
    setSearchedPlaylists,
    postPlaylist
  }
)(Videos);
