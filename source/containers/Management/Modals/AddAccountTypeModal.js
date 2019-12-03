import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Modal from 'components/Modal';

AddAccountTypeModal.propTypes = {
  onHide: PropTypes.func.isRequired
};

export default function AddAccountTypeModal({ onHide }) {
  return (
    <Modal onHide={onHide}>
      <header>Add a New Account Type</header>
      <main>Add a New Account Type</main>
      <footer>
        <Button transparent onClick={onHide} style={{ marginRight: '0.7rem' }}>
          Cancel
        </Button>
        <Button color="blue" onClick={() => console.log('clicked')}>
          Done
        </Button>
      </footer>
    </Modal>
  );
}
