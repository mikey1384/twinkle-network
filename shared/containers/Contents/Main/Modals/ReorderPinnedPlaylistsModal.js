import React, {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';
import SortableListGroup from 'components/SortableListGroup';
import {connect} from 'react-redux';
import {changePinnedPlaylistsAsync} from 'redux/actions/PlaylistActions';

@connect(
  null,
  {changePinnedPlaylists: changePinnedPlaylistsAsync}
)
export default class ReorderPinnedPlaylistsModal extends Component {
  constructor(props) {
    super()
    this.state = {
      playlists: props.pinnedPlaylists,
      playlistIds: props.playlistIds
    }
    this.onMove = this.onMove.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  render() {
    const {playlists, playlistIds} = this.state;
    const listItems = playlistIds.map(playlistId => {
      for (let i = 0; i < playlists.length; i ++) {
        if (playlists[i].id === playlistId) {
          return {
            label: playlists[i].title,
            id: playlistId
          }
        }
      }
    })
    return (
      <Modal
        show
        onHide={this.props.onHide}
        animation={false}
      >
        <Modal.Header closeButton>
          <h4>Reorder Pinned Playlists</h4>
        </Modal.Header>
        <Modal.Body>
          <SortableListGroup
            listItems={listItems}
            onMove={this.onMove}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Cancel</Button>
          <Button
            bsStyle="primary"
            onClick={this.onSubmit}
          >Done</Button>
        </Modal.Footer>
      </Modal>
    )
  }

  onMove({sourceId, targetId}) {
    const {playlistIds} = this.state;
    const sourceIndex = playlistIds.indexOf(sourceId);
    const targetIndex = playlistIds.indexOf(targetId);
    playlistIds.splice(sourceIndex, 1);
    playlistIds.splice(targetIndex, 0, sourceId);
    this.setState({
      playlistIds
    });
  }

  onSubmit() {
    this.props.changePinnedPlaylists(this.state.playlistIds, () => this.props.onHide());
  }
}
