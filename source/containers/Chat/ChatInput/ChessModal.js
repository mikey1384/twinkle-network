import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';

ChessModal.propTypes = {
  onHide: PropTypes.func.isRequired
};

export default function ChessModal({ onHide }) {
  return (
    <Modal large onHide={onHide}>
      <header>Chess</header>
      <main>body</main>
      <footer>
        <Button transparent onClick={onHide} style={{ marginRight: '0.7rem' }}>
          Cancel
        </Button>
      </footer>
    </Modal>
  );
}
