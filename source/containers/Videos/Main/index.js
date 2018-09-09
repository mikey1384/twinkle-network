import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SelectPlaylistsToPinModal from './Modals/SelectPlaylistsToPinModal';
import ReorderPinnedPlaylistsModal from './Modals/ReorderPinnedPlaylistsModal';
import Button from 'components/Button';
import ButtonGroup from 'components/Buttons/ButtonGroup';
import AddVideoModal from './Modals/AddVideoModal';
import AllVideosPanel from './Panels/AllVideosPanel';
import PlaylistsPanel from './Panels/PlaylistsPanel';
import AddPlaylistModal from './Modals/AddPlaylistModal';
import Notification from 'components/Notification';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { searchContent } from 'helpers/requestHelpers';
import {
  openAddVideoModal,
  closeAddVideoModal
} from 'redux/actions/VideoActions';
import {
  openReorderPinnedPlaylistsModal,
  openSelectPlaylistsToPinModal,
  closeReorderPinnedPlaylistsModal,
  closeSelectPlaylistsToPinModal,
  setSearchedPlaylists
} from 'redux/actions/PlaylistActions';
import { connect } from 'react-redux';
import { main } from './Styles';

class Main extends Component {
  static propTypes = {
    addVideoModalShown: PropTypes.bool.isRequired,
    canPinPlaylists: PropTypes.bool,
    closeAddVideoModal: PropTypes.func.isRequired,
    closeReorderPinnedPlaylistsModal: PropTypes.func.isRequired,
    closeSelectPlaylistsToPinModal: PropTypes.func.isRequired,
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
    userId: PropTypes.number
  };

  timer = null;

  state = {
    addPlaylistModalShown: false,
    playlistSearchQuery: '',
    isSearching: false
  };

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
      playlists: allPlaylists,
      playlistsLoaded,
      playlistsToPin,
      reorderPinnedPlaylistsModalShown,
      searchedPlaylists,
      selectPlaylistsToPinModalShown,
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
            key={'allvideos'}
            title="All Videos"
            userId={userId}
            onAddVideoClick={() => openAddVideoModal()}
          />
          {addVideoModalShown && (
            <AddVideoModal onHide={() => closeAddVideoModal()} />
          )}
          {addPlaylistModalShown && (
            <AddPlaylistModal
              onHide={() => this.setState({ addPlaylistModalShown: false })}
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
    addPlaylistModalShown: state.PlaylistReducer.addPlaylistModalShown,
    addVideoModalShown: state.VideoReducer.addVideoModalShown,
    canPinPlaylists: state.UserReducer.canPinPlaylists,
    loadMorePlaylistsButton: state.PlaylistReducer.loadMoreButton,
    loadMorePlaylistsToPinButton:
      state.PlaylistReducer.loadMorePlaylistsToPinButton,
    loadMoreSearchedPlaylistsButton: state.PlaylistReducer.searchLoadMoreButton,
    pinnedPlaylistsLoaded: state.PlaylistReducer.pinnedPlaylistsLoaded,
    pinnedPlaylists: state.PlaylistReducer.pinnedPlaylists,
    playlistsToPin: state.PlaylistReducer.playlistsToPin,
    playlistsLoaded: state.PlaylistReducer.allPlaylistsLoaded,
    playlists: state.PlaylistReducer.allPlaylists,
    searchedPlaylists: state.PlaylistReducer.searchedPlaylists,
    reorderPinnedPlaylistsModalShown:
      state.PlaylistReducer.reorderPinnedPlaylistsModalShown,
    userType: state.UserReducer.userType,
    userId: state.UserReducer.userId,
    selectPlaylistsToPinModalShown:
      state.PlaylistReducer.selectPlaylistsToPinModalShown
  }),
  {
    openSelectPlaylistsToPinModal,
    closeReorderPinnedPlaylistsModal,
    closeSelectPlaylistsToPinModal,
    openReorderPinnedPlaylistsModal,
    setSearchedPlaylists,
    closeAddVideoModal,
    openAddVideoModal
  }
)(Main);
