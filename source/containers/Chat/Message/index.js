import React, {
  memo,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import PropTypes from 'prop-types';
import FileUploadStatusIndicator from 'components/FileUploadStatusIndicator';
import ProfilePic from 'components/ProfilePic';
import UsernameText from 'components/Texts/UsernameText';
import Chess from '../Chess';
import GameOverMessage from './GameOverMessage';
import FileViewer from 'components/FileViewer';
import TextMessage from './TextMessage';
import Icon from 'components/Icon';
import DropdownButton from 'components/Buttons/DropdownButton';
import TargetMessage from './TargetMessage';
import RewardMessage from './RewardMessage';
import LocalContext from '../Context';
import MessageRewardModal from './MessageRewardModal';
import { socket } from 'constants/io';
import { unix } from 'moment';
import { MessageStyle } from '../Styles';
import { fetchURLFromText } from 'helpers/stringHelpers';
import { useLazyLoad, useMyState, useContentState } from 'helpers/hooks';
import { Color } from 'constants/css';
import { css } from 'emotion';
import { useInView } from 'react-intersection-observer';
import {
  useAppContext,
  useContentContext,
  useNotiContext,
  useChatContext
} from 'contexts';

Message.propTypes = {
  checkScrollIsAtTheBottom: PropTypes.func.isRequired,
  chessCountdownNumber: PropTypes.number,
  chessOpponent: PropTypes.object,
  channelId: PropTypes.number,
  channelName: PropTypes.string,
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
  onDropdownButtonClick: PropTypes.func,
  onReceiveNewMessage: PropTypes.func,
  onReplyClick: PropTypes.func,
  onRewardClick: PropTypes.func,
  onRewardMessageSubmit: PropTypes.func.isRequired,
  onSetScrollToBottom: PropTypes.func,
  recepientId: PropTypes.number
};

function Message({
  channelId,
  channelName,
  chessCountdownNumber,
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
    rewardAmount,
    rewardReason,
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
  onDropdownButtonClick,
  onReceiveNewMessage,
  onReplyClick,
  onRewardMessageSubmit,
  onSetScrollToBottom,
  recepientId,
  showSubjectMsgsModal
}) {
  const [ComponentRef, inView] = useInView({
    threshold: 0
  });
  const PanelRef = useRef(null);
  useLazyLoad({
    PanelRef,
    inView,
    onSetPlaceholderHeight: handleSetPlaceholderHeight,
    onSetVisible: handleSetVisible,
    delay: 1000
  });
  const { onFileUpload } = useContext(LocalContext);
  const {
    authLevel,
    canDelete,
    canEdit,
    canStar,
    userId: myId,
    username: myUsername,
    profilePicId: myProfilePicId
  } = useMyState();
  const userIsUploader = myId === userId;
  const userCanEditThis =
    ((canEdit || canDelete) && authLevel > uploaderAuthLevel) || userIsUploader;
  const userCanRewardThis = useMemo(
    () => canStar && authLevel > uploaderAuthLevel && myId !== userId,
    [authLevel, canStar, uploaderAuthLevel, userId, myId]
  );
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
  const { thumbUrl: recentThumbUrl } = useContentState({
    contentType: 'chat',
    contentId: messageId
  });

  const {
    state: {
      filesBeingUploaded,
      reconnecting,
      replyTarget,
      [`message${messageId}`]: { placeholderHeight, visible } = {}
    },
    actions: {
      onEditMessage,
      onSaveMessage,
      onSetPlaceholderHeight,
      onSetReplyTarget,
      onSetVisible,
      onUpdateChessMoveViewTimeStamp,
      onUpdateRecentChessMessage
    }
  } = useChatContext();

  const [uploadStatus = {}] = useMemo(
    () =>
      filesBeingUploaded[channelId]?.filter(
        ({ filePath: path }) => path === filePath
      ) || [],
    [channelId, filePath, filesBeingUploaded]
  );
  const {
    state: { socketConnected }
  } = useNotiContext();
  let { username, profilePicId, targetMessage, ...post } = message;
  const [messageRewardModalShown, setMessageRewardModalShown] = useState(false);
  const [extractedUrl, setExtractedUrl] = useState('');
  const [onEdit, setOnEdit] = useState(false);
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
      socket.emit('new_chat_message', {
        message: {
          ...message,
          uploaderAuthLevel: authLevel,
          isNewMessage: true,
          id: messageId
        },
        channel: {
          ...currentChannel,
          numUnreads: 1,
          lastMessage: {
            content,
            sender: { id: userId, username }
          }
        }
      });
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
      onSetScrollToBottom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onEdit, reconnecting]);

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

  const messageMenuItems = [
    {
      label: (
        <>
          <Icon icon="reply" />
          <span style={{ marginLeft: '1rem' }}>Reply</span>
        </>
      ),
      onClick: () => {
        onSetReplyTarget({ ...message, thumbUrl: thumbUrl || recentThumbUrl });
        onReplyClick();
      }
    }
  ];
  if (userCanEditThis) {
    messageMenuItems.push({
      label: (
        <>
          <Icon icon="pencil-alt"></Icon>
          <span style={{ marginLeft: '1rem' }}>Edit</span>
        </>
      ),
      onClick: () => {
        setOnEdit(true);
      }
    });
  }
  if (userIsUploader || canDelete) {
    messageMenuItems.push({
      label: (
        <>
          <Icon icon="trash-alt"></Icon>
          <span style={{ marginLeft: '1rem' }}>Remove</span>
        </>
      ),
      onClick: () => {
        onDelete({ messageId });
      }
    });
  }
  if (userCanRewardThis && channelId === 2) {
    messageMenuItems.push({
      label: (
        <>
          <Icon icon="star"></Icon>
          <span style={{ marginLeft: '1rem' }}>Reward</span>
        </>
      ),
      style: { color: '#fff', background: Color.pink() },
      className: css`
        opacity: 0.9;
        &:hover {
          opacity: 1 !important;
        }
      `,
      onClick: () => setMessageRewardModalShown(true)
    });
  }
  const dropdownButtonShown =
    !!messageId && !isNotification && !isChessMsg && !onEdit;

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
    <div ref={ComponentRef}>
      {inView || visible !== false ? (
        <div ref={PanelRef} className={MessageStyle.container}>
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
                  countdownNumber={chessCountdownNumber}
                  gameWinnerId={gameWinnerId}
                  loaded
                  spoilerOff={spoilerOff}
                  myId={myId}
                  initialState={chessState}
                  moveViewed={!!moveViewTimeStamp}
                  onBoardClick={onChessBoardClick}
                  onSpoilerClick={handleChessSpoilerClick}
                  opponentId={chessOpponent?.id}
                  opponentName={chessOpponent?.username}
                  senderId={userId}
                  style={{ marginTop: '1rem', width: '100%' }}
                />
              ) : fileToUpload && !loading ? (
                <FileUploadStatusIndicator
                  key={channelId}
                  fileName={fileToUpload.name}
                  onFileUpload={handleFileUpload}
                  uploadComplete={!!uploadStatus.uploadComplete}
                  uploadProgress={uploadStatus.uploadProgress}
                />
              ) : (
                <>
                  {targetMessage && (
                    <TargetMessage
                      message={targetMessage}
                      onScrollToBottom={handleScrollToBottom}
                    />
                  )}
                  {filePath && (
                    <FileViewer
                      contextType="chat"
                      content={content}
                      filePath={filePath}
                      fileName={fileName}
                      fileSize={fileSize}
                      scrollAtBottom={scrollAtBottom}
                      style={{ marginTop: '1rem' }}
                    />
                  )}
                  {rewardAmount ? (
                    <RewardMessage
                      rewardAmount={rewardAmount}
                      rewardReason={rewardReason}
                    />
                  ) : (
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
                      onScrollToBottom={handleScrollToBottom}
                      showSubjectMsgsModal={showSubjectMsgsModal}
                      socketConnected={socketConnected}
                      subjectId={subjectId}
                      targetMessage={targetMessage}
                      userCanEditThis={userCanEditThis}
                    />
                  )}
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
                onButtonClick={onDropdownButtonClick}
                menuProps={messageMenuItems}
              />
            )}
          </div>
          {messageRewardModalShown && (
            <MessageRewardModal
              userToReward={{
                username,
                id: userId
              }}
              onSubmit={handleRewardMessageSubmit}
              onHide={() => setMessageRewardModalShown(false)}
            />
          )}
        </div>
      ) : (
        <div
          style={{
            width: '100%',
            padding: '1rem 0',
            height: placeholderHeight
          }}
        />
      )}
    </div>
  );

  function handleEditCancel() {
    setOnEdit(false);
  }

  async function handleEditDone(editedMessage) {
    await editMessage({ editedMessage, messageId });
    onEditMessage({ editedMessage, messageId });
    socket.emit('edit_chat_message', { channelId, editedMessage, messageId });
    setOnEdit(false);
  }

  function handleFileUpload() {
    onFileUpload({
      channelId,
      content,
      filePath,
      fileToUpload,
      userId,
      recepientId,
      targetMessageId: replyTarget?.id,
      subjectId
    });
  }

  function handleRewardMessageSubmit({ reasonId, amount }) {
    onRewardMessageSubmit({ amount, reasonId, message });
  }

  function handleScrollToBottom() {
    if (isLastMsg) {
      onSetScrollToBottom();
    }
  }

  function handleSetPlaceholderHeight(height) {
    onSetPlaceholderHeight({
      messageId,
      height
    });
  }

  function handleSetVisible(visible) {
    onSetVisible({
      messageId,
      visible
    });
  }

  async function handleChessSpoilerClick() {
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

export default memo(Message);
