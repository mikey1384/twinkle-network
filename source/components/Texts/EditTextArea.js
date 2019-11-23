import React, { useEffect, useMemo } from 'react';
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
  const inputState = useMemo(() => {
    return state['edit' + contentType + contentId];
  }, [contentId, contentType, state]);

  useEffect(() => {
    if (!inputState) {
      onSetEditForm({
        contentId,
        contentType,
        form: {
          editedComment: text
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const editForm = inputState || {};
  const { editedComment } = editForm;
  const commentExceedsCharLimit = useMemo(
    () =>
      exceedsCharLimit({
        contentType: 'comment',
        text: editedComment
      }),
    [editedComment]
  );

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
        value={editedComment}
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
            (!allowEmptyText && stringIsEmpty(editedComment)) ||
            !!commentExceedsCharLimit ||
            text === editedComment ||
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
    onSetEditForm({
      contentId,
      contentType,
      form: {
        editedComment: event.target.value
      }
    });
  }

  function handleCancel() {
    onSetEditForm({
      contentId,
      contentType,
      form: undefined
    });
    onCancel();
  }

  function handleKeyUp(event) {
    if (event.key === ' ') {
      onSetEditForm({
        contentId,
        contentType,
        form: {
          editedComment: addEmoji(event.target.value)
        }
      });
    }
  }

  function onSubmit() {
    onSetEditForm({
      contentId,
      contentType,
      form: undefined
    });
    onEditDone(finalizeEmoji(editedComment));
  }
}
