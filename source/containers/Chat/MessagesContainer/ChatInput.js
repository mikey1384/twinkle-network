import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import Textarea from 'components/Texts/Textarea';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { isMobile } from 'helpers';
import { connect } from 'react-redux';
import {
  stringIsEmpty,
  addEmoji,
  finalizeEmoji,
  exceedsCharLimit
} from 'helpers/stringHelpers';

ChatInput.propTypes = {
  currentChannelId: PropTypes.number.isRequired,
  isTwoPeopleChannel: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  loading: PropTypes.bool,
  onChessButtonClick: PropTypes.func.isRequired,
  onHeightChange: PropTypes.func.isRequired,
  onMessageSubmit: PropTypes.func.isRequired,
  onPlusButtonClick: PropTypes.func.isRequired,
  profileTheme: PropTypes.string
};

function ChatInput({
  currentChannelId,
  isTwoPeopleChannel,
  loading,
  onChessButtonClick,
  onHeightChange,
  onMessageSubmit,
  onPlusButtonClick,
  profileTheme
}) {
  const TextareaRef = useRef(null);
  const [message, setMessage] = useState('');
  useEffect(() => {
    setMessage('');
    if (!isMobile(navigator)) {
      TextareaRef.current.focus();
    }
  }, [currentChannelId]);
  const themeColor = profileTheme || 'logoBlue';
  const messageExceedsCharLimit = exceedsCharLimit({
    inputType: 'message',
    contentType: 'chat',
    text: message
  });

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
              disabled={loading}
              skeuomorphic
              onClick={onChessButtonClick}
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
              setMessage(addEmoji(event.target.value));
            }
          }}
          autoFocus
          style={{
            marginRight: '1rem',
            ...(messageExceedsCharLimit?.style || {})
          }}
        />
        <div
          style={{
            margin: '0.2rem 1rem 0.2rem 0',
            height: '100%'
          }}
        >
          <Button
            disabled={loading}
            skeuomorphic
            onClick={onPlusButtonClick}
            color={themeColor}
          >
            <Icon size="lg" icon="plus" />
          </Button>
        </div>
      </div>
    </>
  );

  function handleChange(event) {
    setTimeout(() => {
      onHeightChange(TextareaRef.current?.clientHeight);
    }, 0);
    setMessage(event.target.value);
  }

  function onKeyDown(event) {
    const shiftKeyPressed = event.shiftKey;
    const enterKeyPressed = event.keyCode === 13;
    if (
      enterKeyPressed &&
      !shiftKeyPressed &&
      !messageExceedsCharLimit &&
      !loading
    ) {
      event.preventDefault();
      if (stringIsEmpty(message)) return;
      onMessageSubmit(finalizeEmoji(message));
      setMessage('');
    }
    if (enterKeyPressed && shiftKeyPressed) {
      onHeightChange(TextareaRef.current?.clientHeight + 20);
    }
  }
}

export default connect(state => ({
  profileTheme: state.UserReducer.profileTheme
}))(ChatInput);
