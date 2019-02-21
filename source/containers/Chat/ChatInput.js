import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import Textarea from 'components/Texts/Textarea';
import { stringIsEmpty, addEmoji, finalizeEmoji } from 'helpers/stringHelpers';

ChatInput.propTypes = {
  currentChannelId: PropTypes.number.isRequired,
  message: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onHeightChange: PropTypes.func.isRequired,
  onMessageSubmit: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default function ChatInput({
  currentChannelId,
  message,
  onChange,
  onHeightChange,
  onMessageSubmit,
  style
}) {
  const TextareaRef = useRef(null);
  useEffect(() => {
    TextareaRef.current.focus();
  }, [currentChannelId]);

  return (
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
      style={style}
    />
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
