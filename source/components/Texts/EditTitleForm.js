import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Input from './Input';
import { useOutsideClick } from 'helpers/hooks';
import { addEmoji, finalizeEmoji } from 'helpers/stringHelpers';
import { edit } from 'constants/placeholders';

EditTitleForm.propTypes = {
  autoFocus: PropTypes.bool,
  inputStyle: PropTypes.object,
  maxLength: PropTypes.number,
  onClickOutSide: PropTypes.func.isRequired,
  onEditSubmit: PropTypes.func.isRequired,
  style: PropTypes.object,
  title: PropTypes.string.isRequired
};

export default function EditTitleForm({
  autoFocus,
  maxLength = 100,
  onClickOutSide,
  style,
  inputStyle,
  ...props
}) {
  const [title, setTitle] = useState(props.title);
  const FormRef = useRef(null);
  useOutsideClick(FormRef, onClickOutSide);

  return (
    <form
      style={style}
      ref={FormRef}
      onSubmit={event => onEditSubmit(event, title)}
    >
      <Input
        style={{
          width: '100%',
          color: title.length > maxLength && 'red',
          ...inputStyle
        }}
        autoFocus={autoFocus}
        placeholder={edit.title}
        value={title}
        onChange={text => setTitle(text)}
        onKeyUp={event => setTitle(addEmoji(event.target.value))}
      />
      <div>
        <small
          style={{
            color: title.length > maxLength && 'red',
            fontSize: '1.3rem',
            lineHeight: '2rem'
          }}
        >
          {title.length}/{maxLength} Characters
        </small>
      </div>
    </form>
  );

  function onEditSubmit(event, title) {
    event.preventDefault();
    if (title && title.length > maxLength) return;
    if (title && title !== props.title) {
      props.onEditSubmit(finalizeEmoji(title));
    } else {
      onClickOutSide();
    }
  }
}
