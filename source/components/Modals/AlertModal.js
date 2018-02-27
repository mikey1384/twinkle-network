import PropTypes from 'prop-types'
import React from 'react'
import Modal from 'components/Modal'
import Button from 'components/Button'

AlertModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired
}
export default function AlertModal({ onHide, title, content }) {
  return (
    <Modal onHide={onHide}>
      <div className="modal-heading">
        {title}
      </div>
      <div className="modal-body">
        <p>{content}</p>
      </div>
      <div className="modal-footer">
        <Button primary onClick={onHide}>
          OK
        </Button>
      </div>
    </Modal>
  )
}
