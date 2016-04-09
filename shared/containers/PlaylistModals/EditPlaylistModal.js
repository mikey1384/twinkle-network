import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { closeEditPlaylistModal, changePlaylistVideos, getMoreVideosForModal } from 'actions/PlaylistActions';
import SelectVideosForm from './SelectVideosForm';

@connect(
  state => ({
    modalType: state.PlaylistReducer.editPlaylistModalType,
    videos: state.PlaylistReducer.videoThumbsForModal,
    loadMoreVideosButton: state.PlaylistReducer.loadMoreButtonForModal
  })
)
export default class EditPlaylistModal extends Component {
  state = {
    selectedVideos: this.props.selectedVideos
  }
  handleHide() {
    this.props.onHide();
  }
  handleSave() {
    const { selectedVideos } = this.state;
    const { playlistId, dispatch } = this.props;
    dispatch(changePlaylistVideos(playlistId, selectedVideos));
    this.props.onHide();
  }
  render() {
    const { modalType, videos, loadMoreVideosButton,  dispatch } = this.props;
    const { selectedVideos } = this.state;
    const last = (array) => {
      return array[array.length - 1];
    };
    const lastId = last(videos) ? last(videos).id : 0;
    const loadMoreVideos = () => {
      dispatch(getMoreVideosForModal(lastId));
    }
    return (
      <Modal
        {...this.props}
        animation={false}
        backdrop="static"
        dialogClassName="modal-extra-lg"
        onHide={this.handleHide.bind(this)}
      >
        <Modal.Header closeButton>
          <h4>Add or Remove Videos</h4>
        </Modal.Header>
        <Modal.Body>
          <SelectVideosForm
            videos={videos}
            selectedVideos={selectedVideos}
            loadMoreVideosButton={loadMoreVideosButton}
            onSelect={(selected, videoId) => this.setState({ selectedVideos: selected.concat([videoId]) })}
            onDeselect={selected => this.setState({ selectedVideos: selected })}
            loadMoreVideos={loadMoreVideos}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleHide.bind(this)}>Cancel</Button>
          <Button
            bsStyle="primary"
            onClick={this.handleSave.bind(this)}
            disabled={this.state.selectedVideos.length < 2 ? true : false}
          >
            Save</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
