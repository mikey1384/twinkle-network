import React, { useContext, useState } from 'react';
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
import { Context } from 'context';

InputForm.propTypes = {
  autoFocus: PropTypes.bool,
  formGroupStyle: PropTypes.object,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  onSubmit: PropTypes.func.isRequired,
  parent: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  style: PropTypes.object,
  className: PropTypes.string
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
  style = {}
}) {
  const [submitting, setSubmitting] = useState(false);
  const {
    [parent.type]: { state, dispatch }
  } = useContext(Context);
  const text = state[parent.id] || '';
  const commentExceedsCharLimit = exceedsCharLimit({
    contentType: 'comment',
    text
  });

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
              submitting || stringIsEmpty(text) || commentExceedsCharLimit
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
      return dispatch({
        type: 'ENTER_TEXT',
        contentId: parent.id,
        text: addEmoji(event.target.value)
      });
    }
  }

  function handleOnChange(event) {
    return dispatch({
      type: 'ENTER_TEXT',
      contentId: parent.id,
      text: event.target.value
    });
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      await onSubmit(finalizeEmoji(text));
      dispatch({
        type: 'ENTER_TEXT',
        contentId: parent.id,
        text: ''
      });
      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
      console.error(error);
    }
  }
}
