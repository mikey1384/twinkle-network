import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import { Color } from 'constants/css';

AccountTypeModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  target: PropTypes.number
};

export default function AccountTypeModal({ onHide, target }) {
  return (
    <Modal onHide={onHide}>
      <header style={{ display: 'block' }}>
        <div>Change account type:</div>
        <div style={{ marginTop: '1rem', color: Color.logoBlue() }}>
          {target.username}
        </div>
      </header>
      <main>{target.username}</main>
      <footer>
        <Button color="blue" onClick={onHide}>
          CONFIRM
        </Button>
      </footer>
    </Modal>
  );
}
