import React, { Component } from 'react';
import { getVideos, resetVideoState } from 'actions/VideoActions';
import { getPinnedPlaylists, getPlaylists, resetPlaylistState } from 'actions/PlaylistActions';
import { connect } from 'react-redux';

@connect()
export default class Contents extends Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(getVideos());
    dispatch(getPinnedPlaylists());
    dispatch(getPlaylists());
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(resetVideoState());
    dispatch(resetPlaylistState());
  }

  render() {
    return (
      <div id="contents" className="container-fluid">
        {this.props.children}
      </div>
    )
  }
}
