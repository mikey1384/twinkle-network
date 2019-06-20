import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';

UploadModal.propTypes = {
  onHide: PropTypes.func.isRequired
};

export default function UploadModal({ onHide }) {
  return (
    <Modal large onHide={onHide}>
      <header>Upload a file</header>
      <main>this is an upload modal</main>
      <footer>close</footer>
    </Modal>
  );
}
