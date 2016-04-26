import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import CheckListGroup from 'components/CheckListGroup';

export default class SelectPlaylistsToPinModal extends Component {
  state = {
    selectedPlaylists: this.props.selectedPlaylists,
    selectTabActive: true
  }

  render() {
    const { selectedPlaylists, selectTabActive } = this.state;
    const { loadMoreButton, playlistsToPin, pinnedPlaylists } = this.props;
    const lastPlaylistId = playlistsToPin[playlistsToPin.length - 1].id;
    return (
      <Modal {...this.props} animation={false}>
        <Modal.Header closeButton>
          <h4>Select up to 3 playlists</h4>
        </Modal.Header>
        <Modal.Body>
          <ul className="nav nav-tabs nav-justified">
            <li
              className={selectTabActive ? "active" : ""}
              onClick={() => this.setState({selectTabActive: true})}
              style={{cursor:"pointer"}}
            >
              <a>Select</a>
            </li>
            <li
              className={selectTabActive ? "" : "active"}
              onClick={() => this.setState({selectTabActive: false})}
              style={{cursor:"pointer"}}
            >
              <a>Deselect</a>
            </li>
          </ul>
          <div
            className="container-fluid"
            style={{
              paddingTop: '2em'
            }}
          >
          { selectTabActive &&
            <div>
              <CheckListGroup
                name="selectPlaylist"
                inputType="checkbox"
                onSelect={this.onSelect.bind(this)}
                listItems={
                  playlistsToPin.map(playlist => {
                    return {
                      label: playlist.title,
                      checked: selectedPlaylists.indexOf(playlist.id) !== -1 ? true : false
                    }
                  })
                }
              />
              { loadMoreButton &&
                <div
                  className="text-center"
                  style={{
                    marginTop: '1em'
                  }}
                >
                  <button
                    className="btn btn-default"
                    onClick={() => this.loadMorePlaylists(lastPlaylistId)}
                  >Load More</button>
                </div>
              }
              { playlistsToPin.length === 0 &&
                <div className="text-center">No Playlists</div>
              }
            </div>
          }
          { !selectTabActive &&
            <div>
              <CheckListGroup
                name="deselectPlaylist"
                inputType="checkbox"
                onSelect={this.onDeselect.bind(this)}
                listItems={
                  selectedPlaylists.map(playlistId => {
                    let label = '';
                    for (let i = 0; i < pinnedPlaylists.length; i++) {
                      if(pinnedPlaylists[i].id == playlistId) {
                        label = pinnedPlaylists[i].title;
                        return {
                          label,
                          checked: true
                        }
                      }
                    }
                    for (let i = 0; i < playlistsToPin.length; i++) {
                      if(playlistsToPin[i].id == playlistId) {
                        label = playlistsToPin[i].title;
                        return {
                          label,
                          checked: true
                        }
                      }
                    }
                  })
                }
              />
              { selectedPlaylists.length === 0 &&
                <div className="text-center">No Playlist Selected</div>
              }
            </div>
          }
          </div>
        </Modal.Body>
        <Modal.Footer>
          { selectedPlaylists.length > 3 &&
            <span
              className="help-block pull-left"
              style={{color: '#843534'}}
            >
              Please limit your selection to 3 playlists
            </span>
          }
          <Button onClick={this.props.onHide}>Cancel</Button>
          <Button
            bsStyle="primary"
            onClick={this.onSubmit.bind(this)}
            disabled={selectedPlaylists.length > 3 ? true : false}
          >Done</Button>
        </Modal.Footer>
      </Modal>
    )
  }

  loadMorePlaylists(lastPlaylistId) {
    this.props.loadMorePlaylistListAsync(lastPlaylistId);
  }

  onSelect(index) {
    let playlistId = this.props.playlistsToPin[index].id;
    let newSelectedPlaylists;
    if (this.state.selectedPlaylists.indexOf(playlistId) == -1) {
      newSelectedPlaylists = [playlistId].concat(this.state.selectedPlaylists);
    } else {
      newSelectedPlaylists = this.state.selectedPlaylists.filter(id => {
        return id == playlistId ? false : true;
      })
    }
    this.setState({selectedPlaylists: newSelectedPlaylists});
  }

  onDeselect(index) {
    const { selectedPlaylists } = this.state;
    let playlistIndex = 0;
    const newSelectedPlaylists = selectedPlaylists.filter(playlist => {
      return playlistIndex++ === index ? false : true;
    })
    this.setState({selectedPlaylists: newSelectedPlaylists});
  }

  onSubmit() {
    this.props.changePinnedPlaylistsAsync(this.state.selectedPlaylists, () => this.props.onHide());
  }
}
