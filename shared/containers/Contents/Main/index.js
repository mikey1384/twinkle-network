import React, {Component} from 'react';
import SelectPlaylistsToPinModal from './Modals/SelectPlaylistsToPinModal';
import ReorderPinnedPlaylistsModal from './Modals/ReorderPinnedPlaylistsModal';
import ButtonGroup from 'components/ButtonGroup';
import AddVideoModal from './Modals/AddVideoModal';
import AllVideosPanel from './Panels/AllVideosPanel';
import PlaylistsPanel from './Panels/PlaylistsPanel';
import AddPlaylistModal from './Modals/AddPlaylistModal';
import {bindActionCreators} from 'redux';
import {openAddVideoModal, closeAddVideoModal, resetVideoPage} from 'redux/actions/VideoActions';
import {
  openReorderPinnedPlaylistsModal,
  openSelectPlaylistsToPinModalAsync,
  getVideosForModalAsync,
  closeReorderPinnedPlaylistsModal,
  closeSelectPlaylistsToPinModal
} from 'redux/actions/PlaylistActions';
import {connect} from 'react-redux';

@connect(
  state => ({
    userType: state.UserReducer.userType,
    isAdmin: state.UserReducer.isAdmin,
    userId: state.UserReducer.userId,

    videos: state.VideoReducer.allVideoThumbs,
    loadMoreVideosButton: state.VideoReducer.loadMoreButton,

    playlists: state.PlaylistReducer.allPlaylists,
    loadMorePlaylistsButton: state.PlaylistReducer.loadMoreButton,

    pinnedPlaylists: state.PlaylistReducer.pinnedPlaylists,
    loadMorePinnedPlaylists: state.PlaylistReducer.loadMorePinned,

    addPlaylistModalShown: state.PlaylistReducer.addPlaylistModalShown,
    addVideoModalShown: state.VideoReducer.addVideoModalShown,

    selectPlaylistsToPinModalShown: state.PlaylistReducer.selectPlaylistsToPinModalShown,
    playlistsToPin: state.PlaylistReducer.playlistsToPin,
    loadMorePlaylistsToPinButton: state.PlaylistReducer.loadMorePlaylistsToPinButton,

    reorderPinnedPlaylistsModalShown: state.PlaylistReducer.reorderPinnedPlaylistsModalShown
  }),
  {
    openSelectPlaylistsToPinModal: openSelectPlaylistsToPinModalAsync,
    getVideosForModal: getVideosForModalAsync,
    closeReorderPinnedPlaylistsModal,
    closeSelectPlaylistsToPinModal,
    openReorderPinnedPlaylistsModal,
    resetVideoPage,
    closeAddVideoModal,
    openAddVideoModal
  }
)

export default class Main extends Component {
  constructor() {
    super()
    this.showAddPlaylistModal = this.showAddPlaylistModal.bind(this)
  }

  componentWillMount() {
    this.props.resetVideoPage()
  }

  render() {
    const {
      userType,
      isAdmin,
      userId,

      videos,
      loadMoreVideosButton,

      playlists,
      loadMorePlaylistsButton,

      pinnedPlaylists,
      loadMorePinnedPlaylists,

      addVideoModalShown,
      addPlaylistModalShown,

      selectPlaylistsToPinModalShown,
      playlistsToPin,
      loadMorePlaylistsToPinButton,

      reorderPinnedPlaylistsModalShown,

      openSelectPlaylistsToPinModal,
      openReorderPinnedPlaylistsModal,
      openAddVideoModal,
      closeAddVideoModal,
      closeSelectPlaylistsToPinModal,
      closeReorderPinnedPlaylistsModal
    } = this.props;

    const allPlaylistButtons = [
      {
        label: '+ Add Playlist',
        onClick: this.showAddPlaylistModal,
        buttonClass: 'btn-default'
      }
    ]
    const pinnedPlaylistButtons = [
      {
        label: 'Select Playlists',
        onClick: () => openSelectPlaylistsToPinModal(),
        buttonClass: 'btn-default'
      },
      {
        label: 'Reorder Playlists',
        onClick: () => openReorderPinnedPlaylistsModal(),
        buttonClass: 'btn-default'
      }
    ]
    return (
      <div>
        <PlaylistsPanel
          key={"pinnedPlaylists"}
          buttonGroupShown={userType === 'master'}
          buttonGroup={() => this.renderPlaylistButton(pinnedPlaylistButtons)}
          playlistType="pinned"
          title="Pinned Playlists"
          loadMoreButton={loadMorePinnedPlaylists}
          userId={userId}
          playlists={pinnedPlaylists}
        />
        <PlaylistsPanel
          key={"allplaylists"}
          buttonGroupShown={isAdmin}
          buttonGroup={() => this.renderPlaylistButton(allPlaylistButtons)}
          playlistType="all"
          title="All Playlists"
          loadMoreButton={loadMorePlaylistsButton}
          userId={userId}
          playlists={playlists}
        />
        <AllVideosPanel
          key={"allvideos"}
          isAdmin={isAdmin}
          title="All Videos"
          loadMoreButton={loadMoreVideosButton}
          userId={userId}
          videos={videos}
          onAddVideoClick={() => openAddVideoModal()}
        />
        {addVideoModalShown &&
          <AddVideoModal
            show
            onHide={() => closeAddVideoModal()}
          />
        }
        {addPlaylistModalShown && <AddPlaylistModal show />}
        {selectPlaylistsToPinModalShown &&
          <SelectPlaylistsToPinModal
            show
            playlistsToPin={playlistsToPin}
            pinnedPlaylists={pinnedPlaylists}
            selectedPlaylists={
              pinnedPlaylists.map(playlist => {
                return playlist.id
              })
            }
            loadMoreButton={loadMorePlaylistsToPinButton}
            onHide={() => closeSelectPlaylistsToPinModal()}
          />
        }
        {reorderPinnedPlaylistsModalShown &&
          <ReorderPinnedPlaylistsModal
            show
            pinnedPlaylists={pinnedPlaylists}
            playlistIds={
              pinnedPlaylists.map(playlist => {
                return playlist.id
              })
            }
            onHide={() => closeReorderPinnedPlaylistsModal()}
          />
        }
      </div>
    )
  }

  renderPlaylistButton(buttonsArray) {
    return (
      <ButtonGroup
        style={{
          marginLeft: 'auto'
        }}
        buttons={buttonsArray}
      />
    )
  }

  showAddPlaylistModal() {
    const {getVideosForModal} = this.props;
    getVideosForModal();
  }
}
