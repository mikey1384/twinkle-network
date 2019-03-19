import React, { useState } from 'react';
import PropTypes from 'prop-types';
import UsernameText from 'components/Texts/UsernameText';
import DropdownButton from 'components/Buttons/DropdownButton';
import { timeSince } from 'helpers/timeStampHelpers';
import LongText from 'components/Texts/LongText';
import Button from 'components/Button';
import Textarea from 'components/Texts/Textarea';
import Input from 'components/Texts/Input';
import AlreadyPosted from 'components/AlreadyPosted';
import {
  cleanString,
  exceedsCharLimit,
  isValidUrl,
  stringIsEmpty,
  addEmoji,
  finalizeEmoji,
  renderCharLimit
} from 'helpers/stringHelpers';
import { connect } from 'react-redux';
import { css } from 'emotion';

Description.propTypes = {
  canDelete: PropTypes.bool,
  canEdit: PropTypes.bool,
  content: PropTypes.string,
  description: PropTypes.string,
  linkId: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEditDone: PropTypes.func.isRequired,
  timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  title: PropTypes.string.isRequired,
  userCanEditThis: PropTypes.bool,
  uploaderId: PropTypes.number,
  uploaderName: PropTypes.string,
  userIsUploader: PropTypes.bool,
  url: PropTypes.string.isRequired
};

function Description({
  canDelete,
  canEdit,
  content,
  description,
  onDelete,
  onEditDone,
  linkId,
  timeStamp,
  title,
  uploaderName,
  uploaderId,
  url,
  userCanEditThis,
  userIsUploader
}) {
  const [editedTitle, setEditedTitle] = useState(cleanString(title));
  const [editedUrl, setEditedUrl] = useState(content);
  const [editedDescription, setEditedDescription] = useState(description);
  const [onEdit, setOnEdit] = useState(false);

  const editButtonShown = userIsUploader || userCanEditThis;
  const editMenuItems = [];
  if (userIsUploader || canEdit) {
    editMenuItems.push({
      label: 'Edit',
      onClick: () => setOnEdit(true)
    });
  }
  if (userIsUploader || canDelete) {
    editMenuItems.push({
      label: 'Delete',
      onClick: onDelete
    });
  }
  return (
    <div style={{ position: 'relative', padding: '2rem 1rem 0 1rem' }}>
      {editButtonShown && !onEdit && (
        <DropdownButton
          skeuomorph
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
          {onEdit ? (
            <>
              <Input
                type="text"
                className={css`
                  width: 80%;
                `}
                style={titleExceedsCharLimit(editedTitle)}
                placeholder="Enter Title..."
                value={editedTitle}
                onChange={text => {
                  setEditedTitle(text);
                }}
                onKeyUp={event => {
                  if (event.key === ' ') {
                    setEditedTitle(addEmoji(event.target.value));
                  }
                }}
              />
              {titleExceedsCharLimit(editedTitle) && (
                <small style={{ color: 'red' }}>
                  {renderCharLimit({
                    contentType: 'url',
                    inputType: 'title',
                    text: editedTitle
                  })}
                </small>
              )}
            </>
          ) : (
            <h2>{title}</h2>
          )}
        </div>
        <div>
          <small>
            Added by{' '}
            <UsernameText user={{ id: uploaderId, username: uploaderName }} /> (
            {timeSince(timeStamp)})
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
          type="url"
          url={url}
          uploaderId={uploaderId}
        />
        {onEdit ? (
          <div>
            <Input
              placeholder="Enter URL"
              className={css`
                margin-bottom: '1rem';
              `}
              style={urlExceedsCharLimit(editedUrl)}
              value={editedUrl}
              onChange={text => {
                setEditedUrl(text);
              }}
            />
            <Textarea
              minRows={4}
              placeholder="Enter Description"
              value={editedDescription}
              onChange={event => {
                setEditedDescription(event.target.value);
              }}
              onKeyUp={event => {
                if (event.key === ' ') {
                  setEditedDescription(addEmoji(event.target.value));
                }
              }}
              style={{
                marginTop: '1rem',
                ...(descriptionExceedsCharLimit(editedDescription) || {})
              }}
            />
            {descriptionExceedsCharLimit(editedDescription) && (
              <small style={{ color: 'red' }}>
                {renderCharLimit({
                  contentType: 'url',
                  inputType: 'description',
                  text: editedDescription
                })}
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
    if (titleExceedsCharLimit(editedTitle)) return true;
    if (descriptionExceedsCharLimit(editedDescription)) return true;
    if (urlExceedsCharLimit(editedUrl)) return true;
    return false;
  }

  function onEditCancel() {
    setEditedUrl(url);
    setEditedTitle(cleanString(title));
    setEditedDescription(description);
    setOnEdit(false);
  }

  async function onEditFinish() {
    await onEditDone({
      editedUrl,
      editedTitle: finalizeEmoji(editedTitle),
      editedDescription: finalizeEmoji(editedDescription),
      linkId
    });
    setOnEdit(false);
  }

  function descriptionExceedsCharLimit(description) {
    return exceedsCharLimit({
      contentType: 'url',
      inputType: 'description',
      text: description
    });
  }

  function titleExceedsCharLimit(title) {
    return exceedsCharLimit({
      contentType: 'url',
      inputType: 'title',
      text: title
    });
  }

  function urlExceedsCharLimit(url) {
    return exceedsCharLimit({
      contentType: 'url',
      inputType: 'url',
      text: url
    });
  }
}

export default connect(state => ({
  canDelete: state.UserReducer.canDelete,
  canEdit: state.UserReducer.canEdit
}))(Description);
