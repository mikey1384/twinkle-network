import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ButtonGroup from 'components/Buttons/ButtonGroup';
import AddVideoModal from '../Modals/AddVideoModal';
import AllVideosPanel from '../Panels/AllVideosPanel';
import PlaylistsPanel from '../Panels/PlaylistsPanel';
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

class Main extends Component {
  static propTypes = {
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

  timer = null;

  state = {
    playlistSearchQuery: '',
    isSearching: false
  };

  componentDidMount() {
    const {
      clearVideos,
      getPlaylists,
      getInitialVideos,
      history,
      loaded
    } = this.props;
    if (history.action === 'PUSH' || !loaded) {
      clearVideos();
      getInitialVideos();
      getPlaylists();
    }
  }

  render() {
    const {
      addPlaylistModalShown,
      addVideoModalShown,
      closeAddPlaylistModal,
      closeAddVideoModal,
      loadMorePlaylistsButton,
      loadMoreSearchedPlaylistsButton,
      openAddPlaylistModal,
      openAddVideoModal,
      playlists: allPlaylists = [],
      playlistsLoaded,
      searchedPlaylists,
      postPlaylist,
      userId
    } = this.props;

    const { playlistSearchQuery, isSearching } = this.state;
    const playlists = !stringIsEmpty(playlistSearchQuery)
      ? searchedPlaylists
      : allPlaylists;

    const allPlaylistButtons = [
      {
        label: '+ Add Playlist',
        onClick: openAddPlaylistModal,
        buttonClass: 'snow'
      }
    ];
    return (
      <div>
        <PlaylistsPanel
          key={'allplaylists'}
          innerRef={ref => (this.AllPlaylistsPanel = ref)}
          buttonGroup={() => (
            <ButtonGroup
              style={{ marginLeft: 'auto' }}
              buttons={allPlaylistButtons}
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
          onSearch={this.onSearchPlaylist}
          searchQuery={playlistSearchQuery}
        />
        <AllVideosPanel
          innerRef={ref => (this.AllVideosPanel = ref)}
          key={'allvideos'}
          title="All Videos"
          userId={userId}
          onAddVideoClick={openAddVideoModal}
        />
        {addVideoModalShown && (
          <AddVideoModal
            onHide={closeAddVideoModal}
            focusVideoPanelAfterUpload={() =>
              scrollElementToCenter(this.AllVideosPanel, 150)
            }
          />
        )}
        {addPlaylistModalShown && (
          <AddPlaylistModal
            postPlaylist={postPlaylist}
            onHide={closeAddPlaylistModal}
            focusPlaylistPanelAfterUpload={() =>
              scrollElementToCenter(this.AllPlaylistsPanel, 150)
            }
          />
        )}
      </div>
    );
  }

  onSearchPlaylist = text => {
    clearTimeout(this.timer);
    this.setState({ playlistSearchQuery: text, isSearching: true });
    this.timer = setTimeout(() => this.searchPlaylist(text), 500);
  };

  searchPlaylist = async text => {
    const { setSearchedPlaylists } = this.props;
    if (stringIsEmpty(text) || text.length < 3) {
      setSearchedPlaylists({ playlists: [], loadMoreButton: false });
      return this.setState({ isSearching: false });
    }
    const { results, loadMoreButton } = await searchContent({
      filter: 'playlist',
      searchText: text,
      limit: 3
    });
    setSearchedPlaylists({ playlists: results, loadMoreButton });
    this.setState({ isSearching: false });
  };
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
)(Main);
