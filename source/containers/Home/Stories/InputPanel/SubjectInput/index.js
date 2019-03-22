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
  const [details, setDetails] = useState({ title: '', description: '' });
  const { title, description } = details;
  const [descriptionInputShown, setDescriptionInputShown] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const descriptionExceedsCharLimit = exceedsCharLimit({
    contentType: 'subject',
    inputType: 'description',
    text: description
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
          <div className="button-container">
            <Button
              filled
              color="green"
              type="submit"
              style={{ marginTop: '1rem' }}
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
    return false;
  }

  function onInputChange(text) {
    setDetails({
      ...details,
      title: text
    });
    setDescriptionInputShown(!!text.length);
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (stringIsEmpty(title) || title.length > charLimit.subject.title) {
      return;
    }
    setSubmitting(true);
    try {
      const data = await uploadContent({
        attachment,
        title,
        description: finalizeEmoji(description),
        dispatch
      });
      uploadFeedContent(data);
      setAttachment(undefined);
      setDetails({ title: '', description: '' });
      setDescriptionInputShown(false);
      setSubmitting(false);
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
