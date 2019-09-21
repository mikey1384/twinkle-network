import React, { useState } from 'react';
import Button from 'components/Button';
import Input from 'components/Texts/Input';
import Textarea from 'components/Texts/Textarea';
import AttachContentModal from './AttachContentModal';
import Attachment from './Attachment';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import {
  addEmoji,
  exceedsCharLimit,
  stringIsEmpty,
  finalizeEmoji
} from 'helpers/stringHelpers';
import SwitchButton from 'components/SwitchButton';
import RewardLevelForm from 'components/Forms/RewardLevelForm';
import { Color } from 'constants/css';
import { PanelStyle } from '../Styles';
import { charLimit } from 'constants/defaultValues';
import { useAppContext, useInputContext } from 'context';

export default function SubjectInput() {
  const [attachContentModalShown, setAttachContentModalShown] = useState(false);
  const {
    home: {
      actions: { onLoadNewFeeds }
    },
    user: {
      state: { canEditRewardLevel }
    },
    requestHelpers: { uploadContent }
  } = useAppContext();
  const {
    homeInput: {
      state: { subject },
      actions: {
        onSetHasSecretAnswer,
        onResetSubjectInput,
        onSetSecretAnswer,
        onSetSubjectAttachment,
        onSetSubjectDescription,
        onSetSubjectDescriptionFieldShown,
        onSetSubjectRewardLevel,
        onSetSubjectTitle
      }
    }
  } = useInputContext();
  const {
    attachment,
    descriptionFieldShown,
    details: { title, description, secretAnswer, rewardLevel },
    hasSecretAnswer
  } = subject;
  const [submitting, setSubmitting] = useState(false);
  const titleExceedsCharLimit = exceedsCharLimit({
    inputType: 'title',
    contentType: 'subject',
    text: title
  });
  const descriptionExceedsCharLimit = exceedsCharLimit({
    contentType: 'subject',
    inputType: 'description',
    text: description
  });
  const secretAnswerExceedsCharLimit = exceedsCharLimit({
    contentType: 'subject',
    inputType: 'description',
    text: secretAnswer
  });

  return (
    <ErrorBoundary className={PanelStyle}>
      <p>Post a subject Twinkle users can talk about</p>
      <div
        style={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ width: '100%' }}>
          <Input
            placeholder="A subject Twinkle users can talk about"
            value={title}
            onChange={onInputChange}
            onKeyUp={event => {
              onSetSubjectTitle(addEmoji(event.target.value));
            }}
            style={titleExceedsCharLimit?.style}
          />
        </div>
        <div style={{ marginLeft: '1rem' }}>
          {attachment ? (
            <Attachment
              attachment={attachment}
              onClose={() => onSetSubjectAttachment(undefined)}
            />
          ) : (
            <Button
              style={{
                fontSize: '1.1rem',
                lineHeight: '1.5rem',
                padding: '0.5rem'
              }}
              skeuomorphic
              color="darkerGray"
              onClick={() => setAttachContentModalShown(true)}
            >
              Attach Video or Webpage
            </Button>
          )}
        </div>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <span
          style={{
            fontSize: '1.2rem',
            color:
              title.length > charLimit.subject.title
                ? 'red'
                : Color.darkerGray()
          }}
        >
          {titleExceedsCharLimit?.message}
        </span>
      </div>
      {descriptionFieldShown && (
        <div style={{ position: 'relative' }}>
          <Textarea
            style={{
              marginTop: '1rem',
              ...(descriptionExceedsCharLimit?.style || null)
            }}
            value={description}
            minRows={4}
            placeholder="Enter Description (Optional, you don't need to write this)"
            onChange={event =>
              onSetSubjectDescription(addEmoji(event.target.value))
            }
            onKeyUp={event => {
              if (event.key === ' ') {
                onSetSubjectDescription(addEmoji(event.target.value));
              }
            }}
          />
          {descriptionExceedsCharLimit && (
            <small style={{ color: 'red' }}>
              {descriptionExceedsCharLimit.message}
            </small>
          )}
          {hasSecretAnswer && (
            <div style={{ marginTop: '0.5rem' }}>
              <span
                style={{
                  fontWeight: 'bold',
                  fontSize: '2rem',
                  color: Color.darkerGray()
                }}
              >
                Secret Message
              </span>
              <Textarea
                autoFocus
                style={{
                  marginTop: '0.5rem',
                  ...(secretAnswerExceedsCharLimit || null)
                }}
                value={secretAnswer}
                minRows={4}
                placeholder="Enter the Secret Message"
                onChange={event =>
                  onSetSecretAnswer(addEmoji(event.target.value))
                }
                onKeyUp={event => {
                  if (event.key === ' ') {
                    onSetSecretAnswer(addEmoji(event.target.value));
                  }
                }}
              />
              {secretAnswerExceedsCharLimit && (
                <small style={{ color: 'red' }}>
                  {secretAnswerExceedsCharLimit.message}
                </small>
              )}
            </div>
          )}
          {canEditRewardLevel && (
            <div style={{ marginTop: '1rem' }}>
              <div style={{ fontSize: '1.5rem' }}>
                For every star you add, the amount of maximum XP you and other
                moderators could reward the participants of this subject rises
                by 1,000 XP.
              </div>
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
                onSetRewardLevel={onSetSubjectRewardLevel}
              />
            </div>
          )}
          <div style={{ marginTop: '1rem' }} className="button-container">
            <SwitchButton
              checked={hasSecretAnswer}
              label="Secret Message"
              onChange={() => onSetHasSecretAnswer(!hasSecretAnswer)}
              style={{ marginRight: '1rem' }}
            />
            <Button
              filled
              color="green"
              type="submit"
              disabled={submitting || buttonDisabled()}
              onClick={onSubmit}
            >
              Post!
            </Button>
          </div>
        </div>
      )}
      {attachContentModalShown && (
        <AttachContentModal
          onHide={() => setAttachContentModalShown(false)}
          onConfirm={content => {
            onSetSubjectAttachment(content);
            setAttachContentModalShown(false);
          }}
        />
      )}
    </ErrorBoundary>
  );

  function buttonDisabled() {
    if (title.length > charLimit.subject.title) return true;
    if (description.length > charLimit.subject.description) return true;
    if (
      (hasSecretAnswer && stringIsEmpty(secretAnswer)) ||
      secretAnswer.length > charLimit.subject.description
    ) {
      return true;
    }
    return false;
  }

  function onInputChange(text) {
    onSetSubjectTitle(text);
    onSetSubjectDescriptionFieldShown(!!text.length);
    if (!text.length) {
      onSetHasSecretAnswer(false);
    }
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (
      stringIsEmpty(title) ||
      title.length > charLimit.subject.title ||
      (hasSecretAnswer && stringIsEmpty(secretAnswer))
    ) {
      return;
    }
    setSubmitting(true);
    try {
      const data = await uploadContent({
        attachment,
        title,
        description: finalizeEmoji(description),
        secretAnswer: hasSecretAnswer ? secretAnswer : '',
        rewardLevel
      });
      onLoadNewFeeds([data]);
      onResetSubjectInput();
      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
      console.error(error);
    }
  }
}
