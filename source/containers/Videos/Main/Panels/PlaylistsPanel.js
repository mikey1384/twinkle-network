import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import PlaylistCarousel from '../Carousels/PlaylistCarousel'
import SectionPanel from 'components/SectionPanel'
import { queryStringForArray } from 'helpers/stringHelpers'
import { getMorePlaylistsAsync } from 'redux/actions/PlaylistActions'
import { connect } from 'react-redux'

class PlaylistsPanel extends Component {
  static propTypes = {
    buttonGroup: PropTypes.func,
    buttonGroupShown: PropTypes.bool,
    isSearching: PropTypes.bool,
    getMorePlaylistsAsync: PropTypes.func.isRequired,
    loaded: PropTypes.bool.isRequired,
    loadMoreButton: PropTypes.bool,
    location: PropTypes.object.isRequired,
    onSearch: PropTypes.func,
    playlists: PropTypes.array.isRequired,
    searchQuery: PropTypes.string,
    title: PropTypes.string.isRequired,
    userId: PropTypes.number
  }

  render() {
    const {
      isSearching,
      loadMoreButton,
      playlists,
      userId,
      buttonGroupShown = true,
      buttonGroup,
      loaded,
      onSearch,
      searchQuery,
      title = 'All Playlists'
    } = this.props
    let buttonGroupElement = buttonGroupShown ? buttonGroup() : null
    return (
      <SectionPanel
        title={title}
        button={buttonGroupElement}
        searchPlaceholder="Search playlists"
        emptyMessage="No Playlists"
        isEmpty={playlists.length === 0}
        loaded={loaded}
        loadMoreButtonShown={loadMoreButton}
        loadMore={this.loadMorePlaylists}
        isSearching={isSearching}
        onSearch={onSearch}
        searchQuery={searchQuery}
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

  loadMorePlaylists = () => {
    const { playlists, getMorePlaylistsAsync } = this.props
    return getMorePlaylistsAsync(
      queryStringForArray(playlists, 'id', 'shownPlaylists')
    )
  }
}

export default connect(null, { getMorePlaylistsAsync })(
  withRouter(PlaylistsPanel)
)
