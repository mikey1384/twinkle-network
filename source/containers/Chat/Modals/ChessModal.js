import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Chess from '../Chess';
import { updateChessMoveViewTimeStamp } from 'redux/actions/ChatActions';
import { Color } from 'constants/css';
import {
  fetchCurrentChessState,
  setChessMoveViewTimeStamp
} from 'helpers/requestHelpers';
import { connect } from 'react-redux';

ChessModal.propTypes = {
  channelId: PropTypes.number,
  dispatch: PropTypes.func,
  myId: PropTypes.number,
  onConfirmChessMove: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  opponentId: PropTypes.number,
  opponentName: PropTypes.string,
  updateChessMoveViewTimeStamp: PropTypes.func.isRequired
};

function ChessModal({
  channelId,
  dispatch,
  myId,
  onConfirmChessMove,
  onHide,
  opponentId,
  opponentName,
  updateChessMoveViewTimeStamp
}) {
  const [loading, setLoading] = useState(true);
  const [initialState, setInitialState] = useState();
  const [spoilerOn, setSpoilerOn] = useState(true);
  const [viewTimeStamp, setViewTimeStamp] = useState();
  const [messageId, setMessageId] = useState();
  useEffect(() => {
    init();
    async function init() {
      const {
        messageId,
        chessState,
        moveViewTimeStamp
      } = await fetchCurrentChessState(channelId);
      setMessageId(messageId);
      setInitialState(chessState);
      setViewTimeStamp(moveViewTimeStamp);
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
          onConfirmChessMove={handleConfirmChessMove}
          opponentId={opponentId}
          opponentName={opponentName}
          spoilerOn={handleSpoilerOn()}
          onSpoilerClick={handleSpoilerClick}
        />
      </main>
      <footer>
        <Button transparent onClick={onHide} style={{ marginRight: '0.7rem' }}>
          Cancel
        </Button>
      </footer>
    </Modal>
  );

  function handleConfirmChessMove(json) {
    console.log(json);
  }

  async function handleSpoilerClick() {
    await setChessMoveViewTimeStamp({ channelId, dispatch });
    setSpoilerOn(false);
    updateChessMoveViewTimeStamp(messageId);
  }

  function handleSpoilerOn() {
    if (spoilerOn && initialState) {
      const userMadeLastMove = JSON.parse(initialState).lastMoveBy === myId;
      if (!userMadeLastMove && !viewTimeStamp) {
        return true;
      }
    }
    return false;
  }
}

export default connect(
  null,
  dispatch => ({
    dispatch,
    updateChessMoveViewTimeStamp: messageId =>
      dispatch(updateChessMoveViewTimeStamp(messageId))
  })
)(ChessModal);
