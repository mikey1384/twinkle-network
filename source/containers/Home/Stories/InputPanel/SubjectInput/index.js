import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { uploadFeedContent } from 'redux/actions/FeedActions';
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
  finalizeEmoji,
  renderCharLimit
} from 'helpers/stringHelpers';
import SwitchButton from 'components/SwitchButton';
import { Color } from 'constants/css';
import { PanelStyle } from '../Styles';
import { charLimit } from 'constants/defaultValues';
import { uploadContent } from 'helpers/requestHelpers';

SubjectInput.propTypes = {
  dispatch: PropTypes.func.isRequired,
  uploadFeedContent: PropTypes.func.isRequired
};

function SubjectInput({ dispatch, uploadFeedContent }) {
  const [attachment, setAttachment] = useState(undefined);
  const [attachContentModalShown, setAttachContentModalShown] = useState(false);
  const [details, setDetails] = useState({
    title: '',
    description: '',
    secretAnswer: ''
  });
  const { title, description, secretAnswer } = details;
  const [descriptionInputShown, setDescriptionInputShown] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hasSecretAnswer, setHasSecretAnswer] = useState(false);
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
              setDetails({
                ...details,
                title: addEmoji(event.target.value)
              });
            }}
            style={exceedsCharLimit({
              inputType: 'title',
              contentType: 'subject',
              text: title
            })}
          />
        </div>
        <div style={{ marginLeft: '1rem' }}>
          {attachment ? (
            <Attachment
              attachment={attachment}
              onClose={() => setAttachment(undefined)}
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
          {renderCharLimit({
            inputType: 'title',
            contentType: 'subject',
            text: title
          })}
        </span>
      </div>
      {descriptionInputShown && (
        <div style={{ position: 'relative' }}>
          <Textarea
            type="text"
            style={{
              marginTop: '1rem',
              ...(descriptionExceedsCharLimit || null)
            }}
            value={description}
            minRows={4}
            placeholder="Enter Description (Optional, you don't need to write this)"
            onChange={event =>
              setDetails({
                ...details,
                description: addEmoji(event.target.value)
              })
            }
            onKeyUp={event => {
              if (event.key === ' ') {
                setDetails({
                  ...details,
                  description: addEmoji(event.target.value)
                });
              }
            }}
          />
          {descriptionExceedsCharLimit && (
            <small style={{ color: 'red' }}>
              {renderCharLimit({
                contentType: 'subject',
                inputType: 'description',
                text: description
              })}
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
                Secret Answer
              </span>
              <Textarea
                autoFocus
                type="text"
                style={{
                  marginTop: '0.5rem',
                  ...(secretAnswerExceedsCharLimit || null)
                }}
                value={secretAnswer}
                minRows={4}
                placeholder="Enter the Secret Answer"
                onChange={event =>
                  setDetails({
                    ...details,
                    secretAnswer: addEmoji(event.target.value)
                  })
                }
                onKeyUp={event => {
                  if (event.key === ' ') {
                    setDetails({
                      ...details,
                      secretAnswer: addEmoji(event.target.value)
                    });
                  }
                }}
              />
              {secretAnswerExceedsCharLimit && (
                <small style={{ color: 'red' }}>
                  {renderCharLimit({
                    contentType: 'subject',
                    inputType: 'description',
                    text: secretAnswer
                  })}
                </small>
              )}
            </div>
          )}
          <div style={{ marginTop: '1rem' }} className="button-container">
            <SwitchButton
              checked={hasSecretAnswer}
              label="Secret Answer"
              onChange={() =>
                setHasSecretAnswer(hasSecretAnswer => !hasSecretAnswer)
              }
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
            setAttachment(content);
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
    setDetails({
      ...details,
      title: text
    });
    setDescriptionInputShown(!!text.length);
    if (!text.length) {
      setHasSecretAnswer(false);
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
        secretAnswer,
        dispatch
      });
      uploadFeedContent(data);
      setAttachment(undefined);
      setDetails({ title: '', description: '', secretAnswer: '' });
      setDescriptionInputShown(false);
      setSubmitting(false);
      setHasSecretAnswer(false);
    } catch (error) {
      setSubmitting(false);
      console.error(error);
    }
  }
}

export default connect(
  null,
  dispatch => ({
    dispatch,
    uploadFeedContent: params => dispatch(uploadFeedContent(params))
  })
)(SubjectInput);
