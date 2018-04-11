import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { getInitialVideos, resetVideoState } from 'redux/actions/VideoActions'
import {
  getPlaylists,
  getPinnedPlaylists,
  resetPlaylistState
} from 'redux/actions/PlaylistActions'
import Loading from 'components/Loading'
import loadable from 'loadable-components'
const Main = loadable(() => import('./Main'), {
  LoadingComponent: Loading
})
const VideoPage = loadable(() => import('./VideoPage'), {
  LoadingComponent: Loading
})

class Videos extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    getInitialVideos: PropTypes.func.isRequired,
    getPlaylists: PropTypes.func.isRequired,
    getPinnedPlaylists: PropTypes.func.isRequired,
    resetPlaylistState: PropTypes.func.isRequired,
    resetVideoState: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { getPlaylists, getPinnedPlaylists, getInitialVideos } = this.props
    getInitialVideos()
    getPlaylists()
    getPinnedPlaylists()
  }

  componentWillUnmount() {
    const { resetPlaylistState, resetVideoState } = this.props
    resetPlaylistState()
    resetVideoState()
  }

  render() {
    const { match } = this.props
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <Route exact path={`${match.url}`} component={Main} />
        <Route path={`${match.url}/:videoId`} component={VideoPage} />
      </div>
    )
  }
}

export default connect(null, {
  getPlaylists,
  getPinnedPlaylists,
  getInitialVideos,
  resetPlaylistState,
  resetVideoState
})(Videos)
