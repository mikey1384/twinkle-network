import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import Modal from 'components/Modal'
import Button from 'components/Button'
import CheckListGroup from 'components/CheckListGroup'
import {
  loadMorePlaylistListAsync,
  changePinnedPlaylists
} from 'redux/actions/PlaylistActions'
import FilterBar from 'components/FilterBar'
import Banner from 'components/Banner'
import SearchInput from 'components/Texts/SearchInput'
import request from 'axios'
import { URL } from 'constants/URL'
import { connect } from 'react-redux'

class SelectPlaylistsToPinModal extends Component {
  static propTypes = {
    changePinnedPlaylists: PropTypes.func.isRequired,
    loadMoreButton: PropTypes.bool.isRequired,
    loadMorePlaylist: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired,
    playlistsToPin: PropTypes.array.isRequired,
    pinnedPlaylists: PropTypes.array.isRequired,
    selectedPlaylists: PropTypes.array.isRequired
  }

  state = {
    selectTabActive: true,
    selectedPlaylists: [],
    searchedPlaylists: [],
    searchText: '',
    playlistObjects: {}
  }

  componentDidMount() {
    const { pinnedPlaylists, playlistsToPin, selectedPlaylists } = this.props
    this.setState({
      selectedPlaylists,
      playlistObjects: {
        ...pinnedPlaylists.reduce(
          (prev, playlist) => ({ ...prev, [playlist.id]: playlist.title }),
          {}
        ),
        ...playlistsToPin.reduce(
          (prev, playlist) => ({ ...prev, [playlist.id]: playlist.title }),
          {}
        )
      }
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.playlistsToPin !== this.props.playlistsToPin) {
      this.setState(state => ({
        playlistObjects: {
          ...state.playlistObjects,
          ...this.props.playlistsToPin.reduce(
            (prev, playlist) => ({ ...prev, [playlist.id]: playlist.title }),
            {}
          )
        }
      }))
    }
  }

  render() {
    const {
      playlistObjects,
      searchText,
      selectedPlaylists,
      selectTabActive
    } = this.state
    const { loadMoreButton, playlistsToPin } = this.props
    const lastPlaylistId = playlistsToPin[playlistsToPin.length - 1].id
    return (
      <Modal onHide={this.props.onHide}>
        <header>Select up to 5 playlists</header>
        <main style={{ paddingTop: 0 }}>
          {selectedPlaylists.length > 5 && (
            <Banner love>Please limit your selection to 5 playlists</Banner>
          )}
          <FilterBar>
            <nav
              className={selectTabActive ? 'active' : ''}
              onClick={() => this.setState({ selectTabActive: true })}
              style={{ cursor: 'pointer' }}
            >
              <a>Select</a>
            </nav>
            <nav
              className={selectTabActive ? '' : 'active'}
              onClick={() => this.setState({ selectTabActive: false })}
              style={{ cursor: 'pointer' }}
            >
              <a>Selected</a>
            </nav>
          </FilterBar>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            {selectTabActive && (
              <Fragment>
                <SearchInput
                  autoFocus
                  placeholder="Search for playlists to pin"
                  value={searchText}
                  onChange={this.onPlaylistSearchInput}
                />
                <CheckListGroup
                  style={{ marginTop: '1rem' }}
                  inputType="checkbox"
                  onSelect={this.onSelect}
                  listItems={this.renderListItems()}
                />
                {loadMoreButton && (
                  <Button
                    style={{ marginTop: '2rem', width: '100%' }}
                    transparent
                    onClick={() => this.loadMorePlaylists(lastPlaylistId)}
                  >
                    Load More
                  </Button>
                )}
                {playlistsToPin.length === 0 && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      height: '8rem',
                      justifyContent: 'center'
                    }}
                  >
                    <h3>No Playlists</h3>
                  </div>
                )}
              </Fragment>
            )}
            {!selectTabActive && (
              <Fragment>
                <CheckListGroup
                  inputType="checkbox"
                  onSelect={this.onDeselect}
                  listItems={selectedPlaylists.map(playlistId => ({
                    label: playlistObjects[playlistId],
                    checked: true
                  }))}
                />
                {selectedPlaylists.length === 0 && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      height: '8rem',
                      justifyContent: 'center'
                    }}
                  >
                    <h3>No Playlist Selected</h3>
                  </div>
                )}
              </Fragment>
            )}
          </div>
        </main>
        <footer>
          <Button
            primary
            onClick={this.onSubmit}
            disabled={selectedPlaylists.length > 5}
          >
            Done
          </Button>
          <Button
            transparent
            style={{ marginRight: '1rem' }}
            onClick={this.props.onHide}
          >
            Cancel
          </Button>
        </footer>
      </Modal>
    )
  }

  loadMorePlaylists = lastPlaylistId => {
    this.props.loadMorePlaylist(lastPlaylistId)
  }

  onPlaylistSearchInput = async text => {
    this.setState({ searchText: text })
    const { data } = await request.get(
      `${URL}/playlist/search/toPin?query=${text}`
    )
    this.setState(state => ({
      searchedPlaylists: data,
      playlistObjects: {
        ...state.playlistObjects,
        ...data.reduce(
          (prev, playlist) => ({ ...prev, [playlist.id]: playlist.title }),
          {}
        )
      }
    }))
  }

  onSelect = index => {
    const { searchText, searchedPlaylists } = this.state
    const { playlistsToPin } = this.props
    const playlists = searchText ? searchedPlaylists : playlistsToPin
    let playlistId = playlists[index].id
    this.setState(state => ({
      selectedPlaylists:
        state.selectedPlaylists.indexOf(playlistId) === -1
          ? [playlistId].concat(state.selectedPlaylists)
          : state.selectedPlaylists.filter(id => id !== playlistId)
    }))
  }

  onDeselect = index => {
    const { selectedPlaylists } = this.state
    let playlistIndex = 0
    const newSelectedPlaylists = selectedPlaylists.filter(playlist => {
      return playlistIndex++ !== index
    })
    this.setState({ selectedPlaylists: newSelectedPlaylists })
  }

  onSubmit = () => {
    const { changePinnedPlaylists, onHide } = this.props
    const { selectedPlaylists } = this.state
    return changePinnedPlaylists(selectedPlaylists).then(() => onHide())
  }

  renderListItems = () => {
    const { playlistsToPin } = this.props
    const { searchText, searchedPlaylists, selectedPlaylists } = this.state
    const playlists = searchText ? searchedPlaylists : playlistsToPin
    return playlists.map(playlist => {
      return {
        label: playlist.title,
        checked: selectedPlaylists.indexOf(playlist.id) !== -1
      }
    })
  }
}

export default connect(null, {
  loadMorePlaylist: loadMorePlaylistListAsync,
  changePinnedPlaylists: changePinnedPlaylists
})(SelectPlaylistsToPinModal)
