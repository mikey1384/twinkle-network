import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import DropdownButton from 'components/Buttons/DropdownButton';
import EditTextArea from 'components/Texts/EditTextArea';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { Color } from 'constants/css';
import { processedStringWithURL } from 'helpers/stringHelpers';

TextMessage.propTypes = {
  authLevel: PropTypes.number,
  canDelete: PropTypes.bool,
  canEdit: PropTypes.bool,
  content: PropTypes.string.isRequired,
  messageId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  myId: PropTypes.number,
  isLastMsg: PropTypes.bool,
  isNotification: PropTypes.bool,
  isReloadedSubject: PropTypes.bool,
  isSubject: PropTypes.bool,
  MessageStyle: PropTypes.object,
  numMsgs: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onDelete: PropTypes.func.isRequired,
  onEditDone: PropTypes.func.isRequired,
  setScrollToBottom: PropTypes.func.isRequired,
  showSubjectMsgsModal: PropTypes.func.isRequired,
  socketConnected: PropTypes.bool,
  subjectId: PropTypes.number,
  uploaderAuthLevel: PropTypes.number,
  uploaderId: PropTypes.number
};

export default function TextMessage({
  authLevel,
  canDelete,
  canEdit,
  content,
  isLastMsg,
  isNotification,
  isReloadedSubject,
  isSubject,
  messageId,
  MessageStyle,
  myId,
  numMsgs,
  onDelete,
  onEditDone,
  subjectId,
  uploaderAuthLevel,
  setScrollToBottom,
  showSubjectMsgsModal,
  socketConnected,
  uploaderId
}) {
  const [onEdit, setOnEdit] = useState(false);
  const [editPadding, setEditPadding] = useState(false);
  const userIsUploader = myId === uploaderId;
  const userCanEditThis =
    ((canEdit || canDelete) && authLevel > uploaderAuthLevel) || userIsUploader;
  useEffect(() => {
    if (isLastMsg && userCanEditThis) {
      setTimeout(() => setScrollToBottom(), 0);
    }
  }, [editPadding]);
  const editMenuItems = [];
  if (userIsUploader || canEdit) {
    editMenuItems.push({
      label: 'Edit',
      onClick: () => {
        setOnEdit(true);
        setEditPadding(false);
      }
    });
  }
  if (userIsUploader || canDelete) {
    editMenuItems.push({
      label: 'Remove',
      onClick: () => {
        setEditPadding(false);
        onDelete({ messageId });
      }
    });
  }
  const dropdownButtonShown =
    !!messageId &&
    !isReloadedSubject &&
    (userIsUploader || userCanEditThis) &&
    !onEdit;

  return (
    <ErrorBoundary>
      {onEdit ? (
        <EditTextArea
          autoFocus
          disabled={!socketConnected}
          rows={2}
          text={content}
          onCancel={handleEditCancel}
          onEditDone={handleEditDone}
        />
      ) : (
        <div>
          <div className={MessageStyle.messageWrapper}>
            {renderPrefix()}
            <span
              style={{ color: isNotification ? Color.gray() : undefined }}
              dangerouslySetInnerHTML={{
                __html: processedStringWithURL(content)
              }}
            />
          </div>
          {dropdownButtonShown && (
            <DropdownButton
              skeuomorphic
              color="darkerGray"
              style={{ position: 'absolute', top: 0, right: '5px' }}
              direction="left"
              opacity={0.8}
              onButtonClick={menuDisplayed => {
                setEditPadding(!menuDisplayed && isLastMsg);
              }}
              onOutsideClick={() => {
                setEditPadding(false);
              }}
              menuProps={editMenuItems}
            />
          )}
          {!!isReloadedSubject && !!numMsgs && numMsgs > 0 && (
            <div className={MessageStyle.relatedConversationsButton}>
              <Button
                filled
                color="logoBlue"
                onClick={() => showSubjectMsgsModal({ subjectId, content })}
              >
                Show related conversations
              </Button>
            </div>
          )}
        </div>
      )}
      {editPadding && <div style={{ height: '10rem' }} />}
    </ErrorBoundary>
  );

  function handleEditCancel() {
    setOnEdit(false);
    setEditPadding(false);
  }

  async function handleEditDone(editedMessage) {
    await onEditDone({ editedMessage, messageId });
    setOnEdit(false);
  }

  function renderPrefix() {
    let prefix = '';
    if (isSubject) {
      prefix = <span className={MessageStyle.subjectPrefix}>Subject: </span>;
    }
    if (isReloadedSubject) {
      prefix = (
        <span className={MessageStyle.subjectPrefix}>
          {'Returning Subject: '}
        </span>
      );
    }
    return prefix;
  }
}
