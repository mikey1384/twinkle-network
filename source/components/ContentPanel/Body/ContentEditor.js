import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Textarea from 'components/Texts/Textarea';
import Input from 'components/Texts/Input';
import Button from 'components/Button';
import { edit } from 'constants/placeholders';
import { css } from 'emotion';
import {
  addEmoji,
  exceedsCharLimit,
  finalizeEmoji,
  stringIsEmpty,
  isValidUrl,
  isValidYoutubeUrl
} from 'helpers/stringHelpers';

ContentEditor.propTypes = {
  comment: PropTypes.string,
  content: PropTypes.string,
  contentId: PropTypes.number.isRequired,
  description: PropTypes.string,
  onDismiss: PropTypes.func.isRequired,
  onEditContent: PropTypes.func.isRequired,
  secretAnswer: PropTypes.string,
  style: PropTypes.object,
  title: PropTypes.string,
  type: PropTypes.string.isRequired
};

export default function ContentEditor({
  comment,
  content,
  contentId,
  description,
  onDismiss,
  onEditContent,
  secretAnswer = '',
  style,
  title,
  type
}) {
  const [editForm, setEditForm] = useState({
    editedContent: content || '',
    editedComment: comment || '',
    editedDescription: description || '',
    editedSecretAnswer: secretAnswer || '',
    editedTitle: title || '',
    editedUrl:
      type === 'video'
        ? `https://www.youtube.com/watch?v=${content}`
        : content || ''
  });
  const {
    editedContent,
    editedComment,
    editedDescription,
    editedSecretAnswer,
    editedTitle,
    editedUrl
  } = editForm;
  const urlError =
    !stringIsEmpty(editedUrl) &&
    !(type === 'video' ? isValidYoutubeUrl(editedUrl) : isValidUrl(editedUrl));
  const descriptionExceedsCharLimit = exceedsCharLimit({
    contentType: type,
    inputType: 'description',
    text: type === 'comment' ? editedComment : editedDescription
  });
  const secretAnswerExceedsCharLimit = exceedsCharLimit({
    inputType: 'description',
    contentType: type,
    text: editedSecretAnswer
  });
  const titleExceedsCharLimit = exceedsCharLimit({
    contentType: type,
    inputType: 'title',
    text: editedTitle
  });
  const urlExceedsCharLimit = exceedsCharLimit({
    contentType: type,
    inputType: 'url',
    text: editedUrl
  });

  return (
    <div
      style={style}
      className={css`
        small {
          font-size: 1.3rem;
          line-height: 2.5rem;
        }
      `}
    >
      <form onSubmit={onSubmit}>
        {(type === 'video' || type === 'url') && (
          <div
            className={css`
              margin-bottom: 1rem;
            `}
          >
            <Input
              autoFocus
              hasError={urlError}
              onChange={text =>
                setEditForm({
                  ...editForm,
                  editedUrl: text
                })
              }
              placeholder={edit[type]}
              value={editedUrl}
              style={urlExceedsCharLimit?.style}
            />
            {(urlExceedsCharLimit || urlError) && (
              <small style={{ color: 'red', lineHeight: 0.5 }}>
                {urlExceedsCharLimit?.message || 'Please check the url'}
              </small>
            )}
          </div>
        )}
        {type !== 'comment' && (
          <>
            <Input
              autoFocus
              onChange={text =>
                setEditForm({
                  ...editForm,
                  editedTitle: text
                })
              }
              onKeyUp={event =>
                setEditForm({
                  ...editForm,
                  editedTitle: addEmoji(event.target.value)
                })
              }
              placeholder={edit.title}
              value={editedTitle}
              style={titleExceedsCharLimit?.style}
            />
            <small style={titleExceedsCharLimit?.style}>
              {titleExceedsCharLimit?.message}
            </small>
          </>
        )}
        <div style={{ position: 'relative', marginTop: '1rem' }}>
          <Textarea
            autoFocus={type === 'comment'}
            minRows={4}
            onChange={event => {
              const { value } = event.target;
              setEditForm({
                ...editForm,
                [type === 'comment'
                  ? 'editedComment'
                  : 'editedDescription']: value
              });
            }}
            placeholder={edit[type === 'comment' ? 'comment' : 'description']}
            value={type === 'comment' ? editedComment : editedDescription}
            style={descriptionExceedsCharLimit?.style}
          />
          {descriptionExceedsCharLimit && (
            <small style={{ color: 'red' }}>
              {descriptionExceedsCharLimit?.message}
            </small>
          )}
        </div>
        {type === 'subject' && (
          <div style={{ position: 'relative', marginTop: '1rem' }}>
            <span style={{ fontWeight: 'bold' }}>Secret Message</span>
            <Textarea
              minRows={4}
              onChange={event => {
                const { value } = event.target;
                setEditForm({
                  ...editForm,
                  editedSecretAnswer: value
                });
              }}
              placeholder="Enter Secret Message... (Optional)"
              value={editedSecretAnswer}
              style={{
                marginTop: '0.7rem',
                ...(secretAnswerExceedsCharLimit?.style || {})
              }}
            />
            {secretAnswerExceedsCharLimit && (
              <small style={{ color: 'red' }}>
                {secretAnswerExceedsCharLimit.message}
              </small>
            )}
          </div>
        )}
        <div
          style={{
            marginTop: '1rem',
            display: 'flex',
            flexDirection: 'row-reverse'
          }}
        >
          <Button
            color="blue"
            type="submit"
            disabled={determineButtonDisabled()}
          >
            Done
          </Button>
          <Button
            transparent
            style={{ marginRight: '1rem' }}
            onClick={onDismiss}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );

  function determineButtonDisabled() {
    const contentUrl =
      type === 'video' ? `https://www.youtube.com/watch?v=${content}` : content;
    const isValid =
      type === 'video' ? isValidYoutubeUrl(editedUrl) : isValidUrl(editedUrl);
    if (titleExceedsCharLimit) {
      return true;
    }
    if (descriptionExceedsCharLimit) {
      return true;
    }
    if (secretAnswerExceedsCharLimit) {
      return true;
    }
    if ((type === 'vidoe' || type === 'url') && urlExceedsCharLimit) {
      return true;
    }

    switch (type) {
      case 'video':
      case 'url':
        if (
          stringIsEmpty(editedUrl) ||
          stringIsEmpty(editedTitle) ||
          !isValid
        ) {
          return true;
        }
        if (
          editedUrl === contentUrl &&
          editedTitle === title &&
          editedDescription === description
        ) {
          return true;
        }
        return false;
      case 'comment':
        if (stringIsEmpty(editedComment) || editedComment === comment) {
          return true;
        }
        return false;
      case 'subject':
        if (
          stringIsEmpty(editedTitle) ||
          (editedTitle === title &&
            editedDescription === description &&
            editedSecretAnswer === secretAnswer)
        ) {
          return true;
        }
        return false;
      default:
        return true;
    }
  }

  async function onSubmit(event) {
    event.preventDefault();
    const post = {
      ...editForm,
      editedComment: finalizeEmoji(editedComment),
      editedContent: finalizeEmoji(editedContent),
      editedDescription: finalizeEmoji(editedDescription),
      editedSecretAnswer: finalizeEmoji(editedSecretAnswer),
      editedTitle: finalizeEmoji(editedTitle)
    };
    await onEditContent({ ...post, contentId, type });
    onDismiss();
  }
}
