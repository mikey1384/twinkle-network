import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import ProfilePic from 'components/ProfilePic';
import UsernameText from 'components/Texts/UsernameText';
import DropdownButton from 'components/Buttons/DropdownButton';
import EditTextArea from 'components/Texts/EditTextArea';
import Button from 'components/Button';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { connect } from 'react-redux';
import { processedStringWithURL } from 'helpers/stringHelpers';
import { editMessage, saveMessage } from 'redux/actions/ChatActions';
import { MessageStyle } from '../Styles';

Message.propTypes = {
  authLevel: PropTypes.number,
  canDelete: PropTypes.bool,
  canEdit: PropTypes.bool,
  message: PropTypes.object,
  style: PropTypes.object,
  myId: PropTypes.number,
  onDelete: PropTypes.func,
  onEditDone: PropTypes.func,
  saveMessage: PropTypes.func,
  showSubjectMsgsModal: PropTypes.func,
  index: PropTypes.number,
  isLastMsg: PropTypes.bool,
  setScrollToBottom: PropTypes.func,
  socketConnected: PropTypes.bool
};

function Message({
  authLevel,
  canDelete,
  canEdit,
  index,
  isLastMsg,
  message,
  message: {
    id: messageId,
    userId,
    profilePicId,
    username,
    timeStamp,
    content,
    subjectId,
    isReloadedSubject,
    isSubject,
    numMsgs,
    uploaderAuthLevel
  },
  myId,
  onDelete,
  onEditDone,
  saveMessage,
  setScrollToBottom,
  showSubjectMsgsModal,
  socketConnected,
  style
}) {
  const [onEdit, setOnEdit] = useState(false);
  const [editPadding, setEditPadding] = useState(false);

  useEffect(() => {
    if (
      !message.id &&
      message.userId === myId &&
      !message.isSubject &&
      !message.isNotification
    ) {
      saveMessage({ ...message, content: message.content }, index);
    }
  }, []);
  useEffect(() => {
    if (isLastMsg && message.userId === myId) {
      setTimeout(() => setScrollToBottom(), 0);
    }
  }, [editPadding]);
  const userIsUploader = myId === userId;
  const userCanEditThis =
    (canEdit || canDelete) && authLevel > uploaderAuthLevel;
  const editButtonShown = userIsUploader || userCanEditThis;
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
        onDelete(messageId);
      }
    });
  }

  return (
    <ErrorBoundary>
      <div className={MessageStyle.container}>
        <ProfilePic
          className={MessageStyle.profilePic}
          userId={userId}
          profilePicId={profilePicId}
        />
        <div className={MessageStyle.contentWrapper}>
          <div>
            <UsernameText
              style={MessageStyle.usernameText}
              user={{
                id: userId,
                username: username
              }}
            />{' '}
            <span className={MessageStyle.timeStamp}>
              {moment.unix(timeStamp).format('LLL')}
            </span>
          </div>
          <div>
            {onEdit ? (
              <EditTextArea
                autoFocus
                disabled={!socketConnected}
                rows={2}
                text={content}
                onCancel={() => {
                  setOnEdit(false);
                  setEditPadding(false);
                }}
                onEditDone={handleEditDone}
              />
            ) : (
              <div>
                <div className={MessageStyle.messageWrapper}>
                  {renderPrefix()}
                  <span
                    style={style}
                    dangerouslySetInnerHTML={{
                      __html: processedStringWithURL(content)
                    }}
                  />
                </div>
                {!!messageId &&
                  !isReloadedSubject &&
                  editButtonShown &&
                  !onEdit && (
                    <DropdownButton
                      snow
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
                      success
                      onClick={() =>
                        showSubjectMsgsModal({ subjectId, content })
                      }
                    >
                      Show related conversations
                    </Button>
                  </div>
                )}
              </div>
            )}
            {editPadding && <div style={{ height: '10rem' }} />}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );

  async function handleEditDone(editedMessage) {
    await onEditDone({ editedMessage, messageId: message.id });
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

export default connect(
  state => ({
    authLevel: state.UserReducer.authLevel,
    canDelete: state.UserReducer.canDelete,
    canEdit: state.UserReducer.canEdit,
    myId: state.UserReducer.userId,
    socketConnected: state.NotiReducer.socketConnected
  }),
  {
    onEditDone: editMessage,
    saveMessage
  }
)(Message);
