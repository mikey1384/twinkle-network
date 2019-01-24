import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SelectPlaylistsToPinModal from './Modals/SelectPlaylistsToPinModal';
import ReorderPinnedPlaylistsModal from './Modals/ReorderPinnedPlaylistsModal';
import Button from 'components/Button';
import ButtonGroup from 'components/Buttons/ButtonGroup';
import AddVideoModal from './Modals/AddVideoModal';
import AllVideosPanel from './Panels/AllVideosPanel';
import PlaylistsPanel from './Panels/PlaylistsPanel';
import AddPlaylistModal from 'components/Modals/AddPlaylistModal';
import Notification from 'components/Notification';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { searchContent } from 'helpers/requestHelpers';
import {
  clearVideos,
  closeAddVideoModal,
  getInitialVideos,
  getPlaylists,
  openAddVideoModal,
  getPinnedPlaylists,
  openReorderPinnedPlaylistsModal,
  openSelectPlaylistsToPinModal,
  closeReorderPinnedPlaylistsModal,
  closeSelectPlaylistsToPinModal,
  setSearchedPlaylists,
  postPlaylist
} from 'redux/actions/VideoActions';
import { connect } from 'react-redux';
import { main } from './Styles';
import { scrollElementToCenter } from 'helpers';

class Main extends Component {
  static propTypes = {
    addVideoModalShown: PropTypes.bool.isRequired,
    canPinPlaylists: PropTypes.bool,
    clearVideos: PropTypes.func.isRequired,
    closeAddVideoModal: PropTypes.func.isRequired,
    closeReorderPinnedPlaylistsModal: PropTypes.func.isRequired,
    closeSelectPlaylistsToPinModal: PropTypes.func.isRequired,
    getInitialVideos: PropTypes.func.isRequired,
    getPlaylists: PropTypes.func.isRequired,
    getPinnedPlaylists: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    loaded: PropTypes.bool.isRequired,
    loadMorePlaylistsButton: PropTypes.bool.isRequired,
    loadMorePlaylistsToPinButton: PropTypes.bool.isRequired,
    loadMoreSearchedPlaylistsButton: PropTypes.bool.isRequired,
    openAddVideoModal: PropTypes.func.isRequired,
    openReorderPinnedPlaylistsModal: PropTypes.func.isRequired,
    openSelectPlaylistsToPinModal: PropTypes.func.isRequired,
    pinnedPlaylists: PropTypes.array.isRequired,
    pinnedPlaylistsLoaded: PropTypes.bool.isRequired,
    playlists: PropTypes.array.isRequired,
    playlistsLoaded: PropTypes.bool.isRequired,
    playlistsToPin: PropTypes.array.isRequired,
    reorderPinnedPlaylistsModalShown: PropTypes.bool.isRequired,
    searchedPlaylists: PropTypes.array.isRequired,
    selectPlaylistsToPinModalShown: PropTypes.bool.isRequired,
    setSearchedPlaylists: PropTypes.func.isRequired,
    postPlaylist: PropTypes.func.isRequired,
    userId: PropTypes.number
  };

  timer = null;

  state = {
    addPlaylistModalShown: false,
    playlistSearchQuery: '',
    isSearching: false
  };

  componentDidMount() {
    const {
      clearVideos,
      getPlaylists,
      getPinnedPlaylists,
      getInitialVideos,
      history,
      loaded
    } = this.props;
    if (history.action === 'PUSH' || !loaded) {
      clearVideos();
      getInitialVideos();
      getPlaylists();
      getPinnedPlaylists();
    }
  }

  render() {
    const {
      addVideoModalShown,
      canPinPlaylists,
      closeAddVideoModal,
      closeSelectPlaylistsToPinModal,
      closeReorderPinnedPlaylistsModal,
      loadMorePlaylistsButton,
      loadMorePlaylistsToPinButton,
      loadMoreSearchedPlaylistsButton,
      openSelectPlaylistsToPinModal,
      openReorderPinnedPlaylistsModal,
      openAddVideoModal,
      pinnedPlaylists,
      pinnedPlaylistsLoaded,
      playlists: allPlaylists = [],
      playlistsLoaded,
      playlistsToPin,
      reorderPinnedPlaylistsModalShown,
      searchedPlaylists,
      selectPlaylistsToPinModalShown,
      postPlaylist,
      userId
    } = this.props;

    const {
      addPlaylistModalShown,
      playlistSearchQuery,
      isSearching
    } = this.state;
    const playlists = !stringIsEmpty(playlistSearchQuery)
      ? searchedPlaylists
      : allPlaylists;

    const allPlaylistButtons = [
      {
        label: '+ Add Playlist',
        onClick: () => this.setState({ addPlaylistModalShown: true }),
        buttonClass: 'snow'
      }
    ];
    const pinnedPlaylistButtons =
      playlists.length > 0
        ? [
            {
              label: 'Select Playlists',
              onClick: openSelectPlaylistsToPinModal,
              buttonClass: 'snow'
            },
            {
              label: 'Reorder Playlists',
              onClick: openReorderPinnedPlaylistsModal,
              buttonClass: 'snow'
            }
          ]
        : [];
    return (
      <div className={main}>
        <div className="left">
          <PlaylistsPanel
            key={'pinnedPlaylists'}
            buttonGroupShown={!!canPinPlaylists}
            buttonGroup={() => this.renderPlaylistButton(pinnedPlaylistButtons)}
            title="Featured Playlists"
            userId={userId}
            playlists={pinnedPlaylists}
            loaded={pinnedPlaylistsLoaded}
          />
          <PlaylistsPanel
            key={'allplaylists'}
            innerRef={ref => (this.AllPlaylistsPanel = ref)}
            buttonGroup={() => this.renderPlaylistButton(allPlaylistButtons)}
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
            onAddVideoClick={() => openAddVideoModal()}
          />
          {addVideoModalShown && (
            <AddVideoModal
              onHide={() => closeAddVideoModal()}
              focusVideoPanelAfterUpload={() =>
                scrollElementToCenter(this.AllVideosPanel, 150)
              }
            />
          )}
          {addPlaylistModalShown && (
            <AddPlaylistModal
              postPlaylist={postPlaylist}
              onHide={() => this.setState({ addPlaylistModalShown: false })}
              focusPlaylistPanelAfterUpload={() =>
                scrollElementToCenter(this.AllPlaylistsPanel, 150)
              }
            />
          )}
          {selectPlaylistsToPinModalShown && (
            <SelectPlaylistsToPinModal
              playlistsToPin={playlistsToPin}
              pinnedPlaylists={pinnedPlaylists}
              selectedPlaylists={pinnedPlaylists.map(playlist => {
                return playlist.id;
              })}
              loadMoreButton={loadMorePlaylistsToPinButton}
              onHide={() => closeSelectPlaylistsToPinModal()}
            />
          )}
          {reorderPinnedPlaylistsModalShown && (
            <ReorderPinnedPlaylistsModal
              pinnedPlaylists={pinnedPlaylists}
              playlistIds={pinnedPlaylists.map(playlist => {
                return playlist.id;
              })}
              onHide={() => closeReorderPinnedPlaylistsModal()}
            />
          )}
        </div>
        <Notification className="right">
          <Button
            snow
            style={{
              fontSize: '2rem',
              width: '99%',
              marginTop: '0.1rem',
              marginBottom: '1rem'
            }}
            onClick={() => openAddVideoModal()}
          >
            + Add Video
          </Button>
          <Button
            snow
            style={{ fontSize: '2rem', width: '99%' }}
            onClick={() => this.setState({ addPlaylistModalShown: true })}
          >
            + Add Playlist
          </Button>
        </Notification>
      </div>
    );
  }

  onSearchPlaylist = text => {
    clearTimeout(this.timer);
    this.setState({ playlistSearchQuery: text, isSearching: true });
    this.timer = setTimeout(() => this.searchPlaylist(text), 500);
  };

  renderPlaylistButton = buttonsArray => {
    return (
      <ButtonGroup style={{ marginLeft: 'auto' }} buttons={buttonsArray} />
    );
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
    canPinPlaylists: state.UserReducer.canPinPlaylists,
    loaded: state.VideoReducer.loaded,
    loadMorePlaylistsButton: state.VideoReducer.loadMorePlaylistsButton,
    loadMorePlaylistsToPinButton:
      state.VideoReducer.loadMorePlaylistsToPinButton,
    loadMoreSearchedPlaylistsButton:
      state.VideoReducer.loadMoreSearchedPlaylistsButton,
    pinnedPlaylistsLoaded: state.VideoReducer.pinnedPlaylistsLoaded,
    pinnedPlaylists: state.VideoReducer.pinnedPlaylists,
    playlistsToPin: state.VideoReducer.playlistsToPin,
    playlistsLoaded: state.VideoReducer.allPlaylistsLoaded,
    playlists: state.VideoReducer.allPlaylists,
    searchedPlaylists: state.VideoReducer.searchedPlaylists,
    reorderPinnedPlaylistsModalShown:
      state.VideoReducer.reorderPinnedPlaylistsModalShown,
    userType: state.UserReducer.userType,
    userId: state.UserReducer.userId,
    selectPlaylistsToPinModalShown:
      state.VideoReducer.selectPlaylistsToPinModalShown
  }),
  {
    clearVideos,
    closeReorderPinnedPlaylistsModal,
    closeSelectPlaylistsToPinModal,
    getPlaylists,
    getPinnedPlaylists,
    getInitialVideos,
    openSelectPlaylistsToPinModal,
    openReorderPinnedPlaylistsModal,
    setSearchedPlaylists,
    closeAddVideoModal,
    openAddVideoModal,
    postPlaylist
  }
)(Main);
