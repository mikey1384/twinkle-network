import React, { useEffect, useRef, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Chess from '../Chess';
import ConfirmModal from 'components/Modals/ConfirmModal';
import { Color } from 'constants/css';
import { socket } from 'constants/io';
import { useAppContext, useChatContext } from 'contexts';

ChessModal.propTypes = {
  channelId: PropTypes.number,
  currentChannel: PropTypes.object,
  myId: PropTypes.number,
  onConfirmChessMove: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  countdownNumber: PropTypes.number,
  onSpoilerClick: PropTypes.func.isRequired,
  opponentId: PropTypes.number,
  opponentName: PropTypes.string
};

export default function ChessModal({
  currentChannel,
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
  const [viewTimeStamp, setViewTimeStamp] = useState();
  const [message, setMessage] = useState();
  const [uploaderId, setUploaderId] = useState();
  const [loaded, setLoaded] = useState(false);
  const [newChessState, setNewChessState] = useState();
  const [resignModalShown, setResignModalShown] = useState(false);
  const [spoilerOff, setSpoilerOff] = useState(false);
  const [userMadeLastMove, setUserMadeLastMove] = useState(false);
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
      setUserMadeLastMove(chessMessage?.userId === myId);
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
    if (typeof countdownNumber === 'number') {
      setSpoilerOff(true);
    }
  }, [channelId, countdownNumber]);

  const parsedState = initialState ? JSON.parse(initialState) : {};
  const gameFinished = useMemo(
    () =>
      parsedState?.isCheckmate ||
      parsedState?.isStalemate ||
      parsedState?.isDraw,
    [parsedState]
  );

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
        {!!parsedState?.move?.number > 0 &&
          !newChessState &&
          !gameFinished &&
          !userMadeLastMove && (
            <Button
              style={{ marginRight: '0.7rem' }}
              color="red"
              onClick={() => setResignModalShown(true)}
            >
              Resign
            </Button>
          )}
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
        {gameFinished ? (
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
      {resignModalShown && (
        <ConfirmModal
          modalOverModal
          title="Resign Chess Match"
          onConfirm={handleResign}
          onHide={() => setResignModalShown(false)}
        />
      )}
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

  function handleResign() {
    socket.emit('resign_chess_game', {
      channel: currentChannel,
      channelId,
      targetUserId: myId,
      winnerId: opponentId
    });
    onHide();
  }
}
