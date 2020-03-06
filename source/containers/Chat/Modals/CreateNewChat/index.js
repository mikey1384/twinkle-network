import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import RegularMenu from './RegularMenu';
import TeacherMenu from './TeacherMenu';
import { useMyState } from 'helpers/hooks';

CreateNewChatModal.propTypes = {
  onDone: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired
};

export default function CreateNewChatModal({ onHide, onDone }) {
  const { userId, authLevel } = useMyState();
  return (
    <Modal onHide={onHide}>
      {authLevel > 2 ? (
        <TeacherMenu userId={userId} onHide={onHide} />
      ) : (
        <RegularMenu userId={userId} onHide={onHide} onDone={onDone} />
      )}
    </Modal>
  );
}
