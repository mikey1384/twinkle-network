import React, { Component } from 'react';
import { getInitialVideos, resetVideoState } from 'actions/VideoActions';
import { getPinnedPlaylistsAsync, getPlaylistsAsync, resetPlaylistState } from 'actions/PlaylistActions';
import { connect } from 'react-redux';

@connect()
export default class Contents extends Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(getInitialVideos());
    dispatch(getPinnedPlaylistsAsync());
    dispatch(getPlaylistsAsync());
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
