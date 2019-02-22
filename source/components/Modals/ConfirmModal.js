import PropTypes from 'prop-types';
import React from 'react';
import Modal from 'components/Modal';
import Button from 'components/Button';

ConfirmModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired
};

export default function ConfirmModal({ onHide, title, onConfirm }) {
  return (
    <Modal onHide={onHide}>
      <header>{title}</header>
      <main style={{ fontSize: '3rem', paddingTop: 0 }}>Are you sure?</main>
      <footer>
        <Button transparent style={{ marginRight: '0.7rem' }} onClick={onHide}>
          Cancel
        </Button>
        <Button primary onClick={() => onConfirm()}>
          Confirm
        </Button>
      </footer>
    </Modal>
  );
}
