import React, {Component, PropTypes} from 'react'
import PlaylistCarousel from '../Carousels/PlaylistCarousel'
import {connect} from 'react-redux'
import {getMorePlaylistsAsync} from 'redux/actions/PlaylistActions'
import SectionPanel from 'components/SectionPanel'

const last = array => {
  return array[array.length - 1]
}

@connect(
  null,
  {getMorePlaylistsAsync}
)
export default class PlaylistsPanel extends Component {
  static propTypes = {
    playlists: PropTypes.array.isRequired,
    userId: PropTypes.number,
    title: PropTypes.string,
    buttonGroup: PropTypes.func,
    buttonGroupShown: PropTypes.bool,
    loadMoreButton: PropTypes.bool,
    loaded: PropTypes.bool,
    getMorePlaylistsAsync: PropTypes.func
  }

  constructor() {
    super()
    this.loadMorePlaylists = this.loadMorePlaylists.bind(this)
  }

  render() {
    const {loadMoreButton, playlists, userId, buttonGroupShown = true, buttonGroup, loaded, title = 'All Playlists'} = this.props
    let buttonGroupElement = buttonGroupShown ? buttonGroup() : null
    return (
      <SectionPanel
        title={title}
        button={buttonGroupElement}
        emptyMessage="No Videos"
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
            />
          )
        })}
      </SectionPanel>
    )
  }

  loadMorePlaylists() {
    const {playlists, getMorePlaylistsAsync} = this.props
    const lastId = last(playlists).id
    getMorePlaylistsAsync(lastId)
  }
}
