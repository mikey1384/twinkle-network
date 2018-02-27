import PropTypes from 'prop-types'
import React from 'react'
import Modal from 'components/Modal'
import Button from 'components/Button'

ConfirmModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired
}
export default function ConfirmModal({ onHide, title, onConfirm }) {
  return (
    <Modal onHide={onHide}>
      <div className="modal-heading">
        <h4>{title}</h4>
      </div>
      <div className="modal-body" style={{ fontSize: '3rem', paddingTop: 0 }}>
        Are you sure?
      </div>
      <div className="modal-footer">
        <Button primary onClick={() => onConfirm()}>
          Confirm
        </Button>
        <Button transparent style={{ marginRight: '1rem' }} onClick={onHide}>
          Cancel
        </Button>
      </div>
    </Modal>
  )
}
