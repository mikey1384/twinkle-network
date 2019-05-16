import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import ProfilePic from 'components/ProfilePic';
import UsernameText from 'components/Texts/UsernameText';
import DropdownButton from 'components/Buttons/DropdownButton';
import EditTextArea from 'components/Texts/EditTextArea';
import Button from 'components/Button';
import Chess from '../Chess';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { connect } from 'react-redux';
import { processedStringWithURL } from 'helpers/stringHelpers';
import { setChessMoveViewTimeStamp } from 'helpers/requestHelpers';
import {
  editMessage,
  saveMessage,
  updateChessMoveViewTimeStamp
} from 'redux/actions/ChatActions';
import { MessageStyle } from '../Styles';
import { Color } from 'constants/css';

Message.propTypes = {
  authLevel: PropTypes.number,
  canDelete: PropTypes.bool,
  canEdit: PropTypes.bool,
  channelId: PropTypes.number,
  channelName: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  message: PropTypes.object,
  style: PropTypes.object,
  myId: PropTypes.number,
  onDelete: PropTypes.func,
  onEditDone: PropTypes.func,
  saveMessage: PropTypes.func,
  showSubjectMsgsModal: PropTypes.func,
  index: PropTypes.number,
  isLastMsg: PropTypes.bool,
  onChessBoardClick: PropTypes.func,
  onChessSpoilerClick: PropTypes.func,
  setScrollToBottom: PropTypes.func,
  socketConnected: PropTypes.bool,
  updateChessMoveViewTimeStamp: PropTypes.func
};

function Message({
  authLevel,
  canDelete,
  canEdit,
  channelId,
  channelName,
  dispatch,
  index,
  isLastMsg,
  message,
  message: {
    id: messageId,
    userId,
    timeStamp,
    content,
    subjectId,
    isReloadedSubject,
    isSubject,
    numMsgs,
    uploaderAuthLevel,
    moveViewTimeStamp,
    isChessMove,
    chessState
  },
  myId,
  onChessBoardClick,
  onDelete,
  onEditDone,
  onChessSpoilerClick,
  saveMessage,
  setScrollToBottom,
  showSubjectMsgsModal,
  socketConnected,
  style,
  updateChessMoveViewTimeStamp
}) {
  const { username, profilePicId, ...post } = message;
  const [onEdit, setOnEdit] = useState(false);
  const [editPadding, setEditPadding] = useState(false);

  useEffect(() => {
    if (
      !message.id &&
      message.userId === myId &&
      !message.isSubject &&
      !message.isNotification
    ) {
      saveMessage(post, index);
    }
  }, []);
  useEffect(() => {
    if (isLastMsg && message.userId === myId) {
      setTimeout(() => setScrollToBottom(), 0);
    }
  }, [editPadding]);
  const userMadeLastMove = JSON.parse(chessState)?.move?.by === myId;
  const userIsUploader = myId === userId;
  const userCanEditThis =
    (canEdit || canDelete) && authLevel > uploaderAuthLevel;
  const editButtonShown = userIsUploader || userCanEditThis;
  const editMenuItems = [];
  const spoilerOn = handleSpoilerOn();
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
            {isChessMove ? (
              <div
                style={{
                  position: 'relative',
                  background: Color.subtitleGray(),
                  margin: '1rem 1rem 0 0'
                }}
              >
                <Chess
                  loaded
                  spoilerOn={spoilerOn}
                  myId={myId}
                  initialState={chessState}
                  moveViewed={!!moveViewTimeStamp}
                  onBoardClick={onChessBoardClick}
                  onSpoilerClick={handleSpoilerClick}
                  opponentName={channelName}
                  userMadeLastMove={userMadeLastMove}
                />
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );

  async function handleEditDone(editedMessage) {
    await onEditDone({ editedMessage, messageId: message.id });
    setOnEdit(false);
  }

  async function handleSpoilerClick() {
    await setChessMoveViewTimeStamp({ channelId, messageId, dispatch });
    updateChessMoveViewTimeStamp();
    onChessSpoilerClick();
  }

  function handleSpoilerOn() {
    if (!userMadeLastMove && !moveViewTimeStamp) {
      return true;
    }
    return false;
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
  dispatch => ({
    dispatch,
    onEditDone: params => dispatch(editMessage(params)),
    saveMessage: (params, index) => dispatch(saveMessage(params, index)),
    updateChessMoveViewTimeStamp: params =>
      dispatch(updateChessMoveViewTimeStamp(params))
  })
)(Message);
