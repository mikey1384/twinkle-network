import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ButtonGroup from 'components/Buttons/ButtonGroup';
import AddVideoModal from './Modals/AddVideoModal';
import AllVideosPanel from './Panels/AllVideosPanel';
import PlaylistsPanel from './Panels/PlaylistsPanel';
import AddPlaylistModal from 'components/Modals/AddPlaylistModal';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { searchContent } from 'helpers/requestHelpers';
import {
  clearVideos,
  closeAddPlaylistModal,
  closeAddVideoModal,
  getInitialVideos,
  getPlaylists,
  openAddVideoModal,
  openAddPlaylistModal,
  setSearchedPlaylists,
  postPlaylist
} from 'redux/actions/VideoActions';
import { connect } from 'react-redux';
import { scrollElementToCenter } from 'helpers';

Videos.propTypes = {
  addPlaylistModalShown: PropTypes.bool.isRequired,
  addVideoModalShown: PropTypes.bool.isRequired,
  clearVideos: PropTypes.func.isRequired,
  closeAddPlaylistModal: PropTypes.func.isRequired,
  closeAddVideoModal: PropTypes.func.isRequired,
  getInitialVideos: PropTypes.func.isRequired,
  getPlaylists: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  loaded: PropTypes.bool.isRequired,
  loadMorePlaylistsButton: PropTypes.bool.isRequired,
  loadMoreSearchedPlaylistsButton: PropTypes.bool.isRequired,
  openAddPlaylistModal: PropTypes.func.isRequired,
  openAddVideoModal: PropTypes.func.isRequired,
  playlists: PropTypes.array.isRequired,
  playlistsLoaded: PropTypes.bool.isRequired,
  searchedPlaylists: PropTypes.array.isRequired,
  setSearchedPlaylists: PropTypes.func.isRequired,
  postPlaylist: PropTypes.func.isRequired,
  userId: PropTypes.number
};

function Videos({
  addPlaylistModalShown,
  addVideoModalShown,
  clearVideos,
  closeAddPlaylistModal,
  closeAddVideoModal,
  getPlaylists,
  getInitialVideos,
  history,
  loaded,
  loadMorePlaylistsButton,
  loadMoreSearchedPlaylistsButton,
  openAddPlaylistModal,
  openAddVideoModal,
  playlists: allPlaylists = [],
  postPlaylist,
  playlistsLoaded,
  searchedPlaylists,
  setSearchedPlaylists,
  userId
}) {
  const [playlistSearchQuery, setPlaylistSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const timerRef = useRef(null);
  const AllPlaylistsPanelRef = useRef(null);
  const AllVideosPanelRef = useRef(null);

  useEffect(() => {
    if (history.action === 'PUSH' || !loaded) {
      clearVideos();
      getInitialVideos();
      getPlaylists();
    }
  }, []);

  const playlists = !stringIsEmpty(playlistSearchQuery)
    ? searchedPlaylists
    : allPlaylists;

  return (
    <div>
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
                buttonClass: 'snow',
                disabled: !userId
              }
            ]}
          />
        )}
        title="All Playlists"
        loadMoreButton={
          !stringIsEmpty(playlistSearchQuery)
            ? loadMoreSearchedPlaylistsButton
            : loadMorePlaylistsButton
        }
        userId={userId}
        playlists={playlists}
        loaded={playlistsLoaded}
        isSearching={isSearching}
        onSearch={handleSearchPlaylist}
        searchQuery={playlistSearchQuery}
      />
      <AllVideosPanel
        innerRef={AllVideosPanelRef}
        key={'allvideos'}
        title="All Videos"
        userId={userId}
        onAddVideoClick={openAddVideoModal}
      />
      {addVideoModalShown && (
        <AddVideoModal
          onHide={closeAddVideoModal}
          focusVideoPanelAfterUpload={() =>
            scrollElementToCenter(AllVideosPanelRef.current, 150)
          }
        />
      )}
      {addPlaylistModalShown && (
        <AddPlaylistModal
          postPlaylist={postPlaylist}
          onHide={closeAddPlaylistModal}
          focusPlaylistPanelAfterUpload={() =>
            scrollElementToCenter(AllPlaylistsPanelRef.current, 150)
          }
        />
      )}
    </div>
  );

  function handleSearchPlaylist(text) {
    clearTimeout(timerRef.current);
    setPlaylistSearchQuery(text);
    setIsSearching(true);
    timerRef.current = setTimeout(() => searchPlaylist(text), 500);
  }

  async function searchPlaylist(text) {
    if (stringIsEmpty(text) || text.length < 3) {
      setSearchedPlaylists({ playlists: [], loadMoreButton: false });
      return setIsSearching(false);
    }
    const { results, loadMoreButton } = await searchContent({
      filter: 'playlist',
      searchText: text,
      limit: 3
    });
    setSearchedPlaylists({ playlists: results, loadMoreButton });
    setIsSearching(false);
  }
}

export default connect(
  state => ({
    addPlaylistModalShown: state.VideoReducer.addPlaylistModalShown,
    addVideoModalShown: state.VideoReducer.addVideoModalShown,
    loaded: state.VideoReducer.loaded,
    loadMorePlaylistsButton: state.VideoReducer.loadMorePlaylistsButton,
    loadMoreSearchedPlaylistsButton:
      state.VideoReducer.loadMoreSearchedPlaylistsButton,
    playlistsLoaded: state.VideoReducer.allPlaylistsLoaded,
    playlists: state.VideoReducer.allPlaylists,
    searchedPlaylists: state.VideoReducer.searchedPlaylists,
    userType: state.UserReducer.userType,
    userId: state.UserReducer.userId
  }),
  {
    clearVideos,
    getPlaylists,
    getInitialVideos,
    openAddVideoModal,
    openAddPlaylistModal,
    setSearchedPlaylists,
    closeAddPlaylistModal,
    closeAddVideoModal,
    postPlaylist
  }
)(Videos);
