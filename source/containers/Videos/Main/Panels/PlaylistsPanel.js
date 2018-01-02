import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import PlaylistCarousel from '../Carousels/PlaylistCarousel'
import { connect } from 'react-redux'
import { getMorePlaylistsAsync } from 'redux/actions/PlaylistActions'
import SectionPanel from 'components/SectionPanel'
import { queryStringForArray } from 'helpers/apiHelpers'

class PlaylistsPanel extends Component {
  static propTypes = {
    buttonGroup: PropTypes.func,
    buttonGroupShown: PropTypes.bool,
    getMorePlaylistsAsync: PropTypes.func.isRequired,
    loaded: PropTypes.bool.isRequired,
    loadMoreButton: PropTypes.bool,
    loadPlaylists: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    onSearch: PropTypes.func,
    playlists: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    userId: PropTypes.number
  }

  constructor() {
    super()
    this.loadMorePlaylists = this.loadMorePlaylists.bind(this)
  }

  componentDidMount() {
    const { loadPlaylists, location, loaded } = this.props
    if (location.action === 'PUSH' || !loaded) {
      loadPlaylists()
    }
  }

  render() {
    const {
      loadMoreButton,
      playlists,
      userId,
      buttonGroupShown = true,
      buttonGroup,
      loaded,
      onSearch,
      title = 'All Playlists'
    } = this.props
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
        onSearch={onSearch}
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
    const { playlists, getMorePlaylistsAsync } = this.props
    return getMorePlaylistsAsync(
      queryStringForArray(playlists, 'id', 'shownPlaylists')
    )
  }
}

export default connect(null, { getMorePlaylistsAsync })(
  withRouter(PlaylistsPanel)
)
