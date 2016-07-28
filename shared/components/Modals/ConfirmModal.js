import React from 'react';
import {Modal, Button} from 'react-bootstrap';

export default function ConfirmModal(props) {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      animation={false}
    >
      <Modal.Header closeButton>
        <h4>{props.title}</h4>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Cancel</Button>
        <Button bsStyle="primary" onClick={() => props.onConfirm()}>Confirm</Button>
      </Modal.Footer>
    </Modal>
  )
}
