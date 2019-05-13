import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Chess from './Chess';
import { Color } from 'constants/css';
import { fetchCurrentChessState } from 'helpers/requestHelpers';

ChessModal.propTypes = {
  channelId: PropTypes.number,
  myId: PropTypes.number,
  onConfirmChessMove: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  opponentId: PropTypes.number
};

export default function ChessModal({
  channelId,
  myId,
  onConfirmChessMove,
  onHide,
  opponentId
}) {
  const [loading, setLoading] = useState(true);
  const [initialState, setInitialState] = useState();
  useEffect(() => {
    init();
    async function init() {
      const { chessState } = await fetchCurrentChessState(channelId);
      setInitialState(chessState);
      setLoading(false);
    }
  }, []);
  return (
    <Modal large onHide={onHide}>
      <header>Chess</header>
      <main style={{ backgroundColor: Color.gray() }}>
        <Chess
          interactable
          initialState={initialState}
          loading={loading}
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
