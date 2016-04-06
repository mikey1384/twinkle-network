import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AddVideoForm from 'components/AddVideoForm';
import * as VideoActions from 'actions/VideoActions';

class AddVideoModal extends Component {
  render() {
    const { dispatch, addVideoError } = this.props;
    return (
      <Modal {...this.props} animation={false}>
        <Modal.Header closeButton>
          <h4>Add Videos</h4>
        </Modal.Header>
        <Modal.Body>
          <AddVideoForm
            {...bindActionCreators(VideoActions, dispatch)}
          />
        </Modal.Body>
      </Modal>
    )
  }
}

export default connect()(AddVideoModal);
