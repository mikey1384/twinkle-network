import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';

AlertModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired
};
export default function AlertModal({ onHide, title, content }) {
  return (
    <Modal onHide={onHide}>
      <header>{title}</header>
      <main>{content}</main>
      <footer>
        <Button color="blue" onClick={onHide}>
          OK
        </Button>
      </footer>
    </Modal>
  );
}
