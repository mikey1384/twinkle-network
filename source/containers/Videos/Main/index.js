import PropTypes from 'prop-types'
import React, { Component } from 'react'
import SelectPlaylistsToPinModal from './Modals/SelectPlaylistsToPinModal'
import ReorderPinnedPlaylistsModal from './Modals/ReorderPinnedPlaylistsModal'
import Button from 'components/Button'
import ButtonGroup from 'components/ButtonGroup'
import AddVideoModal from './Modals/AddVideoModal'
import AllVideosPanel from './Panels/AllVideosPanel'
import PlaylistsPanel from './Panels/PlaylistsPanel'
import AddPlaylistModal from './Modals/AddPlaylistModal'
import Notification from 'containers/Notification'
import {
  openAddVideoModal,
  closeAddVideoModal
} from 'redux/actions/VideoActions'
import {
  openReorderPinnedPlaylistsModal,
  openSelectPlaylistsToPinModalAsync,
  getVideosForModalAsync,
  closeReorderPinnedPlaylistsModal,
  closeSelectPlaylistsToPinModal,
  getPinnedPlaylistsAsync,
  getPlaylistsAsync
} from 'redux/actions/PlaylistActions'
import { connect } from 'react-redux'
import request from 'axios'
import { URL } from 'constants/URL'

class Main extends Component {
  static propTypes = {
    addVideoModalShown: PropTypes.bool.isRequired,
    closeAddVideoModal: PropTypes.func.isRequired,
    closeReorderPinnedPlaylistsModal: PropTypes.func.isRequired,
    closeSelectPlaylistsToPinModal: PropTypes.func.isRequired,
    getPinnedPlaylists: PropTypes.func.isRequired,
    getPlaylists: PropTypes.func.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    loadMorePlaylistsButton: PropTypes.bool.isRequired,
    loadMorePlaylistsToPinButton: PropTypes.bool.isRequired,
    notificationLoaded: PropTypes.bool.isRequired,
    openAddVideoModal: PropTypes.func.isRequired,
    openReorderPinnedPlaylistsModal: PropTypes.func.isRequired,
    openSelectPlaylistsToPinModal: PropTypes.func.isRequired,
    pinnedPlaylists: PropTypes.array.isRequired,
    pinnedPlaylistsLoaded: PropTypes.bool.isRequired,
    playlists: PropTypes.array.isRequired,
    playlistsLoaded: PropTypes.bool.isRequired,
    playlistsToPin: PropTypes.array.isRequired,
    reorderPinnedPlaylistsModalShown: PropTypes.bool.isRequired,
    selectPlaylistsToPinModalShown: PropTypes.bool.isRequired,
    userId: PropTypes.number
  }

  timer = null

  state = {
    addPlaylistModalShown: false,
    playlistSearchQuery: '',
    searchedPlaylists: [],
    isSearching: false
  }

  render() {
    const {
      isAdmin,
      userId,

      notificationLoaded,

      playlists: allPlaylists,
      getPlaylists,
      playlistsLoaded,
      loadMorePlaylistsButton,

      pinnedPlaylists,
      getPinnedPlaylists,
      pinnedPlaylistsLoaded,

      addVideoModalShown,

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

    const {
      addPlaylistModalShown,
      playlistSearchQuery,
      isSearching,
      searchedPlaylists
    } = this.state

    const playlists = playlistSearchQuery ? searchedPlaylists : allPlaylists

    const allPlaylistButtons = [
      {
        label: '+ Add Playlist',
        onClick: () => this.setState({ addPlaylistModalShown: true }),
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
          <PlaylistsPanel
            key={'pinnedPlaylists'}
            buttonGroupShown={isAdmin}
            buttonGroup={() => this.renderPlaylistButton(pinnedPlaylistButtons)}
            title="Featured Playlists"
            userId={userId}
            playlists={pinnedPlaylists}
            loadPlaylists={getPinnedPlaylists}
            loaded={pinnedPlaylistsLoaded}
          />
          <PlaylistsPanel
            key={'allplaylists'}
            buttonGroup={() => this.renderPlaylistButton(allPlaylistButtons)}
            title="All Playlists"
            loadMoreButton={loadMorePlaylistsButton}
            userId={userId}
            playlists={playlists}
            loadPlaylists={getPlaylists}
            loaded={playlistsLoaded}
            isSearching={isSearching}
            onSearch={this.onSearchPlaylist}
            searchQuery={playlistSearchQuery}
          />
          <AllVideosPanel
            key={'allvideos'}
            isAdmin={isAdmin}
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
                return playlist.id
              })}
              loadMoreButton={loadMorePlaylistsToPinButton}
              onHide={() => closeSelectPlaylistsToPinModal()}
            />
          )}
          {reorderPinnedPlaylistsModalShown && (
            <ReorderPinnedPlaylistsModal
              pinnedPlaylists={pinnedPlaylists}
              playlistIds={pinnedPlaylists.map(playlist => {
                return playlist.id
              })}
              onHide={() => closeReorderPinnedPlaylistsModal()}
            />
          )}
        </div>
        {notificationLoaded && (
          <Notification device="desktop" className="col-xs-3 col-xs-offset-9">
            <Button
              className="btn btn-lg btn-info"
              style={{
                fontSize: '1.5em',
                width: '100%',
                marginBottom: '0.5em'
              }}
              onClick={() => openAddVideoModal()}
            >
              + Add Video
            </Button>
            <Button
              className="btn btn-lg btn-info"
              style={{ fontSize: '1.5em', width: '100%' }}
              onClick={() => this.setState({ addPlaylistModalShown: true })}
            >
              + Add Playlist
            </Button>
          </Notification>
        )}
      </div>
    )
  }

  onSearchPlaylist = text => {
    clearTimeout(this.timer)
    this.setState({ playlistSearchQuery: text, isSearching: true })
    this.timer = setTimeout(() => this.searchPlaylist(text), 300)
  }

  renderPlaylistButton = buttonsArray => {
    return <ButtonGroup style={{ marginLeft: 'auto' }} buttons={buttonsArray} />
  }

  searchPlaylist = async(text) => {
    this.setState({isSearching: false})
    try {
      const { data: searchedPlaylists } = await request.get(
        `${URL}/playlist/search/playlist?query=${text}`
      )
      this.setState({ searchedPlaylists, isSearching: false })
    } catch (error) {
      console.error(error.response || error)
    }
  }
}

export default connect(
  state => ({
    userType: state.UserReducer.userType,
    isAdmin: state.UserReducer.isAdmin,
    userId: state.UserReducer.userId,

    notificationLoaded: state.NotiReducer.loaded,

    playlistsLoaded: state.PlaylistReducer.allPlaylistsLoaded,
    playlists: state.PlaylistReducer.allPlaylists,
    loadMorePlaylistsButton: state.PlaylistReducer.loadMoreButton,

    pinnedPlaylistsLoaded: state.PlaylistReducer.pinnedPlaylistsLoaded,
    pinnedPlaylists: state.PlaylistReducer.pinnedPlaylists,

    addPlaylistModalShown: state.PlaylistReducer.addPlaylistModalShown,
    addVideoModalShown: state.VideoReducer.addVideoModalShown,

    selectPlaylistsToPinModalShown:
      state.PlaylistReducer.selectPlaylistsToPinModalShown,
    playlistsToPin: state.PlaylistReducer.playlistsToPin,
    loadMorePlaylistsToPinButton:
      state.PlaylistReducer.loadMorePlaylistsToPinButton,

    reorderPinnedPlaylistsModalShown:
      state.PlaylistReducer.reorderPinnedPlaylistsModalShown
  }),
  {
    openSelectPlaylistsToPinModal: openSelectPlaylistsToPinModalAsync,
    getVideosForModal: getVideosForModalAsync,
    closeReorderPinnedPlaylistsModal,
    closeSelectPlaylistsToPinModal,
    openReorderPinnedPlaylistsModal,
    closeAddVideoModal,
    openAddVideoModal,
    getPinnedPlaylists: getPinnedPlaylistsAsync,
    getPlaylists: getPlaylistsAsync
  }
)(Main)
