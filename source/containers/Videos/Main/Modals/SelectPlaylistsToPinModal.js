import React, {Component, PropTypes} from 'react';
import {Modal} from 'react-bootstrap';
import Button from 'components/Button';
import CheckListGroup from 'components/CheckListGroup';
import {loadMorePlaylistListAsync, changePinnedPlaylistsAsync} from 'redux/actions/PlaylistActions';
import {connect} from 'react-redux';

@connect(
  null,
  {
    loadMorePlaylist: loadMorePlaylistListAsync,
    changePinnedPlaylists: changePinnedPlaylistsAsync
  }
)
export default class SelectPlaylistsToPinModal extends Component {
  static propTypes = {
    playlistsToPin: PropTypes.array,
    pinnedPlaylists: PropTypes.array,
    selectedPlaylists: PropTypes.array,
    loadMoreButton: PropTypes.bool,
    onHide: PropTypes.func
  }

  constructor(props) {
    super()
    this.state = {
      selectedPlaylists: props.selectedPlaylists,
      selectTabActive: true
    }
    this.onSelect = this.onSelect.bind(this)
    this.onDeselect = this.onDeselect.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  render() {
    const {selectedPlaylists, selectTabActive} = this.state;
    const {loadMoreButton, playlistsToPin, pinnedPlaylists} = this.props;
    const lastPlaylistId = playlistsToPin[playlistsToPin.length - 1].id;
    return (
      <Modal
        show
        onHide={this.props.onHide}
        animation={false}
      >
        <Modal.Header closeButton>
          <h4>Select up to 5 playlists</h4>
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
              <a>Selected</a>
            </li>
          </ul>
          <div
            className="container-fluid"
            style={{
              paddingTop: '2em'
            }}
          >
          {selectTabActive &&
            <div>
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
              {loadMoreButton &&
                <div
                  className="text-center"
                  style={{marginTop: '1em'}}
                >
                  <Button
                    className="btn btn-success"
                    onClick={() => this.loadMorePlaylists(lastPlaylistId)}
                  >Load More</Button>
                </div>
              }
              {playlistsToPin.length === 0 &&
                <div className="text-center">No Playlists</div>
              }
            </div>
          }
          {!selectTabActive &&
            <div>
              <CheckListGroup
                inputType="checkbox"
                onSelect={this.onDeselect}
                listItems={
                  selectedPlaylists.reduce((result, playlistId) => {
                    let label = '';
                    for (let i = 0; i < pinnedPlaylists.length; i++) {
                      if(pinnedPlaylists[i].id === playlistId) {
                        label = pinnedPlaylists[i].title;
                        return result.concat([{
                          label,
                          checked: true
                        }])
                      }
                    }
                    for (let i = 0; i < playlistsToPin.length; i++) {
                      if(playlistsToPin[i].id === playlistId) {
                        label = playlistsToPin[i].title;
                        return result.concat([{
                          label,
                          checked: true
                        }])
                      }
                    }
                    return result;
                  }, [])
                }
              />
              {selectedPlaylists.length === 0 &&
                <div className="text-center">No Playlist Selected</div>
              }
            </div>
          }
          </div>
        </Modal.Body>
        <Modal.Footer>
          {selectedPlaylists.length > 5 &&
            <span
              className="help-block pull-left"
              style={{color: '#843534'}}
            >
              Please limit your selection to 5 playlists
            </span>
          }
          <Button className="btn btn-default" onClick={this.props.onHide}>Cancel</Button>
          <Button
            className="btn btn-primary"
            onClick={this.onSubmit}
            disabled={selectedPlaylists.length > 5}
          >Done</Button>
        </Modal.Footer>
      </Modal>
    )
  }

  loadMorePlaylists(lastPlaylistId) {
    this.props.loadMorePlaylist(lastPlaylistId);
  }

  onSelect(index) {
    let playlistId = this.props.playlistsToPin[index].id;
    let newSelectedPlaylists;
    if (this.state.selectedPlaylists.indexOf(playlistId) === -1) {
      newSelectedPlaylists = [playlistId].concat(this.state.selectedPlaylists);
    }
    else {
      newSelectedPlaylists = this.state.selectedPlaylists.filter(id => {
        return id !== playlistId;
      })
    }
    this.setState({selectedPlaylists: newSelectedPlaylists});
  }

  onDeselect(index) {
    const {selectedPlaylists} = this.state;
    let playlistIndex = 0;
    const newSelectedPlaylists = selectedPlaylists.filter(playlist => {
      return playlistIndex++ !== index;
    })
    this.setState({selectedPlaylists: newSelectedPlaylists});
  }

  onSubmit() {
    this.props.changePinnedPlaylists(this.state.selectedPlaylists, () => this.props.onHide());
  }
}
