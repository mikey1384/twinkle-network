import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import FileUploadStatusIndicator from './FileUploadStatusIndicator';
import moment from 'moment';
import ProfilePic from 'components/ProfilePic';
import UsernameText from 'components/Texts/UsernameText';
import Chess from '../../Chess';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import GameOverMessage from './GameOverMessage';
import FileMessage from './FileMessage';
import TextMessage from './TextMessage';
import { connect } from 'react-redux';
import { setChessMoveViewTimeStamp } from 'helpers/requestHelpers';
import {
  editMessage,
  saveMessage,
  updateChessMoveViewTimeStamp
} from 'redux/actions/ChatActions';
import { MessageStyle } from '../../Styles';

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
    scrollAtBottom
  },
  myId,
  myProfilePicId,
  myUsername,
  onChessBoardClick,
  onDelete,
  onEditDone,
  onChessSpoilerClick,
  saveMessage,
  setScrollToBottom,
  showSubjectMsgsModal,
  socketConnected,
  updateChessMoveViewTimeStamp
}) {
  let { username, profilePicId, ...post } = message;
  const [spoilerOff, setSpoilerOff] = useState(false);
  if (fileToUpload && !userId) {
    userId = myId;
    username = myUsername;
    profilePicId = myProfilePicId;
  }
  useEffect(() => {
    if (
      !message.fileToUpload &&
      !message.id &&
      message.userId === myId &&
      !message.isSubject &&
      !message.isNotification
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

  if (!chessState && gameWinnerId) {
    return (
      <GameOverMessage
        winnerId={gameWinnerId}
        opponentName={channelName}
        myId={myId}
      />
    );
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
              />
            ) : filePath ? (
              <FileMessage
                authLevel={authLevel}
                canDelete={canDelete}
                content={content}
                filePath={filePath}
                fileName={fileName}
                fileSize={fileSize}
                isLastMsg={isLastMsg}
                messageId={messageId}
                myId={myId}
                onDelete={onDelete}
                scrollAtBottom={scrollAtBottom}
                setScrollToBottom={setScrollToBottom}
                uploaderAuthLevel={uploaderAuthLevel}
                uploaderId={userId}
              />
            ) : (
              <TextMessage
                authLevel={authLevel}
                canDelete={canDelete}
                canEdit={canEdit}
                content={content}
                messageId={messageId}
                myId={myId}
                numMsgs={numMsgs}
                isLastMsg={isLastMsg}
                isNotification={isNotification}
                isSubject={!!isSubject}
                isReloadedSubject={!!isReloadedSubject}
                MessageStyle={MessageStyle}
                onDelete={onDelete}
                onEditDone={onEditDone}
                setScrollToBottom={setScrollToBottom}
                showSubjectMsgsModal={showSubjectMsgsModal}
                socketConnected={socketConnected}
                subjectId={subjectId}
                uploaderAuthLevel={uploaderAuthLevel}
                uploaderId={userId}
              />
            )}
          </>
        </div>
      </div>
    </ErrorBoundary>
  );

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
