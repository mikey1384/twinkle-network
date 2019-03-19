import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Textarea from 'components/Texts/Textarea';
import {
  exceedsCharLimit,
  stringIsEmpty,
  addEmoji,
  finalizeEmoji,
  renderCharLimit
} from 'helpers/stringHelpers';

EditTextArea.propTypes = {
  allowEmptyText: PropTypes.bool,
  autoFocus: PropTypes.bool,
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
  disabled,
  marginTop = '1rem',
  onCancel,
  onEditDone,
  placeholder = 'Enter text',
  rows = 4,
  text
}) {
  const [editedText, setEditedText] = useState(text);
  const commentExceedsCharLimit = exceedsCharLimit({
    contentType: 'comment',
    text: editedText
  });

  return (
    <div style={{ lineHeight: 1 }}>
      <Textarea
        placeholder={placeholder}
        autoFocus={autoFocus}
        style={{
          marginTop,
          position: 'relative',
          ...(commentExceedsCharLimit || {})
        }}
        minRows={rows}
        value={editedText}
        onChange={onChange}
        onKeyUp={handleKeyUp}
      />
      {commentExceedsCharLimit && (
        <small style={{ color: 'red', fontSize: '1.3rem', lineHeight: 1 }}>
          {renderCharLimit({
            contentType: 'comment',
            text: editedText
          })}
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
            (!allowEmptyText && stringIsEmpty(editedText)) ||
            commentExceedsCharLimit ||
            text === editedText ||
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
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  );

  function onChange(event) {
    setEditedText(event.target.value);
  }

  function handleKeyUp(event) {
    if (event.key === ' ') {
      setEditedText(addEmoji(event.target.value));
    }
  }

  function onSubmit() {
    return onEditDone(finalizeEmoji(editedText));
  }
}
