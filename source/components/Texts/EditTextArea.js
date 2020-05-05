import React, { useEffect, useMemo, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Textarea from 'components/Texts/Textarea';
import { useInputContext } from 'contexts';
import {
  exceedsCharLimit,
  stringIsEmpty,
  addEmoji,
  finalizeEmoji
} from 'helpers/stringHelpers';

EditTextArea.propTypes = {
  allowEmptyText: PropTypes.bool,
  autoFocus: PropTypes.bool,
  contentId: PropTypes.number,
  contentType: PropTypes.string,
  disabled: PropTypes.bool,
  marginTop: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onEditDone: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  text: PropTypes.string.isRequired
};

export default function EditTextArea({
  allowEmptyText,
  autoFocus = false,
  contentId,
  contentType,
  disabled,
  marginTop = '1rem',
  onCancel,
  onEditDone,
  placeholder = 'Enter text',
  rows = 4,
  text
}) {
  const {
    state,
    actions: { onSetEditForm }
  } = useInputContext();
  const prevEditState = useMemo(() => {
    return state['edit' + contentType + contentId];
  }, [contentId, contentType, state]);

  const editTextRef = useRef(prevEditState?.editedComment || '');
  const [editText, setEditText] = useState(prevEditState?.editedComment || '');

  useEffect(() => {
    if (!editText) {
      handleSetEditText(text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const commentExceedsCharLimit = useMemo(
    () =>
      exceedsCharLimit({
        contentType: 'comment',
        text
      }),
    [text]
  );

  useEffect(() => {
    return function onSaveTextBeforeUnmount() {
      onSetEditForm({
        contentId,
        contentType,
        form: editTextRef.current
          ? {
              editedComment: editTextRef.current
            }
          : undefined
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentId, contentType]);

  return (
    <div style={{ lineHeight: 1 }}>
      <Textarea
        placeholder={placeholder}
        autoFocus={autoFocus}
        style={{
          marginTop,
          position: 'relative',
          ...(commentExceedsCharLimit?.style || {})
        }}
        minRows={rows}
        value={editText}
        onChange={onChange}
        onKeyUp={handleKeyUp}
      />
      {commentExceedsCharLimit && (
        <small style={{ color: 'red', fontSize: '1.3rem', lineHeight: 1 }}>
          {commentExceedsCharLimit?.message}
        </small>
      )}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row-reverse',
          marginTop: '1rem'
        }}
      >
        <Button
          color="blue"
          onClick={onSubmit}
          disabled={
            (!allowEmptyText && stringIsEmpty(editText)) ||
            !!commentExceedsCharLimit ||
            text === editText ||
            disabled
          }
        >
          Done
        </Button>
        <Button
          transparent
          style={{
            marginRight: '1rem'
          }}
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  );

  function onChange(event) {
    handleSetEditText(event.target.value);
  }

  function handleCancel() {
    handleSetEditText('');
    onCancel();
  }

  function handleKeyUp(event) {
    if (event.key === ' ') {
      handleSetEditText(addEmoji(event.target.value));
    }
  }

  function handleSetEditText(text) {
    setEditText(text);
    editTextRef.current = text;
  }

  function onSubmit() {
    onSetEditForm({
      contentId,
      contentType,
      form: undefined
    });
    onEditDone(finalizeEmoji(editText));
  }
}
