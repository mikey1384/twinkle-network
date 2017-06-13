import PropTypes from 'prop-types'
import React, {Component} from 'react'
import SelectPlaylistsToPinModal from './Modals/SelectPlaylistsToPinModal'
import ReorderPinnedPlaylistsModal from './Modals/ReorderPinnedPlaylistsModal'
import ButtonGroup from 'components/ButtonGroup'
import AddVideoModal from './Modals/AddVideoModal'
import AllVideosPanel from './Panels/AllVideosPanel'
import PlaylistsPanel from './Panels/PlaylistsPanel'
import AddPlaylistModal from './Modals/AddPlaylistModal'
import Notification from 'containers/Notification'
import {openAddVideoModal, closeAddVideoModal, getInitialVideos} from 'redux/actions/VideoActions'
import {
  openReorderPinnedPlaylistsModal,
  openSelectPlaylistsToPinModalAsync,
  getVideosForModalAsync,
  closeReorderPinnedPlaylistsModal,
  closeSelectPlaylistsToPinModal,
  getPinnedPlaylistsAsync,
  getPlaylistsAsync
} from 'redux/actions/PlaylistActions'
import ExecutionEnvironment from 'exenv'
import {connect} from 'react-redux'

@connect(
  state => ({
    videosLoaded: state.VideoReducer.loaded,
    userType: state.UserReducer.userType,
    isAdmin: state.UserReducer.isAdmin,
    userId: state.UserReducer.userId,

    notificationLoaded: state.NotiReducer.loaded,

    videos: state.VideoReducer.allVideoThumbs,
    loadMoreVideosButton: state.VideoReducer.loadMoreButton,

    playlistsLoaded: state.PlaylistReducer.allPlaylistsLoaded,
    playlists: state.PlaylistReducer.allPlaylists,
    loadMorePlaylistsButton: state.PlaylistReducer.loadMoreButton,

    pinnedPlaylistsLoaded: state.PlaylistReducer.pinnedPlaylistsLoaded,
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
    closeAddVideoModal,
    openAddVideoModal,
    getInitialVideos,
    getPinnedPlaylists: getPinnedPlaylistsAsync,
    getPlaylists: getPlaylistsAsync
  }
)

export default class Main extends Component {
  static propTypes = {
    getInitialVideos: PropTypes.func,
    getPlaylists: PropTypes.func,
    getPinnedPlaylists: PropTypes.func,
    location: PropTypes.object,
    notificationLoaded: PropTypes.bool,
    videosLoaded: PropTypes.bool,
    userType: PropTypes.string,
    isAdmin: PropTypes.bool,
    userId: PropTypes.number,
    videos: PropTypes.array,
    loadMoreVideosButton: PropTypes.bool,
    playlists: PropTypes.array,
    playlistsLoaded: PropTypes.bool,
    loadMorePlaylistsButton: PropTypes.bool,
    pinnedPlaylists: PropTypes.array,
    pinnedPlaylistsLoaded: PropTypes.bool,
    loadMorePinnedPlaylists: PropTypes.bool,
    addVideoModalShown: PropTypes.bool,
    addPlaylistModalShown: PropTypes.bool,
    selectPlaylistsToPinModalShown: PropTypes.bool,
    playlistsToPin: PropTypes.array,
    loadMorePlaylistsToPinButton: PropTypes.bool,
    reorderPinnedPlaylistsModalShown: PropTypes.func,
    openSelectPlaylistsToPinModal: PropTypes.func,
    openReorderPinnedPlaylistsModal: PropTypes.func,
    openAddVideoModal: PropTypes.func,
    closeAddVideoModal: PropTypes.func,
    closeSelectPlaylistsToPinModal: PropTypes.func,
    closeReorderPinnedPlaylistsModal: PropTypes.func,
    getVideosForModal: PropTypes.func
  }

  constructor() {
    super()
    this.showAddPlaylistModal = this.showAddPlaylistModal.bind(this)
  }

  componentDidMount() {
    const {getInitialVideos, getPlaylists, getPinnedPlaylists, location, videosLoaded} = this.props
    if (ExecutionEnvironment.canUseDOM && (location.action === 'PUSH' || !videosLoaded)) {
      getInitialVideos()
      getPinnedPlaylists()
      getPlaylists()
    }
  }

  render() {
    const {
      userType,
      isAdmin,
      userId,

      videos,
      videosLoaded,
      loadMoreVideosButton,

      notificationLoaded,

      playlists,
      playlistsLoaded,
      loadMorePlaylistsButton,

      pinnedPlaylists,
      pinnedPlaylistsLoaded,
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
    } = this.props

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
        <div className="col-md-9">
          {(pinnedPlaylists.length > 0 || userType === 'master') &&
            <PlaylistsPanel
              key={'pinnedPlaylists'}
              buttonGroupShown={userType === 'master'}
              buttonGroup={() => this.renderPlaylistButton(pinnedPlaylistButtons)}
              title="Featured Playlists"
              loadMoreButton={loadMorePinnedPlaylists}
              userId={userId}
              playlists={pinnedPlaylists}
              loaded={pinnedPlaylistsLoaded}
            />
          }
          <PlaylistsPanel
            key={'allplaylists'}
            buttonGroup={() => this.renderPlaylistButton(allPlaylistButtons)}
            title="All Playlists"
            loadMoreButton={loadMorePlaylistsButton}
            userId={userId}
            playlists={playlists}
            loaded={playlistsLoaded}
          />
          <AllVideosPanel
            key={'allvideos'}
            isAdmin={isAdmin}
            title="All Videos"
            loadMoreButton={loadMoreVideosButton}
            userId={userId}
            videos={videos}
            onAddVideoClick={() => openAddVideoModal()}
            loaded={videosLoaded}
          />
          {addVideoModalShown &&
            <AddVideoModal
              onHide={() => closeAddVideoModal()}
            />
          }
          {addPlaylistModalShown && <AddPlaylistModal />}
          {selectPlaylistsToPinModalShown &&
            <SelectPlaylistsToPinModal
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
        {notificationLoaded && <Notification />}
      </div>
    )
  }

  renderPlaylistButton(buttonsArray) {
    return (
      <ButtonGroup
        style={{marginLeft: 'auto'}}
        buttons={buttonsArray}
      />
    )
  }

  showAddPlaylistModal() {
    const {getVideosForModal} = this.props
    getVideosForModal()
  }
}
