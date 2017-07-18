import PropTypes from 'prop-types'
import React from 'react'
import {Modal} from 'react-bootstrap'
import Button from 'components/Button'

AlertModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired
}
export default function AlertModal({onHide, title, content}) {
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
        <p>{content}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn btn-primary" onClick={onHide}>OK</Button>
      </Modal.Footer>
    </Modal>
  )
}
