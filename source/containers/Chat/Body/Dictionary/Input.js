import PropTypes from 'prop-types';
import React, { useEffect, useMemo } from 'react';
import Textarea from 'components/Texts/Textarea';
import Icon from 'components/Icon';
import Button from 'components/Button';
import { isMobile } from 'helpers';
import {
  stringIsEmpty,
  addEmoji,
  finalizeEmoji,
  exceedsCharLimit
} from 'helpers/stringHelpers';
import { useInputContext } from 'contexts';

Input.propTypes = {
  innerRef: PropTypes.object,
  loading: PropTypes.bool,
  registerButtonShown: PropTypes.bool,
  onHeightChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default function Input({
  innerRef,
  loading,
  onHeightChange,
  onSubmit,
  registerButtonShown
}) {
  const {
    state,
    actions: { onEnterComment }
  } = useInputContext();

  const text = state['dictionary'] || '';

  useEffect(() => {
    if (!isMobile(navigator)) {
      innerRef.current.focus();
    }
  }, [innerRef]);

  const messageExceedsCharLimit = useMemo(
    () =>
      exceedsCharLimit({
        inputType: 'message',
        contentType: 'chat',
        text
      }),
    [text]
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ display: 'flex' }}>
        <Textarea
          innerRef={innerRef}
          minRows={1}
          placeholder="Type a word..."
          onKeyDown={handleKeyDown}
          value={text}
          onChange={handleChange}
          onKeyUp={event => {
            if (event.key === ' ') {
              onEnterComment({
                contentType: 'dictionary',
                text: addEmoji(event.target.value)
              });
            }
          }}
          style={{
            ...(messageExceedsCharLimit?.style || {})
          }}
        />
        {registerButtonShown && (
          <div style={{ height: '100%', margin: '0.5rem 0 0.2rem 1rem' }}>
            <Button
              filled
              style={{ width: '9rem' }}
              disabled={loading}
              color="brownOrange"
              onClick={handleSendMsg}
            >
              <Icon icon="plus" />
              <span style={{ marginLeft: '0.5rem' }}>100 XP</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  function handleChange(event) {
    setTimeout(() => {
      onHeightChange(innerRef.current?.clientHeight);
    }, 0);
    onEnterComment({
      contentType: 'dictionary',
      text: event.target.value
    });
  }

  function handleKeyDown(event) {
    const shiftKeyPressed = event.shiftKey;
    const enterKeyPressed = event.keyCode === 13;
    if (
      enterKeyPressed &&
      !isMobile(navigator) &&
      !shiftKeyPressed &&
      !messageExceedsCharLimit &&
      !loading
    ) {
      event.preventDefault();
      handleSendMsg();
    }
    if (enterKeyPressed && shiftKeyPressed) {
      onHeightChange(innerRef.current?.clientHeight + 20);
    }
  }

  function handleSendMsg() {
    innerRef.current.focus();
    if (stringIsEmpty(text)) return;
    onSubmit(finalizeEmoji(text));
    onEnterComment({
      contentType: 'dictionary',
      text: ''
    });
  }
}
