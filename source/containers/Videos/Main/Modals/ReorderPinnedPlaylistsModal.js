import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Modal from 'components/Modal';
import Button from 'components/Button';
import SortableListGroup from 'components/SortableListGroup';
import { connect } from 'react-redux';
import { changePinnedPlaylists } from 'redux/actions/PlaylistActions';
import { isEqual } from 'lodash';

class ReorderPinnedPlaylistsModal extends Component {
  static propTypes = {
    pinnedPlaylists: PropTypes.array.isRequired,
    playlistIds: PropTypes.array.isRequired,
    onHide: PropTypes.func.isRequired,
    changePinnedPlaylists: PropTypes.func.isRequired
  };

  constructor(props) {
    super();
    this.state = {
      playlists: props.pinnedPlaylists,
      playlistIds: props.playlistIds
    };
  }

  render() {
    const { playlists, playlistIds } = this.state;
    const listItems = playlistIds.reduce((result, playlistId) => {
      for (let i = 0; i < playlists.length; i++) {
        if (playlists[i].id === playlistId) {
          result.push({
            label: playlists[i].title,
            id: playlistId
          });
        }
      }
      return result;
    }, []);
    return (
      <Modal onHide={this.props.onHide}>
        <header>Reorder Pinned Playlists</header>
        <main>
          <SortableListGroup listItems={listItems} onMove={this.onMove} />
        </main>
        <footer>
          <Button
            disabled={isEqual(
              playlistIds,
              playlists.map(playlist => playlist.id)
            )}
            primary
            onClick={this.onSubmit}
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
    );
  }

  onMove = ({ sourceId, targetId }) => {
    const { playlistIds } = this.state;
    const sourceIndex = playlistIds.indexOf(sourceId);
    const targetIndex = playlistIds.indexOf(targetId);
    playlistIds.splice(sourceIndex, 1);
    playlistIds.splice(targetIndex, 0, sourceId);
    this.setState({
      playlistIds
    });
  };

  onSubmit = () => {
    const { changePinnedPlaylists, onHide } = this.props;
    const { playlistIds } = this.state;
    return changePinnedPlaylists(playlistIds).then(() => onHide());
  };
}

export default connect(
  null,
  { changePinnedPlaylists }
)(ReorderPinnedPlaylistsModal);
