import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import AddVideoForm from './AddVideoForm';

class AddVideoModal extends Component {
  render() {
    return (
      <Modal {...this.props} animation={false}>
        <Modal.Header closeButton>
          <h4>Add Videos</h4>
        </Modal.Header>
        <Modal.Body>
          <AddVideoForm />
        </Modal.Body>
      </Modal>
    )
  }
}

export default AddVideoModal;
