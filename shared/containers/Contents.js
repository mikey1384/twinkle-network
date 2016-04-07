import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AllVideosPanel from 'components/AllVideosPanel';
import PlaylistsPanel from 'components/PlaylistsPanel';
import * as VideoActions from 'actions/VideoActions';
import * as PlaylistActions from 'actions/PlaylistActions';
import AddVideoModal from './AddVideoModal';
import AddPlaylistModal from './AddPlaylistModal';

class Contents extends Component {
  componentWillMount() {
    const { dispatch } = this.props;
    const { getVideos } = VideoActions;
    const { getPinnedPlaylists, getPlaylists } = PlaylistActions;
    dispatch(getVideos());
    dispatch(getPinnedPlaylists());
    dispatch(getPlaylists());
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    const { resetVideoState } = VideoActions;
    const { resetPlaylistState } = PlaylistActions;
    dispatch(resetVideoState());
    dispatch(resetPlaylistState());
  }

  renderPlaylistButton() {
    return (
      <div
        className="btn-group pull-right"
        style={{
          marginLeft: 'auto'
        }}
      >
        <button type="button" className="btn btn-default" onClick={ this.onButtonOneClick.bind(this) }>
          + Add Playlist
        </button>
      </div>
    )
  }

  showAddPlaylistModal() {
    const { dispatch } = this.props;
    const { openAddPlaylistModal } = PlaylistActions;
    const { getVideosForPlaylist } = VideoActions;
    dispatch(getVideosForPlaylist());
    dispatch(openAddPlaylistModal());
  }

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

      dispatch
    } = this.props;
    const { closeAddVideoModal } = VideoActions;
    return (
      <div className="container-fluid">
        <PlaylistsPanel
          key={"homeworkplaylists"}
          playlistType="pinned"
          title="Homework Playlists"
          loadMoreButton={loadMorePinnedPlaylists}
          userId={userId}
          playlists={pinnedPlaylists}
          {...bindActionCreators(PlaylistActions, dispatch)}
        />
        <PlaylistsPanel
          key={"allplaylists"}
          buttonGroupShown={isAdmin}
          buttonGroup={ this.renderPlaylistButton }
          onButtonOneClick={ this.showAddPlaylistModal.bind(this) }
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
        <AddVideoModal show={addVideoModalShown} onHide={ () => dispatch(closeAddVideoModal()) } />
        <AddPlaylistModal show={addPlaylistModalShown} />
      </div>
    );
  }
}

export default connect(
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

    addVideoModalShown: state.VideoReducer.addVideoModalShown
  })
)(Contents);
