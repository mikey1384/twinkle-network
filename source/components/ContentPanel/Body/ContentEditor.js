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
  isValidYoutubeUrl,
  renderCharLimit
} from 'helpers/stringHelpers';

ContentEditor.propTypes = {
  comment: PropTypes.string,
  content: PropTypes.string,
  contentId: PropTypes.number.isRequired,
  description: PropTypes.string,
  onDismiss: PropTypes.func.isRequired,
  onEditContent: PropTypes.func.isRequired,
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
  style,
  title,
  type
}) {
  const [editForm, setEditForm] = useState({
    editedContent: content || '',
    editedComment: comment || '',
    editedDescription: description || '',
    editedTitle: title || '',
    editedUrl:
      type === 'video' ? `https://www.youtube.com/watch?v=${content}` : content
  });
  const {
    editedContent,
    editedComment,
    editedDescription,
    editedTitle,
    editedUrl
  } = editForm;
  const urlError =
    !stringIsEmpty(editedUrl) &&
    !(type === 'video' ? isValidYoutubeUrl(editedUrl) : isValidUrl(editedUrl));

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
              style={urlExceedsCharLimit(type)}
            />
            {(urlExceedsCharLimit(type) || urlError) && (
              <small style={{ color: 'red', lineHeight: 0.5 }}>
                {urlExceedsCharLimit(type)
                  ? renderUrlCharLimit(type)
                  : 'Please check the url'}
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
              style={titleExceedsCharLimit(type)}
            />
            <small style={titleExceedsCharLimit(type)}>
              {renderTitleCharLimit(type)}
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
            style={descriptionExceedsCharLimit(type)}
          />
          {descriptionExceedsCharLimit(type) && (
            <small style={{ color: 'red' }}>
              {renderDescriptionCharLimit(type)}
            </small>
          )}
        </div>
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
    if (titleExceedsCharLimit(type)) return true;
    if (descriptionExceedsCharLimit(type)) return true;
    if ((type === 'vidoe' || type === 'url') && urlExceedsCharLimit(type)) {
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
          (editedTitle === title && editedDescription === description)
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
      editedTitle: finalizeEmoji(editedTitle)
    };
    await onEditContent({ ...post, contentId, type });
    onDismiss();
  }

  function descriptionExceedsCharLimit(type) {
    return exceedsCharLimit({
      contentType: type,
      inputType: 'description',
      text: type === 'comment' ? editedComment : editedDescription
    });
  }

  function titleExceedsCharLimit(type) {
    return exceedsCharLimit({
      contentType: type,
      inputType: 'title',
      text: editedTitle
    });
  }

  function urlExceedsCharLimit(type) {
    return exceedsCharLimit({
      contentType: type,
      inputType: 'url',
      text: editedUrl
    });
  }

  function renderDescriptionCharLimit(type) {
    return renderCharLimit({
      inputType: 'description',
      contentType: type,
      text: type === 'comment' ? editedComment : editedDescription
    });
  }

  function renderTitleCharLimit(type) {
    return renderCharLimit({
      inputType: 'title',
      contentType: type,
      text: editedTitle
    });
  }

  function renderUrlCharLimit(type) {
    return renderCharLimit({
      inputType: 'url',
      contentType: type,
      text: editedUrl
    });
  }
}
