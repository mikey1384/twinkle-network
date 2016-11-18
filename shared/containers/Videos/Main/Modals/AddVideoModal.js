import React from 'react';
import {Modal} from 'react-bootstrap';
import AddVideoForm from './AddVideoForm';

export default function AddVideoModal(props) {
  return (
    <Modal show onHide={props.onHide} animation={false}>
      <Modal.Header closeButton>
        <h4>Add Videos</h4>
      </Modal.Header>
      <Modal.Body>
        <AddVideoForm />
      </Modal.Body>
    </Modal>
  )
}
