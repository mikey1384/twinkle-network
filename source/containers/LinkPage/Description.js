import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import UsernameText from 'components/Texts/UsernameText';
import DropdownButton from 'components/Buttons/DropdownButton';
import LongText from 'components/Texts/LongText';
import Button from 'components/Button';
import Textarea from 'components/Texts/Textarea';
import Input from 'components/Texts/Input';
import AlreadyPosted from 'components/AlreadyPosted';
import { timeSince } from 'helpers/timeStampHelpers';
import {
  exceedsCharLimit,
  isValidUrl,
  stringIsEmpty,
  addEmoji,
  finalizeEmoji
} from 'helpers/stringHelpers';
import { css } from 'emotion';
import { useContentState, useMyState } from 'helpers/hooks';
import { useContentContext, useInputContext } from 'contexts';

Description.propTypes = {
  description: PropTypes.string,
  linkId: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEditDone: PropTypes.func.isRequired,
  timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  title: PropTypes.string.isRequired,
  userCanEditThis: PropTypes.bool,
  uploader: PropTypes.object,
  userIsUploader: PropTypes.bool,
  url: PropTypes.string.isRequired
};

export default function Description({
  description,
  onDelete,
  onEditDone,
  linkId,
  timeStamp,
  title,
  uploader,
  url,
  userCanEditThis,
  userIsUploader
}) {
  const { canDelete, canEdit } = useMyState();
  const {
    actions: { onSetIsEditing }
  } = useContentContext();
  const {
    state: inputState,
    actions: { onSetEditForm }
  } = useInputContext();
  const { isEditing } = useContentState({
    contentType: 'url',
    contentId: linkId
  });
  useEffect(() => {
    if (!inputState['edit' + 'url' + linkId]) {
      onSetEditForm({
        contentId: linkId,
        contentType: 'url',
        form: {
          editedDescription: description || '',
          editedTitle: title || '',
          editedUrl: url
        }
      });
    }
  }, [isEditing, title, description, url]);
  const editForm = inputState['edit' + 'url' + linkId] || {};
  const { editedDescription = '', editedTitle = '', editedUrl = '' } = editForm;

  const descriptionExceedsCharLimit = exceedsCharLimit({
    contentType: 'url',
    inputType: 'description',
    text: editedDescription
  });
  const titleExceedsCharLimit = exceedsCharLimit({
    contentType: 'url',
    inputType: 'title',
    text: editedTitle
  });
  const urlExceedsCharLimit = exceedsCharLimit({
    contentType: 'url',
    inputType: 'url',
    text: editedUrl
  });
  const editButtonShown = userIsUploader || userCanEditThis;
  const editMenuItems = [];
  if (userIsUploader || canEdit) {
    editMenuItems.push({
      label: 'Edit',
      onClick: () =>
        onSetIsEditing({
          contentId: linkId,
          contentType: 'url',
          isEditing: true
        })
    });
  }
  if (userIsUploader || canDelete) {
    editMenuItems.push({
      label: 'Delete',
      onClick: onDelete
    });
  }
  return useMemo(() => {
    return (
      <div style={{ position: 'relative', padding: '2rem 1rem 0 1rem' }}>
        {editButtonShown && !isEditing && (
          <DropdownButton
            skeuomorphic
            color="darkerGray"
            opacity={0.8}
            style={{ position: 'absolute', top: '1rem', right: '1rem' }}
            direction="left"
            menuProps={editMenuItems}
          />
        )}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column'
            }}
          >
            {isEditing ? (
              <>
                <Input
                  className={css`
                    width: 80%;
                  `}
                  style={titleExceedsCharLimit?.style}
                  placeholder="Enter Title..."
                  value={editedTitle}
                  onChange={text => {
                    onSetEditForm({
                      contentId: linkId,
                      contentType: 'url',
                      form: {
                        editedTitle: text
                      }
                    });
                  }}
                  onKeyUp={event => {
                    if (event.key === ' ') {
                      onSetEditForm({
                        contentId: linkId,
                        contentType: 'url',
                        form: {
                          editedTitle: addEmoji(event.target.value)
                        }
                      });
                    }
                  }}
                />
                {titleExceedsCharLimit && (
                  <small style={{ color: 'red' }}>
                    {titleExceedsCharLimit.message}
                  </small>
                )}
              </>
            ) : (
              <h2>{title}</h2>
            )}
          </div>
          <div>
            <small>
              Added by <UsernameText user={uploader} /> ({timeSince(timeStamp)})
            </small>
          </div>
        </div>
        <div
          style={{
            marginTop: '2rem',
            whiteSpace: 'pre-wrap',
            overflowWrap: 'break-word',
            wordBreak: 'break-word'
          }}
        >
          <AlreadyPosted
            style={{
              marginLeft: '-1rem',
              marginRight: '-1rem'
            }}
            contentId={Number(linkId)}
            contentType="url"
            url={url}
            uploaderId={uploader.id}
          />
          {isEditing ? (
            <div>
              <Input
                placeholder="Enter URL"
                className={css`
                  margin-bottom: '1rem';
                `}
                style={urlExceedsCharLimit?.style}
                value={editedUrl}
                onChange={text => {
                  onSetEditForm({
                    contentId: linkId,
                    contentType: 'url',
                    form: {
                      editedUrl: text
                    }
                  });
                }}
              />
              <Textarea
                minRows={4}
                placeholder="Enter Description"
                value={editedDescription}
                onChange={event => {
                  onSetEditForm({
                    contentId: linkId,
                    contentType: 'url',
                    form: {
                      editedDescription: event.target.value
                    }
                  });
                }}
                onKeyUp={event => {
                  if (event.key === ' ') {
                    onSetEditForm({
                      contentId: linkId,
                      contentType: 'url',
                      form: {
                        editedDescription: addEmoji(event.target.value)
                      }
                    });
                  }
                }}
                style={{
                  marginTop: '1rem',
                  ...(descriptionExceedsCharLimit?.style || {})
                }}
              />
              {descriptionExceedsCharLimit && (
                <small style={{ color: 'red' }}>
                  {descriptionExceedsCharLimit?.message}
                </small>
              )}
              <div style={{ justifyContent: 'center', display: 'flex' }}>
                <Button
                  transparent
                  style={{ marginRight: '1rem' }}
                  onClick={onEditCancel}
                >
                  Cancel
                </Button>
                <Button
                  color="blue"
                  disabled={determineEditButtonDoneStatus()}
                  onClick={onEditFinish}
                >
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <LongText lines={20}>{description || ''}</LongText>
          )}
        </div>
      </div>
    );

    function determineEditButtonDoneStatus() {
      const urlIsEmpty = stringIsEmpty(editedUrl);
      const urlIsValid = isValidUrl(editedUrl);
      const titleIsEmpty = stringIsEmpty(editedTitle);
      const titleChanged = editedTitle !== title;
      const urlChanged = editedUrl !== url;
      const descriptionChanged = editedDescription !== description;
      if (!urlIsValid) return true;
      if (urlIsEmpty) return true;
      if (titleIsEmpty) return true;
      if (!titleChanged && !descriptionChanged && !urlChanged) return true;
      if (titleExceedsCharLimit) return true;
      if (descriptionExceedsCharLimit) return true;
      if (urlExceedsCharLimit) return true;
      return false;
    }

    function onEditCancel() {
      onSetEditForm({
        contentId: linkId,
        contentType: 'url',
        form: undefined
      });
      onSetIsEditing({
        contentId: linkId,
        contentType: 'url',
        isEditing: false
      });
    }

    async function onEditFinish() {
      await onEditDone({
        editedUrl,
        editedTitle: finalizeEmoji(editedTitle),
        editedDescription: finalizeEmoji(editedDescription),
        contentId: linkId,
        contentType: 'url'
      });
      onSetIsEditing({
        contentId: linkId,
        contentType: 'url',
        isEditing: false
      });
    }
  }, [
    description,
    descriptionExceedsCharLimit,
    editButtonShown,
    editForm,
    isEditing,
    linkId,
    title,
    titleExceedsCharLimit,
    uploader,
    url,
    urlExceedsCharLimit,
    userCanEditThis,
    editMenuItems
  ]);
}
