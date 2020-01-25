import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Chess from '../Chess';
import { Color } from 'constants/css';
import { useAppContext, useChatContext } from 'contexts';

ChessModal.propTypes = {
  channelId: PropTypes.number,
  myId: PropTypes.number,
  onConfirmChessMove: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  countdownNumber: PropTypes.number,
  onSpoilerClick: PropTypes.func.isRequired,
  opponentId: PropTypes.number,
  opponentName: PropTypes.string
};

export default function ChessModal({
  channelId,
  myId,
  onConfirmChessMove,
  onHide,
  countdownNumber,
  onSpoilerClick,
  opponentId,
  opponentName
}) {
  const {
    requestHelpers: { fetchCurrentChessState, setChessMoveViewTimeStamp }
  } = useAppContext();
  const {
    state: { recentChessMessage },
    actions: { onUpdateChessMoveViewTimeStamp }
  } = useChatContext();
  const [initialState, setInitialState] = useState();
  const [userMadeLastMove, setUserMadeLastMove] = useState(false);
  const [viewTimeStamp, setViewTimeStamp] = useState();
  const [message, setMessage] = useState();
  const [uploaderId, setUploaderId] = useState();
  const [newChessState, setNewChessState] = useState();
  const [loaded, setLoaded] = useState(false);
  const [spoilerOff, setSpoilerOff] = useState(false);
  const prevChannelId = useRef(channelId);
  const loading = useRef(null);

  useEffect(() => {
    init();
    async function init() {
      loading.current = true;
      const chessMessage = await fetchCurrentChessState({
        channelId,
        recentChessMessage
      });
      setMessage(chessMessage);
      setUploaderId(chessMessage?.userId);
      setInitialState(chessMessage?.chessState);
      setViewTimeStamp(chessMessage?.moveViewTimeStamp);
      loading.current = false;
      setLoaded(true);
    }
    return function cleanUp() {
      loading.current = true;
      setInitialState(undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!prevChannelId.current) {
      prevChannelId.current = channelId;
      return;
    }
    if (prevChannelId.current !== channelId) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId]);

  useEffect(() => {
    if (!loading.current) {
      if (initialState) {
        const { move } = JSON.parse(initialState);
        const userMadeLastMove = move?.by === myId || uploaderId === myId;
        setUserMadeLastMove(!!userMadeLastMove);
      }
    }
  }, [initialState, myId, spoilerOff, uploaderId]);

  useEffect(() => {
    if (typeof countdownNumber === 'number') {
      setSpoilerOff(true);
    }
  }, [channelId, countdownNumber]);

  const parsedState = initialState ? JSON.parse(initialState) : {};

  return (
    <Modal large onHide={onHide}>
      <header>Chess</header>
      <main style={{ padding: 0 }}>
        <div
          style={{
            backgroundColor: Color.lightGray(),
            position: 'relative',
            width: '100%'
          }}
        >
          <Chess
            isFromModal
            channelId={channelId}
            countdownNumber={countdownNumber}
            interactable={!parsedState?.isDraw}
            initialState={initialState}
            loaded={loaded}
            myId={myId}
            newChessState={newChessState}
            onChessMove={setNewChessState}
            opponentId={opponentId}
            opponentName={opponentName}
            senderId={uploaderId}
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
            Done
          </Button>
        )}
      </footer>
    </Modal>
  );

  async function handleSpoilerClick() {
    try {
      await setChessMoveViewTimeStamp({ channelId, message });
      setSpoilerOff(true);
      onUpdateChessMoveViewTimeStamp();
      onSpoilerClick(message.userId);
    } catch (error) {
      console.error(error);
    }
  }

  async function submitChessMove() {
    await onConfirmChessMove(newChessState);
    onHide();
  }
}
