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

  constructor({ selectedPlaylists }) {
    super()
    this.state = {
      selectedPlaylists: selectedPlaylists,
      selectTabActive: true
    }
    this.onSelect = this.onSelect.bind(this)
    this.onDeselect = this.onDeselect.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  render() {
    const { selectedPlaylists, selectTabActive } = this.state
    const { loadMoreButton, playlistsToPin, pinnedPlaylists } = this.props
    const lastPlaylistId = playlistsToPin[playlistsToPin.length - 1].id
    return (
      <Modal onHide={this.props.onHide}>
        <header>Select up to 5 playlists</header>
        <main>
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
          {selectTabActive && (
            <Fragment>
              <CheckListGroup
                inputType="checkbox"
                onSelect={this.onSelect}
                listItems={playlistsToPin.map(playlist => {
                  return {
                    label: playlist.title,
                    checked: selectedPlaylists.indexOf(playlist.id) !== -1
                  }
                })}
              />
              {loadMoreButton && (
                <Button
                  style={{ marginTop: '2rem' }}
                  transparent
                  onClick={() => this.loadMorePlaylists(lastPlaylistId)}
                >
                  Load More
                </Button>
              )}
              {playlistsToPin.length === 0 && <div>No Playlists</div>}
            </Fragment>
          )}
          {!selectTabActive && (
            <Fragment>
              <CheckListGroup
                inputType="checkbox"
                onSelect={this.onDeselect}
                listItems={selectedPlaylists.reduce((result, playlistId) => {
                  let label = ''
                  for (let i = 0; i < pinnedPlaylists.length; i++) {
                    if (pinnedPlaylists[i].id === playlistId) {
                      label = pinnedPlaylists[i].title
                      return result.concat([
                        {
                          label,
                          checked: true
                        }
                      ])
                    }
                  }
                  for (let i = 0; i < playlistsToPin.length; i++) {
                    if (playlistsToPin[i].id === playlistId) {
                      label = playlistsToPin[i].title
                      return result.concat([
                        {
                          label,
                          checked: true
                        }
                      ])
                    }
                  }
                  return result
                }, [])}
              />
              {selectedPlaylists.length === 0 && (
                <div>No Playlist Selected</div>
              )}
            </Fragment>
          )}
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

  loadMorePlaylists(lastPlaylistId) {
    this.props.loadMorePlaylist(lastPlaylistId)
  }

  onSelect(index) {
    let playlistId = this.props.playlistsToPin[index].id
    let newSelectedPlaylists
    if (this.state.selectedPlaylists.indexOf(playlistId) === -1) {
      newSelectedPlaylists = [playlistId].concat(this.state.selectedPlaylists)
    } else {
      newSelectedPlaylists = this.state.selectedPlaylists.filter(id => {
        return id !== playlistId
      })
    }
    this.setState({ selectedPlaylists: newSelectedPlaylists })
  }

  onDeselect(index) {
    const { selectedPlaylists } = this.state
    let playlistIndex = 0
    const newSelectedPlaylists = selectedPlaylists.filter(playlist => {
      return playlistIndex++ !== index
    })
    this.setState({ selectedPlaylists: newSelectedPlaylists })
  }

  onSubmit() {
    const { changePinnedPlaylists, onHide } = this.props
    const { selectedPlaylists } = this.state
    return changePinnedPlaylists(selectedPlaylists).then(() => onHide())
  }
}

export default connect(null, {
  loadMorePlaylist: loadMorePlaylistListAsync,
  changePinnedPlaylists: changePinnedPlaylists
})(SelectPlaylistsToPinModal)
