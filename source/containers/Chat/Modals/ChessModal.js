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
  const [spoilerOn, setSpoilerOn] = useState();
  const [viewTimeStamp, setViewTimeStamp] = useState();
  const [messageId, setMessageId] = useState();
  const [newChessState, setNewChessState] = useState();

  useEffect(() => {
    init();
    async function init() {
      setLoading(true);
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
    return function cleanUp() {
      setLoading(true);
      setInitialState(undefined);
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      if (initialState) {
        const { move } = JSON.parse(initialState);
        const userMadeLastMove = move?.by === myId;
        if (!userMadeLastMove && !viewTimeStamp) {
          setSpoilerOn(true);
        } else {
          setSpoilerOn(false);
        }
      } else {
        setSpoilerOn(false);
      }
    }
  }, [initialState, loading, viewTimeStamp]);

  return (
    <Modal large onHide={onHide}>
      <header>Chess</header>
      <main style={{ padding: 0 }}>
        <div
          style={{
            backgroundColor: Color.subtitleGray(),
            position: 'relative',
            width: '100%'
          }}
        >
          <Chess
            interactable
            initialState={initialState}
            loading={loading}
            myId={myId}
            newChessState={newChessState}
            onChessMove={setNewChessState}
            opponentId={opponentId}
            opponentName={opponentName}
            spoilerOn={spoilerOn}
            onSpoilerClick={handleSpoilerClick}
          />
        </div>
      </main>
      <footer style={{ border: 0 }}>
        <Button transparent onClick={onHide} style={{ marginRight: '0.7rem' }}>
          Close
        </Button>
        {!!newChessState && (
          <Button
            style={{ marginRight: '0.7rem' }}
            color="pink"
            onClick={() => setNewChessState(undefined)}
          >
            Cancel Move
          </Button>
        )}
        <Button
          color="blue"
          onClick={submitChessMove}
          disabled={!newChessState}
        >
          Confirm Move
        </Button>
      </footer>
    </Modal>
  );

  async function handleSpoilerClick() {
    await setChessMoveViewTimeStamp({ channelId, messageId, dispatch });
    setSpoilerOn(false);
    updateChessMoveViewTimeStamp(messageId);
  }

  async function submitChessMove() {
    await onConfirmChessMove(newChessState);
    onHide();
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
