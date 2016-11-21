import React from 'react';
import {Modal, Button} from 'react-bootstrap';

export default function ConfirmModal({onHide, title, onConfirm}) {
  return (
    <Modal
      show
      onHide={onHide}
      animation={false}
    >
      <Modal.Header closeButton>
        <h4>{title}</h4>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Cancel</Button>
        <Button bsStyle="primary" onClick={() => onConfirm()}>Confirm</Button>
      </Modal.Footer>
    </Modal>
  )
}
