import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import PlaylistCarousel from '../Carousels/PlaylistCarousel'
import SectionPanel from 'components/SectionPanel'
import { queryStringForArray, stringIsEmpty } from 'helpers/stringHelpers'
import { getMorePlaylists } from 'redux/actions/PlaylistActions'
import { connect } from 'react-redux'

class PlaylistsPanel extends Component {
  static propTypes = {
    buttonGroup: PropTypes.func,
    buttonGroupShown: PropTypes.bool,
    isSearching: PropTypes.bool,
    getMorePlaylists: PropTypes.func.isRequired,
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
        loadMoreButtonShown={stringIsEmpty(searchQuery) && loadMoreButton}
        loadMore={this.loadMorePlaylists}
        isSearching={isSearching}
        onSearch={onSearch}
        searchQuery={searchQuery}
      >
        {playlists.map((playlist, index) => {
          return (
            <PlaylistCarousel
              {...playlist}
              key={index}
              arrayIndex={index}
              userIsUploader={userId === playlist.uploaderId}
              showAllButton={playlist.showAllButton}
            />
          )
        })}
      </SectionPanel>
    )
  }

  loadMorePlaylists = () => {
    const { playlists, getMorePlaylists } = this.props
    return getMorePlaylists(
      queryStringForArray(playlists, 'id', 'shownPlaylists')
    )
  }
}

export default connect(
  null,
  { getMorePlaylists }
)(withRouter(PlaylistsPanel))
