import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import SortableListGroup from 'components/SortableListGroup';

export default class ReorderPinnedPlaylistsModal extends Component {
  state = {
    playlists: this.props.pinnedPlaylists,
    playlistIds: this.props.playlistIds
  }
  render() {
    const { playlists, playlistIds } = this.state;
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
      <Modal  {...this.props} animation={false}>
        <Modal.Header closeButton>
          <h4>Reorder Pinned Playlists</h4>
        </Modal.Header>
        <Modal.Body>
          <SortableListGroup
            listItems={listItems}
            onMove={this.onMove.bind(this)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Cancel</Button>
          <Button
            bsStyle="primary"
            onClick={this.onSubmit.bind(this)}
          >Done</Button>
        </Modal.Footer>
      </Modal>
    )
  }

  onMove({sourceId, targetId}) {
    const { playlistIds } = this.state;
    const sourceIndex = playlistIds.indexOf(sourceId);
    const targetIndex = playlistIds.indexOf(targetId);
    playlistIds.splice(sourceIndex, 1);
    playlistIds.splice(targetIndex, 0, sourceId);
    this.setState({
      playlistIds
    });
  }

  onSubmit() {
    this.props.changePinnedPlaylistsAsync(this.state.playlistIds, () => this.props.onHide());
  }
}
