import PropTypes from 'prop-types';
import React, { useEffect, useMemo } from 'react';
import Textarea from 'components/Texts/Textarea';
import Icon from 'components/Icon';
import Button from 'components/Button';
import { isMobile } from 'helpers';
import {
  stringIsEmpty,
  exceedsCharLimit,
  trimWhiteSpaces
} from 'helpers/stringHelpers';
import { useChatContext, useInputContext } from 'contexts';

Input.propTypes = {
  innerRef: PropTypes.object,
  loading: PropTypes.bool,
  registerButtonShown: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool
};

export default function Input({
  innerRef,
  loading,
  onSubmit,
  registerButtonShown,
  isSubmitting
}) {
  const {
    state,
    actions: { onEnterComment }
  } = useInputContext();
  const {
    actions: { onSetVocabErrorMessage }
  } = useChatContext();

  const text = state['vocabulary'] || '';

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
                contentType: 'vocabulary',
                text: event.target.value
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
              disabled={loading || isSubmitting}
              color="green"
              onClick={handleSubmit}
            >
              <Icon icon="paper-plane" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  function handleChange(event) {
    const regex = /[^a-zA-Z]/gi;
    const isInvalid = regex.test(trimWhiteSpaces(event.target.value));
    if (isInvalid) {
      return onSetVocabErrorMessage(
        `"${event.target.value}" is not allowed for vocabulary section. Please enter english letters only.`
      );
    }
    onSetVocabErrorMessage('');
    onEnterComment({
      contentType: 'vocabulary',
      text: trimWhiteSpaces(event.target.value)
        .toLowerCase()
        .replace(regex, '')
    });
  }

  function handleKeyDown(event) {
    const enterKeyPressed = event.keyCode === 13;
    if (enterKeyPressed && !messageExceedsCharLimit && !loading) {
      event.preventDefault();
      handleSubmit();
    }
  }

  function handleSubmit() {
    innerRef.current.focus();
    if (stringIsEmpty(text)) return;
    onSubmit(text);
  }
}
