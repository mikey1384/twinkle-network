import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import Textarea from 'components/Texts/Textarea';
import Button from 'components/Button';
import Icon from 'components/Icon';
import ChessModal from './ChessModal';
import { connect } from 'react-redux';
import { stringIsEmpty, addEmoji, finalizeEmoji } from 'helpers/stringHelpers';

ChatInput.propTypes = {
  channelMembers: PropTypes.array,
  currentChannelId: PropTypes.number.isRequired,
  isTwoPeopleChannel: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  message: PropTypes.string.isRequired,
  myId: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  onConfirmChessMove: PropTypes.func.isRequired,
  onHeightChange: PropTypes.func.isRequired,
  onMessageSubmit: PropTypes.func.isRequired,
  profileTheme: PropTypes.string
};

function ChatInput({
  channelMembers,
  currentChannelId,
  isTwoPeopleChannel,
  message,
  myId,
  onChange,
  onConfirmChessMove,
  onHeightChange,
  onMessageSubmit,
  profileTheme
}) {
  const [chessModalShown, setChessModalShown] = useState(false);
  const TextareaRef = useRef(null);
  useEffect(() => {
    TextareaRef.current.focus();
  }, [currentChannelId]);
  const themeColor = profileTheme || 'logoBlue';

  return (
    <>
      <div style={{ display: 'flex' }}>
        {!!isTwoPeopleChannel && (
          <div
            style={{
              margin: '0.2rem 1rem 0.2rem 0',
              height: '100%'
            }}
          >
            <Button
              skeuomorphic
              onClick={() => setChessModalShown(true)}
              color={themeColor}
            >
              <Icon size="lg" icon={['fas', 'chess']} />
              <span style={{ marginLeft: '0.7rem' }}>Chess</span>
            </Button>
          </div>
        )}
        <Textarea
          innerRef={TextareaRef}
          minRows={1}
          placeholder="Type a message..."
          onKeyDown={onKeyDown}
          value={message}
          onChange={handleChange}
          onKeyUp={event => {
            if (event.key === ' ') {
              onChange(addEmoji(event.target.value));
            }
          }}
          autoFocus
          style={{ marginRight: '1rem' }}
        />
      </div>
      {chessModalShown && (
        <ChessModal
          channelId={currentChannelId}
          myId={myId}
          onConfirmChessMove={onConfirmChessMove}
          onHide={() => setChessModalShown(false)}
          opponentId={
            channelMembers.map(({ id }) => id).filter(id => id !== myId)[0]
          }
        />
      )}
    </>
  );

  function handleChange(event) {
    setTimeout(() => {
      onHeightChange(TextareaRef.current?.clientHeight);
    }, 0);
    onChange(event.target.value);
  }

  function onKeyDown(event) {
    const shiftKeyPressed = event.shiftKey;
    const enterKeyPressed = event.keyCode === 13;
    if (enterKeyPressed && !shiftKeyPressed) {
      event.preventDefault();
      if (stringIsEmpty(message)) return;
      onMessageSubmit(finalizeEmoji(message));
      onChange('');
    }
  }
}

export default connect(state => ({
  profileTheme: state.UserReducer.profileTheme
}))(ChatInput);
