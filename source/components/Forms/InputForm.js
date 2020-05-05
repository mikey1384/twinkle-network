import React, { useState, useMemo, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Textarea from 'components/Texts/Textarea';
import {
  exceedsCharLimit,
  stringIsEmpty,
  addEmoji,
  finalizeEmoji
} from 'helpers/stringHelpers';
import { css } from 'emotion';
import { useInputContext } from 'contexts';

InputForm.propTypes = {
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  formGroupStyle: PropTypes.object,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  onSubmit: PropTypes.func.isRequired,
  parent: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  style: PropTypes.object,
  targetCommentId: PropTypes.number
};

export default function InputForm({
  autoFocus,
  className = '',
  formGroupStyle = {},
  innerRef,
  onSubmit,
  parent,
  placeholder,
  rows,
  style = {},
  targetCommentId
}) {
  const [submitting, setSubmitting] = useState(false);
  const {
    state,
    actions: { onEnterComment }
  } = useInputContext();
  const contentType = targetCommentId ? 'comment' : parent.contentType;
  const contentId = targetCommentId || parent.contentId;
  const prevText = useMemo(() => state[contentType + contentId] || '', [
    contentId,
    contentType,
    state
  ]);
  const textRef = useRef(prevText);
  const [text, setText] = useState(prevText);
  useEffect(() => {
    handleSetText(prevText);
  }, [prevText]);
  const commentExceedsCharLimit = useMemo(
    () =>
      exceedsCharLimit({
        contentType: 'comment',
        text
      }),
    [text]
  );
  useEffect(() => {
    return function saveTextBeforeUnmount() {
      onEnterComment({
        contentType,
        contentId,
        text: textRef.current
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={style} className={className}>
      <div
        style={{
          position: 'relative',
          ...formGroupStyle
        }}
      >
        <Textarea
          autoFocus={autoFocus}
          innerRef={innerRef}
          style={{
            fontSize: '1.7rem',
            ...(commentExceedsCharLimit?.style || {})
          }}
          minRows={rows}
          value={text}
          placeholder={placeholder}
          onChange={handleOnChange}
          onKeyUp={handleKeyUp}
        />
        {commentExceedsCharLimit && (
          <small style={{ color: 'red', fontSize: '1.3rem' }}>
            {commentExceedsCharLimit.message}
          </small>
        )}
      </div>
      {!stringIsEmpty(text) && (
        <div
          className={css`
            display: flex;
            justify-content: flex-end;
          `}
        >
          <Button
            style={{ marginTop: '1rem', marginBottom: '0.5rem' }}
            filled
            color="green"
            disabled={
              submitting || stringIsEmpty(text) || !!commentExceedsCharLimit
            }
            onClick={handleSubmit}
          >
            Tap This Button to Submit!
          </Button>
        </div>
      )}
    </div>
  );

  function handleKeyUp(event) {
    if (event.key === ' ') {
      handleSetText(addEmoji(event.target.value));
    }
  }

  function handleOnChange(event) {
    handleSetText(event.target.value);
  }

  function handleSetText(text) {
    setText(text);
    textRef.current = text;
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      await onSubmit(finalizeEmoji(text));
      handleSetText('');
      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
      console.error(error);
    }
  }
}
