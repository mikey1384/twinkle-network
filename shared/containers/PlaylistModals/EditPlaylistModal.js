import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { closeEditPlaylistModal, getMoreVideosForModal } from 'actions/PlaylistActions';
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
          This is a Modal
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
        </Modal.Footer>
      </Modal>
    )
  }
}
