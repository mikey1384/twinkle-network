import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Textarea from 'components/Texts/Textarea';
import Button from 'components/Button';
import Input from 'components/Texts/Input';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { stringIsEmpty, addEmoji, finalizeEmoji } from 'helpers/stringHelpers';

TitleDescriptionForm.propTypes = {
  autoFocus: PropTypes.bool,
  descriptionMaxChar: PropTypes.number,
  descriptionPlaceholder: PropTypes.string,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  rows: PropTypes.number,
  titleMaxChar: PropTypes.number,
  titlePlaceholder: PropTypes.string
};

export default function TitleDescriptionForm({
  autoFocus,
  onClose,
  rows,
  titlePlaceholder,
  titleMaxChar = 300,
  descriptionMaxChar = 5000,
  descriptionPlaceholder,
  onSubmit
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    return () => setSubmitting(false);
  }, []);

  return (
    <ErrorBoundary>
      <div>
        <Input
          autoFocus={autoFocus}
          placeholder={titlePlaceholder}
          type="text"
          value={title}
          style={{
            borderColor: title.length > titleMaxChar && 'red',
            color: title.length > titleMaxChar && 'red'
          }}
          onChange={text => setTitle(text)}
          onKeyUp={event => setTitle(addEmoji(event.target.value))}
        />
        {title.length > titleMaxChar && (
          <small style={{ color: 'red', fontSize: '1.6rem' }}>
            {`Exceeded title's`} character limit of {titleMaxChar} characters.
            You can write more in the description field below.
          </small>
        )}
        <div style={{ position: 'relative' }}>
          <Textarea
            style={{
              marginTop: '1rem',
              color: description.length > descriptionMaxChar && 'red',
              borderColor: description.length > descriptionMaxChar && 'red'
            }}
            minRows={rows}
            placeholder={descriptionPlaceholder}
            value={description}
            onChange={event => setDescription(event.target.value)}
            onKeyUp={event => setDescription(addEmoji(event.target.value))}
          />
        </div>
        {description.length > descriptionMaxChar && (
          <small style={{ color: 'red', fontSize: '1.3rem' }}>
            {descriptionMaxChar} character limit exceeded
          </small>
        )}
        <div
          style={{
            marginTop: '1rem',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Button
            transparent
            style={{ fontSize: '1.7rem', marginRight: '1rem' }}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            primary
            style={{ fontSize: '1.7rem' }}
            onClick={submitThis}
            disabled={
              submitting ||
              !title ||
              stringIsEmpty(title) ||
              title.length > titleMaxChar ||
              description.length > descriptionMaxChar
            }
          >
            Submit
          </Button>
        </div>
      </div>
    </ErrorBoundary>
  );

  async function submitThis(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      setTitle('');
      setDescription('');
      await onSubmit(finalizeEmoji(title), finalizeEmoji(description));
      return Promise.resolve();
    } catch (error) {
      setSubmitting(false);
      console.error(error);
    }
  }
}
