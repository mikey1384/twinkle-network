import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Mafia from '../Mafia';
import Button from 'components/Button';

MafiaModal.propTypes = {
  onHide: PropTypes.func.isRequired
};

export default function MafiaModal({ onHide }) {
  return (
    <Modal large onHide={onHide}>
      <header>Mafia</header>
      <main style={{ padding: 0 }}>
        <div>
          <Mafia />
        </div>
      </main>
      <footer>
        <Button onClick={() => onHide()}>Hold Knife</Button>
      </footer>
    </Modal>
  );
}
