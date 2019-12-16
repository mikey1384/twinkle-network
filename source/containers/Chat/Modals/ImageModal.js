import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Modal from 'components/Modal';

ImageModal.propTypes = {
  modalOverModal: PropTypes.bool,
  onHide: PropTypes.func.isRequired,
  fileName: PropTypes.string,
  src: PropTypes.string
};

export default function ImageModal({ modalOverModal, onHide, fileName, src }) {
  return (
    <Modal modalOverModal={modalOverModal} large onHide={onHide}>
      <header>{fileName}</header>
      <main>
        <img
          style={{ maxWidth: '100%', objectFit: 'contain' }}
          src={src}
          rel={fileName}
        />
      </main>
      <footer>
        <Button color="orange" onClick={() => window.open(src)}>
          Download
        </Button>
        <Button style={{ marginLeft: '1rem' }} color="blue" onClick={onHide}>
          Close
        </Button>
      </footer>
    </Modal>
  );
}
