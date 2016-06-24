import React, {Component} from 'react';
import {getInitialVideos, resetVideoState} from 'redux/actions/VideoActions';
import {getPinnedPlaylistsAsync, getPlaylistsAsync, resetPlaylistState} from 'redux/actions/PlaylistActions';
import {connect} from 'react-redux';

@connect(
  null,
  {
    getInitialVideos,
    resetVideoState,
    resetPlaylistState,
    getPinnedPlaylists: getPinnedPlaylistsAsync,
    getPlaylists: getPlaylistsAsync
  }
)
export default class Contents extends Component {
  componentWillMount() {
    this.props.getInitialVideos();
    this.props.getPinnedPlaylists();
    this.props.getPlaylists();
  }

  componentWillUnmount() {
    this.props.resetVideoState();
    this.props.resetPlaylistState();
  }

  render() {
    return (
      <div id="contents" className="container-fluid">
        {this.props.children}
      </div>
    )
  }
}
