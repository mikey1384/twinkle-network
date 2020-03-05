import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import RegularChat from './RegularChat';

CreateNewChatModal.propTypes = {
  onDone: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired
};

export default function CreateNewChatModal({ userId, onHide, onDone }) {
  return (
    <Modal onHide={onHide}>
      <RegularChat userId={userId} onHide={onHide} onDone={onDone} />
    </Modal>
  );
}
