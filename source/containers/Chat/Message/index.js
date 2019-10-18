import React, { useEffect, useMemo, useState } from 'react';
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
import { MessageStyle } from '../Styles';
import { fetchURLFromText } from 'helpers/stringHelpers';
import { useMyState } from 'helpers/hooks';
import {
  useAppContext,
  useContentContext,
  useNotiContext,
  useChatContext
} from 'contexts';

Message.propTypes = {
  checkScrollIsAtTheBottom: PropTypes.func.isRequired,
  chessOpponent: PropTypes.object,
  channelId: PropTypes.number,
  channelName: PropTypes.string,
  chessCountdownObj: PropTypes.object,
  message: PropTypes.object,
  style: PropTypes.object,
  onDelete: PropTypes.func,
  showSubjectMsgsModal: PropTypes.func,
  index: PropTypes.number,
  isLastMsg: PropTypes.bool,
  isNotification: PropTypes.bool,
  onChessBoardClick: PropTypes.func,
  onChessSpoilerClick: PropTypes.func,
  onReceiveNewMessage: PropTypes.func,
  onSendFileMessage: PropTypes.func.isRequired,
  recepientId: PropTypes.number,
  setScrollToBottom: PropTypes.func
};

export default function Message({
  channelId,
  channelName,
  checkScrollIsAtTheBottom,
  chessCountdownObj,
  chessOpponent,
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
    linkDescription,
    linkTitle,
    linkUrl,
    thumbUrl
  },
  onChessBoardClick,
  onDelete,
  onChessSpoilerClick,
  onReceiveNewMessage,
  onSendFileMessage,
  recepientId,
  setScrollToBottom,
  showSubjectMsgsModal
}) {
  const {
    requestHelpers: { editMessage, saveMessage, setChessMoveViewTimeStamp }
  } = useAppContext();
  const {
    authLevel,
    canDelete,
    canEdit,
    userId: myId,
    username: myUsername,
    profilePicId: myProfilePicId
  } = useMyState();
  const {
    actions: {
      onSetEmbeddedUrl,
      onSetActualDescription,
      onSetActualTitle,
      onSetSiteUrl,
      onSetThumbUrl
    }
  } = useContentContext();
  const {
    actions: {
      onEditMessage,
      onSaveMessage,
      onUpdateChessMoveViewTimeStamp,
      onUpdateRecentChessMessage
    }
  } = useChatContext();
  const {
    state: { socketConnected }
  } = useNotiContext();
  let { username, profilePicId, ...post } = message;
  const [extractedUrl, setExtractedUrl] = useState('');
  const [onEdit, setOnEdit] = useState(false);
  const [editPadding, setEditPadding] = useState(false);
  const [spoilerOff, setSpoilerOff] = useState(false);
  if (fileToUpload && !userId) {
    userId = myId;
    username = myUsername;
    profilePicId = myProfilePicId;
  }
  useEffect(() => {
    if (!message.id && message.isChessMsg) {
      onUpdateRecentChessMessage(message);
    }
    if (
      message.userId === myId &&
      !message.id &&
      !message.fileToUpload &&
      !message.isSubject &&
      !message.isNotification
    ) {
      handleSaveMessage();
    }
    async function handleSaveMessage() {
      const messageId = await saveMessage(post);
      onSaveMessage({ messageId, index });
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
      setScrollToBottom();
    }
  }, [onEdit, editPadding]);

  useEffect(() => {
    const url = fetchURLFromText(content);
    if (url) {
      setExtractedUrl(url);
      onSetEmbeddedUrl({ contentId: messageId, contentType: 'chat', url });
      onSetActualDescription({
        contentId: messageId,
        contentType: 'chat',
        description: linkDescription
      });
      onSetActualTitle({
        contentId: messageId,
        contentType: 'chat',
        title: linkTitle
      });
      onSetSiteUrl({
        contentId: messageId,
        contentType: 'chat',
        siteUrl: linkUrl
      });
      onSetThumbUrl({
        contentId: messageId,
        contentType: 'chat',
        thumbUrl
      });
    }
  }, [content]);

  useEffect(() => {
    if (isLastMsg && !message.id) {
      onReceiveNewMessage();
    }
  }, []);

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

  return useMemo(
    () =>
      !chessState && gameWinnerId ? (
        <GameOverMessage
          winnerId={gameWinnerId}
          opponentName={channelName}
          myId={myId}
        />
      ) : (
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
                    opponentId={chessOpponent?.id}
                    opponentName={chessOpponent?.username}
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
                    recepientId={recepientId}
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
      ),
    [
      extractedUrl,
      onEdit,
      editPadding,
      spoilerOff,
      channelId,
      dropdownButtonShown,
      editMenuItems,
      moveViewTimeStamp,
      profilePicId,
      username,
      authLevel,
      canDelete,
      canEdit,
      myId,
      myUsername,
      myProfilePicId
    ]
  );

  function handleEditCancel() {
    setOnEdit(false);
    setEditPadding(false);
  }

  async function handleEditDone(editedMessage) {
    await editMessage({ editedMessage, messageId });
    onEditMessage({ editedMessage, messageId });
    setOnEdit(false);
  }

  async function handleSpoilerClick() {
    try {
      await setChessMoveViewTimeStamp({ channelId, message });
      onUpdateChessMoveViewTimeStamp();
      onChessSpoilerClick(userId);
    } catch (error) {
      console.error(error);
    }
  }
}
