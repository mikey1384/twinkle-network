import React, {PropTypes} from 'react'
import {Modal} from 'react-bootstrap'
import AddVideoForm from './AddVideoForm'

AddVideoModal.propTypes = {
  onHide: PropTypes.func
}
export default function AddVideoModal({onHide}) {
  return (
    <Modal show onHide={onHide} animation={false}>
      <Modal.Header closeButton>
        <h4>Add Videos</h4>
      </Modal.Header>
      <Modal.Body>
        <AddVideoForm />
      </Modal.Body>
    </Modal>
  )
}
