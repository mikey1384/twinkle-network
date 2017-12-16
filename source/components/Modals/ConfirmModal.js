import PropTypes from 'prop-types'
import React from 'react'
import { Modal, Button } from 'react-bootstrap'

ConfirmModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired
}
export default function ConfirmModal({ onHide, title, onConfirm }) {
  return (
    <Modal show onHide={onHide} animation={false}>
      <Modal.Header closeButton>
        <h4>{title}</h4>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Cancel</Button>
        <Button bsStyle="primary" onClick={() => onConfirm()}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
