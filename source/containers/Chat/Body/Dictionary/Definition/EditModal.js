import React from 'react';
import Modal from 'components/Modal';
import PropTypes from 'prop-types';

EditModal.propTypes = {
  onHide: PropTypes.func.isRequired
};

export default function EditModal({ onHide }) {
  return (
    <Modal large onHide={onHide}>
      <header>Edit Definitions</header>
      <main>this is main</main>
      <footer>this is footer</footer>
    </Modal>
  );
}
