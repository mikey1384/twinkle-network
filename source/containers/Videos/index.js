import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import Main from './Main'
import VideoPage from './VideoPage'
import { connect } from 'react-redux'
import { getInitialVideos } from 'redux/actions/VideoActions'
import {
  getPlaylistsAsync,
  getPinnedPlaylistsAsync
} from 'redux/actions/PlaylistActions'

class Videos extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    getInitialVideos: PropTypes.func.isRequired,
    getPlaylists: PropTypes.func.isRequired,
    getPinnedPlaylists: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { getPlaylists, getPinnedPlaylists, getInitialVideos } = this.props
    getInitialVideos()
    getPlaylists()
    getPinnedPlaylists()
  }

  render() {
    const { match } = this.props
    return (
      <div>
        <Route exact path={`${match.url}`} component={Main} />
        <Route path={`${match.url}/:videoId`} component={VideoPage} />
      </div>
    )
  }
}

export default connect(null, {
  getPlaylists: getPlaylistsAsync,
  getPinnedPlaylists: getPinnedPlaylistsAsync,
  getInitialVideos
})(Videos)
