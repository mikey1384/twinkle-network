import React, {Component, PropTypes} from 'react'
import PlaylistCarousel from '../Carousels/PlaylistCarousel'
import {connect} from 'react-redux'
import Button from 'components/Button'
import {getMorePlaylistsAsync} from 'redux/actions/PlaylistActions'
import Loading from 'components/Loading'

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
    const {loadMoreButton, playlists, buttonGroupShown = true, buttonGroup, loaded, title = 'All Playlists'} = this.props
    return (
      <div className="panel panel-primary">
        <div className="panel-heading flexbox-container">
          <h3 className="panel-title pull-left">{title}</h3>
          {buttonGroupShown &&
            buttonGroup()
          }
        </div>
        <div className="panel-body">
          {this.renderPlaylists()}
          {playlists.length === 0 && (
            loaded ? <div className="text-center">No Playlists</div> : <Loading />
          )}
          {loadMoreButton &&
            <div className="text-center">
              <Button className="btn btn-success" onClick={this.loadMorePlaylists}>Load More</Button>
            </div>
          }
        </div>
      </div>
    )
  }

  renderPlaylists() {
    const {playlists, userId} = this.props
    return playlists.map((playlist, index) => {
      const editable = userId === playlist.uploaderId
      return (
        <PlaylistCarousel
          key={index}
          arrayIndex={index}
          {...playlist}
          editable={editable}
        />
      )
    })
  }

  loadMorePlaylists() {
    const {playlists, getMorePlaylistsAsync} = this.props
    const lastId = last(playlists).id
    getMorePlaylistsAsync(lastId)
  }
}
