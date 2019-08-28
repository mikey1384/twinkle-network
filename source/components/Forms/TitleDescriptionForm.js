import React, { useEffect, useState } from 'react';
import { stringIsEmpty, addEmoji, finalizeEmoji } from 'helpers/stringHelpers';
import PropTypes from 'prop-types';
import Textarea from 'components/Texts/Textarea';
import Button from 'components/Button';
import Input from 'components/Texts/Input';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import RewardLevelForm from 'components/Forms/RewardLevelForm';

TitleDescriptionForm.propTypes = {
  autoFocus: PropTypes.bool,
  canEditRewardLevel: PropTypes.bool,
  descriptionMaxChar: PropTypes.number,
  descriptionPlaceholder: PropTypes.string,
  isSubject: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  rows: PropTypes.number,
  titleMaxChar: PropTypes.number,
  titlePlaceholder: PropTypes.string
};

export default function TitleDescriptionForm({
  autoFocus,
  canEditRewardLevel,
  isSubject,
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
  const [rewardLevel, setRewardLevel] = useState(0);
  const [secretAnswer, setSecretAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    return function cleanUp() {
      setSubmitting(false);
    };
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
          {description.length > descriptionMaxChar && (
            <small style={{ color: 'red', fontSize: '1.3rem' }}>
              {descriptionMaxChar} character limit exceeded
            </small>
          )}
          {isSubject && (
            <div style={{ marginTop: '0.5rem' }}>
              <span style={{ fontSize: '1.7rem', fontWeight: 'bold' }}>
                Secret Message
              </span>
              <Textarea
                style={{
                  marginTop: '0.7rem',
                  color: secretAnswer.length > descriptionMaxChar && 'red',
                  borderColor: secretAnswer.length > descriptionMaxChar && 'red'
                }}
                minRows={rows}
                placeholder="Enter Secret Message... (Optional)"
                value={secretAnswer}
                onChange={event => setSecretAnswer(event.target.value)}
                onKeyUp={event => setSecretAnswer(addEmoji(event.target.value))}
              />
              {secretAnswer.length > descriptionMaxChar && (
                <small style={{ color: 'red', fontSize: '1.3rem' }}>
                  {secretAnswer} character limit exceeded
                </small>
              )}
            </div>
          )}
          {canEditRewardLevel && (
            <RewardLevelForm
              themed
              style={{
                marginTop: '1rem',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                padding: '1rem',
                fontSize: '3rem'
              }}
              rewardLevel={rewardLevel}
              onSetRewardLevel={setRewardLevel}
            />
          )}
        </div>
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
            color="blue"
            style={{ fontSize: '1.7rem' }}
            onClick={handleSubmit}
            disabled={
              submitting ||
              !title ||
              stringIsEmpty(title) ||
              title.length > titleMaxChar ||
              description.length > descriptionMaxChar ||
              secretAnswer.length > descriptionMaxChar
            }
          >
            Submit
          </Button>
        </div>
      </div>
    </ErrorBoundary>
  );

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      setTitle('');
      setDescription('');
      setSecretAnswer('');
      setRewardLevel(0);
      await onSubmit({
        title: finalizeEmoji(title),
        description: finalizeEmoji(description),
        rewardLevel,
        secretAnswer: finalizeEmoji(secretAnswer)
      });
      return Promise.resolve();
    } catch (error) {
      setSubmitting(false);
      console.error(error);
    }
  }
}
