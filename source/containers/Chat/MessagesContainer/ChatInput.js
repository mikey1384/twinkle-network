import PropTypes from 'prop-types';
import React, { useEffect, useMemo } from 'react';
import Textarea from 'components/Texts/Textarea';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { isMobile } from 'helpers';
import {
  stringIsEmpty,
  addEmoji,
  finalizeEmoji,
  exceedsCharLimit
} from 'helpers/stringHelpers';
import { useMyState } from 'helpers/hooks';
import { useChatContext, useInputContext } from 'contexts';
import TargetMessagePreview from './TargetMessagePreview';

ChatInput.propTypes = {
  currentChannelId: PropTypes.number.isRequired,
  innerRef: PropTypes.object,
  isTwoPeopleChannel: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  loading: PropTypes.bool,
  onChessButtonClick: PropTypes.func.isRequired,
  onHeightChange: PropTypes.func.isRequired,
  onMessageSubmit: PropTypes.func.isRequired,
  onPlusButtonClick: PropTypes.func.isRequired
};

export default function ChatInput({
  currentChannelId = 0,
  innerRef,
  isTwoPeopleChannel,
  loading,
  onChessButtonClick,
  onHeightChange,
  onMessageSubmit,
  onPlusButtonClick
}) {
  const { profileTheme } = useMyState();
  const {
    state: { replyTarget },
    actions: { onSetReplyTarget }
  } = useChatContext();
  const {
    state,
    actions: { onEnterComment }
  } = useInputContext();

  const text = state['chat' + currentChannelId] || '';

  useEffect(() => {
    if (!isMobile(navigator)) {
      innerRef.current.focus();
    }
  }, [currentChannelId, innerRef]);

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
      {replyTarget && (
        <TargetMessagePreview onClose={() => onSetReplyTarget(null)} />
      )}
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
              color={profileTheme}
            >
              <Icon size="lg" icon={['fas', 'chess']} />
              <span style={{ marginLeft: '0.7rem' }}>Chess</span>
            </Button>
          </div>
        )}
        <Textarea
          innerRef={innerRef}
          minRows={1}
          placeholder="Type a message..."
          onKeyDown={onKeyDown}
          value={text}
          onChange={handleChange}
          onKeyUp={event => {
            if (event.key === ' ') {
              onEnterComment({
                contentType: 'chat',
                contentId: currentChannelId,
                text: addEmoji(event.target.value)
              });
            }
          }}
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
            color={profileTheme}
          >
            <Icon size="lg" icon="plus" />
          </Button>
        </div>
      </div>
    </div>
  );

  function handleChange(event) {
    setTimeout(() => {
      onHeightChange(innerRef.current?.clientHeight);
    }, 0);
    onEnterComment({
      contentType: 'chat',
      contentId: currentChannelId,
      text: event.target.value
    });
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
      if (stringIsEmpty(text)) return;
      onMessageSubmit(finalizeEmoji(text));
      onEnterComment({
        contentType: 'chat',
        contentId: currentChannelId,
        text: ''
      });
      event.target.value = '';
    }
    if (enterKeyPressed && shiftKeyPressed) {
      onHeightChange(innerRef.current?.clientHeight + 20);
    }
  }
}
