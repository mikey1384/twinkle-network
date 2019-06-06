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
      type === 'video' ? `https://www.youtube.com/watch?v=${content}` : content
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
              style={exceedsCharLimit({
                contentType: type,
                inputType: 'url',
                text: editedUrl
              })}
            />
            {(exceedsCharLimit({
              contentType: type,
              inputType: 'url',
              text: editedUrl
            }) ||
              urlError) && (
              <small style={{ color: 'red', lineHeight: 0.5 }}>
                {exceedsCharLimit({
                  contentType: type,
                  inputType: 'url',
                  text: editedUrl
                })
                  ? renderCharLimit({
                      inputType: 'url',
                      contentType: type,
                      text: editedUrl
                    })
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
              style={exceedsCharLimit({
                contentType: type,
                inputType: 'title',
                text: editedTitle
              })}
            />
            <small
              style={exceedsCharLimit({
                contentType: type,
                inputType: 'title',
                text: editedTitle
              })}
            >
              {renderCharLimit({
                inputType: 'title',
                contentType: type,
                text: editedTitle
              })}
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
            style={exceedsCharLimit({
              contentType: type,
              inputType: 'description',
              text: editedDescription
            })}
          />
          {exceedsCharLimit({
            contentType: type,
            inputType: 'description',
            text: editedDescription
          }) && (
            <small style={{ color: 'red' }}>
              {renderCharLimit({
                inputType: 'description',
                contentType: type,
                text: editedDescription
              })}
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
                ...exceedsCharLimit({
                  contentType: type,
                  inputType: 'description',
                  text: editedSecretAnswer
                })
              }}
            />
            {exceedsCharLimit({
              contentType: type,
              inputType: 'description',
              text: editedSecretAnswer
            }) && (
              <small style={{ color: 'red' }}>
                {renderCharLimit({
                  inputType: 'description',
                  contentType: type,
                  text: editedSecretAnswer
                })}
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
    if (
      exceedsCharLimit({
        contentType: type,
        inputType: 'title',
        text: editedTitle
      })
    ) {
      return true;
    }
    if (
      exceedsCharLimit({
        contentType: type,
        inputType: 'description',
        text: editedDescription
      })
    ) {
      return true;
    }
    if (
      exceedsCharLimit({
        contentType: type,
        inputType: 'description',
        text: editedSecretAnswer
      })
    ) {
      return true;
    }
    if (
      (type === 'vidoe' || type === 'url') &&
      exceedsCharLimit({
        contentType: type,
        inputType: 'url',
        text: editedUrl
      })
    ) {
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
