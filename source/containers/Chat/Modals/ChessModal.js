import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Chess from '../Chess';
import { socket } from 'constants/io';
import { updateChessMoveViewTimeStamp } from 'redux/actions/ChatActions';
import { Color } from 'constants/css';
import {
  fetchCurrentChessState,
  setChessMoveViewTimeStamp
} from 'helpers/requestHelpers';
import { connect } from 'react-redux';

ChessModal.propTypes = {
  channelId: PropTypes.number,
  chessCountdownObj: PropTypes.object,
  dispatch: PropTypes.func,
  myId: PropTypes.number,
  onConfirmChessMove: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  onSpoilerClick: PropTypes.func.isRequired,
  opponentId: PropTypes.number,
  opponentName: PropTypes.string,
  recentChessMessage: PropTypes.object,
  updateChessMoveViewTimeStamp: PropTypes.func.isRequired
};

function ChessModal({
  channelId,
  chessCountdownObj,
  dispatch,
  myId,
  onConfirmChessMove,
  onHide,
  onSpoilerClick,
  opponentId,
  opponentName,
  recentChessMessage,
  updateChessMoveViewTimeStamp
}) {
  const [initialState, setInitialState] = useState();
  const [userMadeLastMove, setUserMadeLastMove] = useState(false);
  const [viewTimeStamp, setViewTimeStamp] = useState();
  const [message, setMessage] = useState();
  const [uploaderId, setUploaderId] = useState();
  const [newChessState, setNewChessState] = useState();
  const [loaded, setLoaded] = useState(false);
  const [spoilerOff, setSpoilerOff] = useState(false);
  const loading = useRef(null);

  useEffect(() => {
    init();
    async function init() {
      loading.current = true;
      const message = await fetchCurrentChessState({
        channelId,
        recentChessMessage
      });
      setMessage(message);
      setUploaderId(message?.userId);
      setInitialState(message?.chessState);
      setViewTimeStamp(message?.moveViewTimeStamp);
      loading.current = false;
      setLoaded(true);
    }
    return function cleanUp() {
      loading.current = true;
      setInitialState(undefined);
    };
  }, []);

  useEffect(() => {
    if (!loading.current) {
      if (initialState) {
        const { move } = JSON.parse(initialState);
        const userMadeLastMove = move?.by === myId || uploaderId === myId;
        setUserMadeLastMove(!!userMadeLastMove);
        if (move && !userMadeLastMove && (spoilerOff || viewTimeStamp)) {
          socket.emit('user_is_making_move', {
            userId: myId,
            channelId
          });
        }
      }
    }
  }, [loading.current, spoilerOff]);

  useEffect(() => {
    if (typeof chessCountdownObj[channelId] === 'number') {
      setSpoilerOff(true);
    }
  }, [chessCountdownObj]);

  const parsedState = initialState ? JSON.parse(initialState) : {};

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
            channelId={channelId}
            chessCountdownObj={chessCountdownObj}
            interactable={!parsedState?.isDraw}
            initialState={initialState}
            loaded={loaded}
            myId={myId}
            newChessState={newChessState}
            onChessMove={setNewChessState}
            opponentId={opponentId}
            opponentName={opponentName}
            spoilerOff={
              spoilerOff ||
              (!loading.current && !initialState) ||
              !!userMadeLastMove ||
              !!viewTimeStamp
            }
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
        {parsedState?.isCheckmate ||
        parsedState?.isStalemate ||
        parsedState?.isDraw ? (
          <Button color="orange" onClick={() => setInitialState(undefined)}>
            Start a new game
          </Button>
        ) : (
          <Button
            color="blue"
            onClick={submitChessMove}
            disabled={!newChessState}
          >
            Confirm Move
          </Button>
        )}
      </footer>
    </Modal>
  );

  async function handleSpoilerClick() {
    try {
      await setChessMoveViewTimeStamp({ channelId, message, dispatch });
      setSpoilerOff(true);
      updateChessMoveViewTimeStamp();
      onSpoilerClick();
    } catch (error) {
      console.error(error);
    }
  }

  async function submitChessMove() {
    await onConfirmChessMove(newChessState);
    onHide();
  }
}

export default connect(
  state => ({
    recentChessMessage: state.ChatReducer.recentChessMessage
  }),
  dispatch => ({
    dispatch,
    updateChessMoveViewTimeStamp: params =>
      dispatch(updateChessMoveViewTimeStamp(params))
  })
)(ChessModal);
