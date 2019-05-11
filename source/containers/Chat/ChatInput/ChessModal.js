import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Chess from '../Chess';
import { Color } from 'constants/css';

ChessModal.propTypes = {
  myId: PropTypes.number,
  onConfirmChessMove: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  opponentId: PropTypes.number
};

export default function ChessModal({
  myId,
  onConfirmChessMove,
  onHide,
  opponentId
}) {
  return (
    <Modal large onHide={onHide}>
      <header>Chess</header>
      <main style={{ backgroundColor: Color.gray() }}>
        <Chess
          myColor="white"
          myId={myId}
          onConfirmChessMove={onConfirmChessMove}
          opponentId={opponentId}
        />
      </main>
      <footer>
        <Button transparent onClick={onHide} style={{ marginRight: '0.7rem' }}>
          Cancel
        </Button>
      </footer>
    </Modal>
  );
}
