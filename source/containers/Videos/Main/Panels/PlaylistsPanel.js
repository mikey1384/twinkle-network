import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import PlaylistCarousel from '../Carousels/PlaylistCarousel'
import {connect} from 'react-redux'
import {getMorePlaylistsAsync} from 'redux/actions/PlaylistActions'
import SectionPanel from 'components/SectionPanel'

@withRouter
@connect(
  null,
  {getMorePlaylistsAsync}
)
export default class PlaylistsPanel extends Component {
  static propTypes = {
    location: PropTypes.object,
    playlists: PropTypes.array.isRequired,
    userId: PropTypes.number,
    title: PropTypes.string,
    buttonGroup: PropTypes.func,
    buttonGroupShown: PropTypes.bool,
    loadMoreButton: PropTypes.bool,
    loaded: PropTypes.bool,
    loadPlaylists: PropTypes.func,
    getMorePlaylistsAsync: PropTypes.func
  }

  constructor() {
    super()
    this.loadMorePlaylists = this.loadMorePlaylists.bind(this)
  }

  componentDidMount() {
    const {loadPlaylists, location, loaded} = this.props
    if (location.action === 'PUSH' || !loaded) {
      loadPlaylists()
    }
  }

  render() {
    const {loadMoreButton, playlists, userId, buttonGroupShown = true, buttonGroup, loaded, title = 'All Playlists'} = this.props
    let buttonGroupElement = buttonGroupShown ? buttonGroup() : null
    return (
      <SectionPanel
        title={title}
        button={buttonGroupElement}
        emptyMessage="No Playlists"
        isEmpty={playlists.length === 0}
        loaded={loaded}
        loadMoreButtonShown={loadMoreButton}
        loadMore={this.loadMorePlaylists}
      >
        {playlists.map((playlist, index) => {
          const editable = userId === playlist.uploaderId
          return (
            <PlaylistCarousel
              key={index}
              arrayIndex={index}
              {...playlist}
              editable={editable}
              showAllButton={playlist.showAllButton}
            />
          )
        })}
      </SectionPanel>
    )
  }

  loadMorePlaylists() {
    const {playlists, getMorePlaylistsAsync} = this.props
    return getMorePlaylistsAsync(playlists.map(playlist => playlist.id))
  }
}
