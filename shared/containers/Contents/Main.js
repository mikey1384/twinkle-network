import React, { Component } from 'react';
import SelectPlaylistsToPinModal from 'components/Modals/SelectPlaylistsToPinModal';
import ReorderPinnedPlaylistsModal from 'components/Modals/ReorderPinnedPlaylistsModal';
import ButtonGroup from 'components/ButtonGroup';
import AddVideoModal from 'components/Modals/AddVideoModal';
import AllVideosPanel from 'components/AllVideosPanel';
import PlaylistsPanel from 'components/PlaylistsPanel';
import { bindActionCreators } from 'redux';
import * as VideoActions from 'actions/VideoActions';
import * as PlaylistActions from 'actions/PlaylistActions';
import AddPlaylistModal from '../PlaylistModals/AddPlaylistModal';
import { connect } from 'react-redux';

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
  })
)

export default class Main extends Component {
  render() {
    const {
      userType,
      isAdmin,
      userId,

      videos,
      loadMoreVideosButton,

      playlists,
      playlistTitles,
      loadMorePlaylistsButton,

      pinnedPlaylists,
      pinnedPlaylistTitles,
      loadMorePinnedPlaylists,

      addVideoModalShown,
      addPlaylistModalShown,

      selectPlaylistsToPinModalShown,
      playlistsToPin,
      loadMorePlaylistsToPinButton,

      reorderPinnedPlaylistsModalShown,

      dispatch
    } = this.props;
    const { closeAddVideoModal } = VideoActions;
    const allPlaylistButtons = [
      {
        label: '+ Add Playlist',
        onClick: this.showAddPlaylistModal.bind(this),
        buttonClass: 'btn-default'
      }
    ]
    const pinnedPlaylistButtons = [
      {
        label: 'Select Playlists',
        onClick: () => dispatch(PlaylistActions.openSelectPlaylistsToPinModal()),
        buttonClass: 'btn-default'
      },
      {
        label: 'Reorder Playlists',
        onClick: () => dispatch(PlaylistActions.openReorderPinnedPlaylistsModal()),
        buttonClass: 'btn-default'
      }
    ]

    return (
      <div>
        <PlaylistsPanel
          key={"pinnedPlaylists"}
          buttonGroupShown={userType === 'master'}
          buttonGroup={ () => this.renderPlaylistButton(pinnedPlaylistButtons) }
          playlistType="pinned"
          title="Pinned Playlists"
          loadMoreButton={loadMorePinnedPlaylists}
          userId={userId}
          playlists={pinnedPlaylists}
          {...bindActionCreators(PlaylistActions, dispatch)}
        />
        <PlaylistsPanel
          key={"allplaylists"}
          buttonGroupShown={isAdmin}
          buttonGroup={ () => this.renderPlaylistButton(allPlaylistButtons) }
          playlistType="all"
          title="All Playlists"
          loadMoreButton={loadMorePlaylistsButton}
          userId={userId}
          playlists={playlists}
          {...bindActionCreators(PlaylistActions, dispatch)}
        />
        <AllVideosPanel
          key={"allvideos"}
          isAdmin={isAdmin}
          title="All Videos"
          loadMoreButton={loadMoreVideosButton}
          userId={userId}
          videos={videos}
          onAddVideoClick={() => dispatch(VideoActions.openAddVideoModal())}
          {...bindActionCreators(VideoActions, dispatch)}
        />
        {
          addVideoModalShown &&
          <AddVideoModal
            show
            onHide={ () => dispatch(closeAddVideoModal()) }
            {...bindActionCreators(VideoActions, dispatch)}
          />
        }
        { addPlaylistModalShown && <AddPlaylistModal show /> }
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
            onHide={ () => dispatch(PlaylistActions.closeSelectPlaylistsToPinModal()) }
            {...bindActionCreators(PlaylistActions, dispatch)}
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
            onHide={ () => dispatch(PlaylistActions.closeReorderPinnedPlaylistsModal()) }
            {...bindActionCreators(PlaylistActions, dispatch)}
          />
        }
      </div>
    )
  }

  renderPlaylistButton(buttonsArray) {
    return (
      <ButtonGroup
        className='btn-group'
        style={{
          marginLeft: 'auto'
        }}
        buttons={buttonsArray}
      />
    )
  }

  showAddPlaylistModal() {
    const { dispatch } = this.props;
    const { openAddPlaylistModal, getVideosForModal } = PlaylistActions;
    dispatch(getVideosForModal());
    dispatch(openAddPlaylistModal());
  }
}
