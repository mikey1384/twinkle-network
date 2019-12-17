import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import FileUploadStatusIndicator from './FileUploadStatusIndicator';
import { unix } from 'moment';
import ProfilePic from 'components/ProfilePic';
import UsernameText from 'components/Texts/UsernameText';
import Chess from '../Chess';
import ErrorBoundary from 'components/ErrorBoundary';
import GameOverMessage from './GameOverMessage';
import FileViewer from './FileViewer';
import TextMessage from './TextMessage';
import Icon from 'components/Icon';
import DropdownButton from 'components/Buttons/DropdownButton';
import TargetMessage from './TargetMessage';
import { socket } from 'constants/io';
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
  currentChannel: PropTypes.object,
  message: PropTypes.object,
  style: PropTypes.object,
  onDelete: PropTypes.func,
  showSubjectMsgsModal: PropTypes.func,
  index: PropTypes.number,
  isLastMsg: PropTypes.bool,
  isNotification: PropTypes.bool,
  loading: PropTypes.bool,
  onChessBoardClick: PropTypes.func,
  onChessSpoilerClick: PropTypes.func,
  onReceiveNewMessage: PropTypes.func,
  onReplyClick: PropTypes.func,
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
  currentChannel,
  index,
  isLastMsg,
  isNotification,
  loading,
  message,
  message: {
    id: messageId,
    attachmentHidden,
    fileToUpload,
    fileName,
    userId,
    timeStamp,
    content,
    filePath,
    fileSize,
    gameWinnerId,
    subjectId,
    isNewMessage,
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
  onReplyClick,
  onSendFileMessage,
  recepientId,
  setScrollToBottom,
  showSubjectMsgsModal
}) {
  const {
    authLevel,
    canDelete,
    canEdit,
    userId: myId,
    username: myUsername,
    profilePicId: myProfilePicId
  } = useMyState();
  const userIsUploader = myId === userId;
  const userCanEditThis =
    ((canEdit || canDelete) && authLevel > uploaderAuthLevel) || userIsUploader;
  const {
    requestHelpers: { editMessage, saveMessage, setChessMoveViewTimeStamp }
  } = useAppContext();
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
    state: { reconnecting },
    actions: {
      onEditMessage,
      onSaveMessage,
      onSetReplyTarget,
      onUpdateChessMoveViewTimeStamp,
      onUpdateRecentChessMessage
    }
  } = useChatContext();
  const {
    state: { socketConnected }
  } = useNotiContext();
  let { username, profilePicId, targetMessage, ...post } = message;
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
      userIsUploader &&
      !message.id &&
      !message.fileToUpload &&
      !message.isSubject &&
      !message.isNotification
    ) {
      handleSaveMessage();
    }
    async function handleSaveMessage() {
      const messageId = await saveMessage({
        message: post,
        targetMessageId: targetMessage?.id
      });
      onSaveMessage({ messageId, index });
      socket.emit(
        'new_chat_message',
        {
          ...message,
          uploaderAuthLevel: authLevel,
          isNewMessage: true,
          id: messageId
        },
        {
          ...currentChannel,
          numUnreads: 1,
          lastMessage: {
            content,
            sender: { id: userId, username }
          },
          channelName
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId, moveViewTimeStamp]);

  useEffect(() => {
    if (isLastMsg && (!isNewMessage || userIsUploader)) {
      setScrollToBottom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onEdit, editPadding, reconnecting]);

  useEffect(() => {
    const url = fetchURLFromText(content);
    if (url) {
      setExtractedUrl(url);
      onSetEmbeddedUrl({ contentId: messageId, contentType: 'chat', url });
      if (linkDescription) {
        onSetActualDescription({
          contentId: messageId,
          contentType: 'chat',
          description: linkDescription
        });
      }
      if (linkTitle) {
        onSetActualTitle({
          contentId: messageId,
          contentType: 'chat',
          title: linkTitle
        });
      }
      if (linkUrl) {
        onSetSiteUrl({
          contentId: messageId,
          contentType: 'chat',
          siteUrl: linkUrl
        });
      }
      if (thumbUrl) {
        onSetThumbUrl({
          contentId: messageId,
          contentType: 'chat',
          thumbUrl
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  useEffect(() => {
    if (isLastMsg && isNewMessage && !userIsUploader) {
      onReceiveNewMessage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const editMenuItems = [
    {
      label: (
        <>
          <Icon icon="reply" />
          <span style={{ marginLeft: '1rem' }}>Reply</span>
        </>
      ),
      onClick: () => {
        onSetReplyTarget(message);
        onReplyClick();
        setEditPadding(false);
      }
    }
  ];
  if (userCanEditThis) {
    editMenuItems.push({
      label: (
        <>
          <Icon icon="pencil-alt"></Icon>
          <span style={{ marginLeft: '1rem' }}>Edit</span>
        </>
      ),
      onClick: () => {
        setOnEdit(true);
        setEditPadding(false);
      }
    });
  }
  if (userIsUploader || canDelete) {
    editMenuItems.push({
      label: (
        <>
          <Icon icon="trash-alt"></Icon>
          <span style={{ marginLeft: '1rem' }}>Remove</span>
        </>
      ),
      onClick: () => {
        setEditPadding(false);
        onDelete({ messageId });
      }
    });
  }
  const dropdownButtonShown =
    !!messageId && !isNotification && !isChessMsg && !onEdit;

  return !chessState && gameWinnerId ? (
    <GameOverMessage
      winnerId={gameWinnerId}
      opponentName={channelName}
      myId={myId}
    />
  ) : (
    <ErrorBoundary>
      <div className={MessageStyle.container}>
        <div className={MessageStyle.profilePic}>
          <ProfilePic
            style={{ width: '100%', height: '100%' }}
            userId={userId}
            profilePicId={profilePicId}
          />
        </div>
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
              {unix(timeStamp).format('LLL')}
            </span>
          </div>
          <div>
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
            ) : fileToUpload && !loading ? (
              <FileUploadStatusIndicator
                key={channelId}
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
                {targetMessage && <TargetMessage message={targetMessage} />}
                {filePath && (
                  <FileViewer
                    content={content}
                    filePath={filePath}
                    fileName={fileName}
                    fileSize={fileSize}
                    scrollAtBottom={scrollAtBottom}
                  />
                )}
                <TextMessage
                  attachmentHidden={!!attachmentHidden}
                  channelId={channelId}
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
                  targetMessage={targetMessage}
                  userCanEditThis={userCanEditThis}
                />
              </>
            )}
          </div>
          {dropdownButtonShown && (
            <DropdownButton
              skeuomorphic
              color="darkerGray"
              icon="chevron-down"
              style={{ position: 'absolute', top: 0, right: '5px' }}
              direction="left"
              opacity={0.8}
              onButtonClick={menuDisplayed => {
                if (isLastMsg) {
                  if (!filePath && !extractedUrl) {
                    setEditPadding(!menuDisplayed);
                  }
                  setScrollToBottom();
                }
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
    await editMessage({ editedMessage, messageId });
    onEditMessage({ editedMessage, messageId });
    socket.emit('edit_chat_message', { channelId, editedMessage, messageId });
    setOnEdit(false);
  }

  async function handleSpoilerClick() {
    onSetReplyTarget(null);
    try {
      await setChessMoveViewTimeStamp({ channelId, message });
      onUpdateChessMoveViewTimeStamp();
      onChessSpoilerClick(userId);
    } catch (error) {
      console.error(error);
    }
  }
}
