import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import FileUploadStatusIndicator from './FileUploadStatusIndicator';
import moment from 'moment';
import ProfilePic from 'components/ProfilePic';
import UsernameText from 'components/Texts/UsernameText';
import Chess from '../Chess';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import GameOverMessage from './GameOverMessage';
import FileViewer from './FileViewer';
import TextMessage from './TextMessage';
import DropdownButton from 'components/Buttons/DropdownButton';
import { connect } from 'react-redux';
import { setChessMoveViewTimeStamp } from 'helpers/requestHelpers';
import { fetchURLFromText } from 'helpers/stringHelpers';
import {
  editMessage,
  saveMessage,
  updateChessMoveViewTimeStamp
} from 'redux/actions/ChatActions';
import { MessageStyle } from '../Styles';

Message.propTypes = {
  authLevel: PropTypes.number,
  canDelete: PropTypes.bool,
  canEdit: PropTypes.bool,
  checkScrollIsAtTheBottom: PropTypes.func.isRequired,
  channelId: PropTypes.number,
  channelName: PropTypes.string,
  chessCountdownObj: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  message: PropTypes.object,
  style: PropTypes.object,
  myId: PropTypes.number,
  myProfilePicId: PropTypes.number,
  myUsername: PropTypes.string,
  onDelete: PropTypes.func,
  onEditDone: PropTypes.func,
  saveMessage: PropTypes.func,
  showSubjectMsgsModal: PropTypes.func,
  index: PropTypes.number,
  isLastMsg: PropTypes.bool,
  isNotification: PropTypes.bool,
  onChessBoardClick: PropTypes.func,
  onChessSpoilerClick: PropTypes.func,
  onSendFileMessage: PropTypes.func.isRequired,
  partnerId: PropTypes.number,
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
  checkScrollIsAtTheBottom,
  chessCountdownObj,
  dispatch,
  index,
  isLastMsg,
  isNotification,
  message,
  message: {
    id: messageId,
    fileToUpload,
    fileName,
    userId,
    timeStamp,
    content,
    filePath,
    fileSize,
    gameWinnerId,
    subjectId,
    isReloadedSubject,
    isSubject,
    numMsgs,
    uploaderAuthLevel,
    moveViewTimeStamp,
    isChessMsg,
    chessState,
    scrollAtBottom,
    thumbUrl,
    linkUrl,
    linkTitle,
    linkDescription
  },
  myId,
  myProfilePicId,
  myUsername,
  onChessBoardClick,
  onDelete,
  onEditDone,
  onChessSpoilerClick,
  onSendFileMessage,
  partnerId,
  saveMessage,
  setScrollToBottom,
  showSubjectMsgsModal,
  socketConnected,
  updateChessMoveViewTimeStamp
}) {
  let { username, profilePicId, ...post } = message;
  const [onEdit, setOnEdit] = useState(false);
  const [editPadding, setEditPadding] = useState(false);
  const [spoilerOff, setSpoilerOff] = useState(false);
  if (fileToUpload && !userId) {
    userId = myId;
    username = myUsername;
    profilePicId = myProfilePicId;
  }
  useEffect(() => {
    if (
      (message.userId === myId &&
        !message.id &&
        !message.fileToUpload &&
        !message.isSubject &&
        !message.isNotification &&
        !message.isChessMsg) ||
      (message.isChessMsg && message.userId !== myId && !message.id)
    ) {
      saveMessage({ message: post, index });
    }
  }, []);
  useEffect(() => {
    const userMadeLastMove = chessState
      ? JSON.parse(chessState)?.move?.by === myId
      : false;
    if (!userMadeLastMove && !moveViewTimeStamp) {
      setSpoilerOff(false);
    } else {
      setSpoilerOff(true);
    }
  }, [channelId, moveViewTimeStamp]);

  const userIsUploader = myId === userId;
  const userCanEditThis =
    ((canEdit || canDelete) && authLevel > uploaderAuthLevel) || userIsUploader;

  useEffect(() => {
    if (isLastMsg && userCanEditThis) {
      setTimeout(() => setScrollToBottom(), 0);
    }
  }, [onEdit, editPadding]);

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
    !isChessMsg &&
    !onEdit;

  if (!chessState && gameWinnerId) {
    return (
      <GameOverMessage
        winnerId={gameWinnerId}
        opponentName={channelName}
        myId={myId}
      />
    );
  }

  const extractedUrl = fetchURLFromText(content);

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
          <>
            {isChessMsg ? (
              <Chess
                channelId={channelId}
                chessCountdownObj={chessCountdownObj}
                gameWinnerId={gameWinnerId}
                loaded
                spoilerOff={spoilerOff}
                myId={myId}
                initialState={chessState}
                moveViewed={!!moveViewTimeStamp}
                onBoardClick={onChessBoardClick}
                onSpoilerClick={handleSpoilerClick}
                opponentName={channelName}
                style={{ marginTop: '1rem', width: '100%' }}
              />
            ) : fileToUpload ? (
              <FileUploadStatusIndicator
                channelId={channelId}
                checkScrollIsAtTheBottom={checkScrollIsAtTheBottom}
                content={content}
                fileToUpload={fileToUpload}
                filePath={filePath}
                onSendFileMessage={onSendFileMessage}
                partnerId={partnerId}
                subjectId={subjectId}
              />
            ) : (
              <>
                {filePath && (
                  <FileViewer
                    content={content}
                    filePath={filePath}
                    fileName={fileName}
                    fileSize={fileSize}
                    scrollAtBottom={scrollAtBottom}
                    setScrollToBottom={setScrollToBottom}
                  />
                )}
                <TextMessage
                  content={content}
                  extractedUrl={extractedUrl}
                  myId={myId}
                  messageId={messageId}
                  numMsgs={numMsgs}
                  isNotification={isNotification}
                  isSubject={!!isSubject}
                  isReloadedSubject={!!isReloadedSubject}
                  MessageStyle={MessageStyle}
                  onEdit={onEdit}
                  onEditCancel={handleEditCancel}
                  onEditDone={handleEditDone}
                  linkDescription={linkDescription}
                  linkTitle={linkTitle}
                  linkUrl={linkUrl}
                  thumbUrl={thumbUrl}
                  showSubjectMsgsModal={showSubjectMsgsModal}
                  socketConnected={socketConnected}
                  subjectId={subjectId}
                />
              </>
            )}
          </>
          {dropdownButtonShown && (
            <DropdownButton
              skeuomorphic
              color="darkerGray"
              style={{ position: 'absolute', top: 0, right: '5px' }}
              direction="left"
              opacity={0.8}
              onButtonClick={menuDisplayed => {
                setEditPadding(
                  !menuDisplayed && isLastMsg && !filePath && !extractedUrl
                );
              }}
              onOutsideClick={() => {
                setEditPadding(false);
              }}
              menuProps={editMenuItems}
            />
          )}
          {editPadding && <div style={{ height: '10rem' }} />}
        </div>
      </div>
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

  async function handleSpoilerClick() {
    await setChessMoveViewTimeStamp({ channelId, messageId, dispatch });
    updateChessMoveViewTimeStamp();
    onChessSpoilerClick();
  }
}

export default connect(
  state => ({
    authLevel: state.UserReducer.authLevel,
    canDelete: state.UserReducer.canDelete,
    canEdit: state.UserReducer.canEdit,
    myId: state.UserReducer.userId,
    myUsername: state.UserReducer.username,
    myProfilePicId: state.UserReducer.profilePicId,
    socketConnected: state.NotiReducer.socketConnected
  }),
  dispatch => ({
    dispatch,
    onEditDone: params => dispatch(editMessage(params)),
    saveMessage: params => dispatch(saveMessage(params)),
    updateChessMoveViewTimeStamp: params =>
      dispatch(updateChessMoveViewTimeStamp(params))
  })
)(Message);
