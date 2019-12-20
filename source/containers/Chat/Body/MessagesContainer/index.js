import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import ConfirmModal from 'components/Modals/ConfirmModal';
import MessageInput from './MessageInput';
import DropdownButton from 'components/Buttons/DropdownButton';
import Loading from 'components/Loading';
import Message from '../../Message';
import ChannelHeader from './ChannelHeader';
import SubjectMsgsModal from '../../Modals/SubjectMsgsModal';
import UploadModal from '../../Modals/UploadModal';
import Icon from 'components/Icon';
import InviteUsersModal from '../../Modals/InviteUsers';
import AlertModal from 'components/Modals/AlertModal';
import ChessModal from '../../Modals/ChessModal';
import SelectNewOwnerModal from '../../Modals/SelectNewOwnerModal';
import SettingsModal from '../../Modals/SettingsModal';
import ErrorBoundary from 'components/ErrorBoundary';
import { GENERAL_CHAT_ID } from 'constants/database';
import { addEvent, removeEvent } from 'helpers/listenerHelpers';
import { css } from 'emotion';
import { Color } from 'constants/css';
import { socket } from 'constants/io';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useChatContext, useNotiContext } from 'contexts';

MessagesContainer.propTypes = {
  channelName: PropTypes.string,
  chessOpponent: PropTypes.object,
  currentChannel: PropTypes.object.isRequired
};

export default function MessagesContainer({
  channelName,
  chessOpponent,
  currentChannel
}) {
  const {
    requestHelpers: {
      changeChannelOwner,
      deleteMessage,
      editChannelSettings,
      hideChat,
      leaveChannel,
      loadChatChannel,
      loadMoreChatMessages,
      startNewDMChannel
    }
  } = useAppContext();
  const {
    state: { socketConnected }
  } = useNotiContext();
  const {
    state: {
      channelLoading,
      chessModalShown,
      creatingNewDMChannel,
      messagesLoadMoreButton,
      messages,
      messagesLoaded,
      recepientId,
      reconnecting,
      replyTarget,
      selectedChannelId,
      subject
    },
    actions: {
      onDeleteMessage,
      onEditChannelSettings,
      onEnterChannelWithId,
      onHideChat,
      onLeaveChannel,
      onLoadMoreMessages,
      onChannelLoadingDone,
      onSendFirstDirectMessage,
      onSetChessModalShown,
      onSetCreatingNewDMChannel,
      onSetReplyTarget,
      onSubmitMessage
    }
  } = useChatContext();
  const { authLevel, profilePicId, userId, username } = useMyState();
  const [chessCountdownObj, setChessCountdownObj] = useState({});
  const [textAreaHeight, setTextAreaHeight] = useState(0);
  const [fileObj, setFileObj] = useState('');
  const [inviteUsersModalShown, setInviteUsersModalShown] = useState(false);
  const [loadMoreButtonLock, setLoadMoreButtonLock] = useState(false);
  const [newUnseenMessage, setNewUnseenMessage] = useState(false);
  const [uploadModalShown, setUploadModalShown] = useState(false);
  const [alertModalShown, setAlertModalShown] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    shown: false,
    fileName: '',
    filePath: '',
    messageId: null
  });
  const [subjectMsgsModal, setSubjectMsgsModal] = useState({
    shown: false,
    subjectId: null,
    content: ''
  });
  const [settingsModalShown, setSettingsModalShown] = useState(false);
  const [leaveConfirmModalShown, setLeaveConfirmModalShown] = useState(false);
  const [scrollAtBottom, setScrollAtBottom] = useState(true);
  const [selectNewOwnerModalShown, setSelectNewOwnerModalShown] = useState(
    false
  );

  useEffect(() => {
    socket.on('chess_countdown_number_received', onReceiveCountdownNumber);
    socket.on('new_message_received', handleReceiveMessage);

    function onReceiveCountdownNumber({ channelId, number }) {
      if (channelId === selectedChannelId) {
        if (number === 0) {
          onSetChessModalShown(false);
        }
        setChessCountdownObj(chessCountdownObj => ({
          ...chessCountdownObj,
          [channelId]: number
        }));
      }
    }
    function handleReceiveMessage(message) {
      if (message.isChessMsg) {
        setChessCountdownObj(chessCountdownObj => ({
          ...chessCountdownObj,
          [message.channelId]: undefined
        }));
      }
    }

    return function cleanUp() {
      socket.removeListener(
        'chess_countdown_number_received',
        onReceiveCountdownNumber
      );
      socket.removeListener('new_message_received', handleReceiveMessage);
    };
  });

  const ContentRef = useRef(null);
  const MessagesRef = useRef(null);
  const mounted = useRef(null);
  const MessagesContainerRef = useRef({});
  const FileInputRef = useRef(null);
  const ChatInputRef = useRef(null);
  const timerRef = useRef(null);
  const mb = 1000;
  const maxSize = useMemo(
    () =>
      authLevel > 3
        ? 10000 * mb
        : authLevel > 1
        ? 4000 * mb
        : authLevel === 1
        ? 1000 * mb
        : 300 * mb,
    [authLevel]
  );

  const containerHeight = useMemo(() => {
    return `CALC(100% - 1rem - 2px - ${
      textAreaHeight ? `${textAreaHeight}px - 1rem` : '5.5rem'
    }${replyTarget ? ' - 12rem - 2px' : ''})`;
  }, [replyTarget, textAreaHeight]);

  const fillerHeight = useMemo(
    () =>
      MessagesContainerRef.current?.offsetHeight >
      MessagesRef.current?.offsetHeight
        ? MessagesContainerRef.current?.offsetHeight -
          MessagesRef.current?.offsetHeight
        : 20,
    [
      // eslint-disable-next-line react-hooks/exhaustive-deps
      MessagesContainerRef.current?.offsetHeight,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      MessagesRef.current?.offsetHeight
    ]
  );

  const menuProps = useMemo(() => {
    if (currentChannel.twoPeople) {
      return [
        {
          label: <span style={{ fontWeight: 'bold' }}>Hide Chat</span>,
          onClick: handleHideChat
        }
      ];
    }
    let result = [];
    if (!currentChannel.isClosed || currentChannel.creatorId === userId) {
      result.push({
        label: (
          <>
            <Icon icon="users" />
            <span style={{ marginLeft: '1rem' }}>Invite People</span>
          </>
        ),
        onClick: () => setInviteUsersModalShown(true)
      });
    }
    result = result.concat([
      {
        label:
          currentChannel.creatorId === userId ? (
            <>
              <Icon icon="sliders-h" />
              <span style={{ marginLeft: '1rem' }}>Settings</span>
            </>
          ) : (
            <>
              <Icon icon="pencil-alt" />
              <span style={{ marginLeft: '1rem' }}>Edit Channel Name</span>
            </>
          ),
        onClick: () => setSettingsModalShown(true)
      },
      {
        separator: true
      },
      {
        label: (
          <>
            <Icon icon="sign-out-alt" />
            <span style={{ marginLeft: '1rem' }}>Leave</span>
          </>
        ),
        onClick: () => setLeaveConfirmModalShown(true)
      }
    ]);
    return result;
    async function handleHideChat() {
      await hideChat(selectedChannelId);
      onHideChat(selectedChannelId);
      const data = await loadChatChannel({
        channelId: GENERAL_CHAT_ID
      });
      onEnterChannelWithId({ data, showOnTop: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentChannel.twoPeople,
    currentChannel.isClosed,
    currentChannel.creatorId,
    userId,
    selectedChannelId
  ]);

  useEffect(() => {
    const MessagesContainer = MessagesContainerRef.current;
    mounted.current = true;
    addEvent(MessagesContainer, 'scroll', handleScroll);

    return function cleanUp() {
      mounted.current = false;
      removeEvent(MessagesContainer, 'scroll', handleScroll);
    };

    function handleScroll() {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (MessagesContainerRef.current.scrollTop === 0) {
          handleLoadMore();
        }
      }, 200);
    }
  });

  useEffect(() => {
    if (messagesLoaded) {
      setTimeout(() => {
        MessagesContainerRef.current.scrollTop =
          ContentRef.current?.offsetHeight || 0;
        onChannelLoadingDone();
      }, 0);
      setScrollAtBottom(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messagesLoaded, reconnecting]);

  const loading = useMemo(
    () => channelLoading || creatingNewDMChannel || reconnecting,
    [channelLoading, creatingNewDMChannel, reconnecting]
  );

  return (
    <ErrorBoundary>
      {selectedChannelId !== GENERAL_CHAT_ID && (
        <DropdownButton
          skeuomorphic
          color="darkerGray"
          opacity={0.7}
          style={{
            position: 'absolute',
            zIndex: 10,
            top: '1rem',
            right: '1rem'
          }}
          listStyle={{
            width: '15rem'
          }}
          direction="left"
          icon="bars"
          text="Menu"
          menuProps={menuProps}
        />
      )}
      <input
        ref={FileInputRef}
        style={{ display: 'none' }}
        type="file"
        onChange={handleUpload}
      />
      <div
        className={css`
          display: flex;
          flex-direction: column;
          width: 100%;
          position: relative;
          -webkit-overflow-scrolling: touch;
        `}
        style={{
          height: containerHeight
        }}
      >
        {loading && <Loading />}
        <div
          ref={MessagesContainerRef}
          style={{
            position: 'absolute',
            left: '1rem',
            right: '0',
            bottom: '0',
            opacity: loading ? 0 : 1,
            top: selectedChannelId === GENERAL_CHAT_ID ? '7rem' : 0,
            overflowY: 'scroll'
          }}
          onScroll={() => {
            if (
              checkScrollIsAtTheBottom({
                content: ContentRef.current,
                container: MessagesContainerRef.current
              })
            ) {
              setScrollAtBottom(true);
              setNewUnseenMessage(false);
            } else {
              setScrollAtBottom(false);
            }
          }}
        >
          <div ref={ContentRef} style={{ width: '100%' }}>
            {!loading && messagesLoadMoreButton ? (
              <div
                style={{
                  marginTop: '1rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%'
                }}
              >
                <Button
                  filled
                  color="lightBlue"
                  disabled={loadMoreButtonLock}
                  onClick={handleLoadMore}
                >
                  Load More
                </Button>
              </div>
            ) : (
              <div
                style={{
                  height: fillerHeight + 'px'
                }}
              />
            )}
            <div ref={MessagesRef}>
              {messages.map((message, index) => (
                <Message
                  key={selectedChannelId + (message.id || 'newMessage' + index)}
                  channelId={selectedChannelId}
                  channelName={channelName}
                  chessCountdownNumber={chessCountdownObj[selectedChannelId]}
                  chessOpponent={chessOpponent}
                  checkScrollIsAtTheBottom={() =>
                    checkScrollIsAtTheBottom({
                      content: ContentRef.current,
                      container: MessagesContainerRef.current
                    })
                  }
                  currentChannel={currentChannel}
                  index={index}
                  isLastMsg={index === messages.length - 1}
                  isNotification={!!message.isNotification}
                  loading={loading}
                  message={message}
                  onChessBoardClick={handleChessModalShown}
                  onChessSpoilerClick={handleChessSpoilerClick}
                  onSendFileMessage={handleSendFileMessage}
                  onDelete={handleShowDeleteModal}
                  onReceiveNewMessage={handleReceiveNewMessage}
                  onReplyClick={() => ChatInputRef.current.focus()}
                  recepientId={recepientId}
                  setScrollToBottom={handleSetScrollToBottom}
                  showSubjectMsgsModal={({ subjectId, content }) =>
                    setSubjectMsgsModal({ shown: true, subjectId, content })
                  }
                />
              ))}
            </div>
          </div>
        </div>
        {!loading && selectedChannelId === GENERAL_CHAT_ID && <ChannelHeader />}
        <div
          style={{
            position: 'absolute',
            bottom: '1rem',
            display: 'flex',
            justifyContent: 'center',
            width: '100%'
          }}
        >
          {newUnseenMessage && (
            <Button
              filled
              color="orange"
              onClick={() => {
                setNewUnseenMessage(false);
                MessagesContainerRef.current.scrollTop =
                  ContentRef.current.offsetHeight;
              }}
            >
              New Message
            </Button>
          )}
        </div>
        {deleteModal.shown && (
          <ConfirmModal
            onHide={() =>
              setDeleteModal({ shown: false, filePath: '', messageId: null })
            }
            title="Remove Message"
            onConfirm={handleDelete}
          />
        )}
        {subjectMsgsModal.shown && (
          <SubjectMsgsModal
            subjectId={subjectMsgsModal.subjectId}
            subjectTitle={subjectMsgsModal.content}
            onHide={() =>
              setSubjectMsgsModal({
                shown: false,
                subjectId: null,
                content: ''
              })
            }
          />
        )}
      </div>
      <div
        style={{
          background: Color.inputGray(),
          padding: '1rem',
          borderTop: `1px solid ${Color.borderGray()}`
        }}
      >
        {socketConnected ? (
          <MessageInput
            innerRef={ChatInputRef}
            loading={loading}
            myId={userId}
            isTwoPeopleChannel={currentChannel.twoPeople}
            currentChannelId={selectedChannelId}
            currentChannel={currentChannel}
            onChessButtonClick={handleChessModalShown}
            onMessageSubmit={handleMessageSubmit}
            onHeightChange={height => {
              if (height !== textAreaHeight) {
                setTextAreaHeight(height > 46 ? height : 0);
              }
            }}
            onPlusButtonClick={() => FileInputRef.current.click()}
          />
        ) : (
          <div>
            <Loading
              style={{ height: '4.2rem' }}
              innerStyle={{ fontSize: '2rem' }}
              text="Socket disconnected. Reconnecting..."
            />
          </div>
        )}
      </div>
      {alertModalShown && (
        <AlertModal
          title="File is too large"
          content={`The file size is larger than your limit of ${maxSize /
            mb} MB`}
          onHide={() => setAlertModalShown(false)}
        />
      )}
      {chessModalShown && (
        <ChessModal
          channelId={selectedChannelId}
          countdownNumber={chessCountdownObj[selectedChannelId]}
          myId={userId}
          onConfirmChessMove={handleConfirmChessMove}
          onHide={() => onSetChessModalShown(false)}
          onSetChessCountdownObj={setChessCountdownObj}
          onSpoilerClick={handleChessSpoilerClick}
          opponentId={chessOpponent?.id}
          opponentName={chessOpponent?.username}
        />
      )}
      {uploadModalShown && (
        <UploadModal
          channelId={selectedChannelId}
          fileObj={fileObj}
          onHide={() => setUploadModalShown(false)}
          subjectId={subject.id}
        />
      )}
      {inviteUsersModalShown && (
        <InviteUsersModal
          onHide={() => setInviteUsersModalShown(false)}
          currentChannel={currentChannel}
          selectedChannelId={selectedChannelId}
          onDone={handleInviteUsersDone}
        />
      )}
      {settingsModalShown && (
        <SettingsModal
          isClosed={!!currentChannel.isClosed}
          userIsChannelOwner={currentChannel.creatorId === userId}
          channelName={channelName}
          onHide={() => setSettingsModalShown(false)}
          onDone={handleEditSettings}
          channelId={selectedChannelId}
        />
      )}
      {leaveConfirmModalShown && (
        <ConfirmModal
          title="Leave Channel"
          onHide={() => setLeaveConfirmModalShown(false)}
          onConfirm={handleLeaveConfirm}
        />
      )}
      {selectNewOwnerModalShown && (
        <SelectNewOwnerModal
          onHide={() => setSelectNewOwnerModalShown(false)}
          members={currentChannel.members}
          onSubmit={handleSelectNewOwnerAndLeaveChannel}
        />
      )}
    </ErrorBoundary>
  );

  function checkScrollIsAtTheBottom({ content, container }) {
    return content.offsetHeight <= container.offsetHeight + container.scrollTop;
  }

  function handleChessModalShown() {
    const channelId = currentChannel?.id;
    if (chessCountdownObj[channelId] !== 0) {
      onSetReplyTarget(null);
      onSetChessModalShown(true);
    }
  }

  function handleChessSpoilerClick(senderId) {
    socket.emit('viewed_chess_move', selectedChannelId);
    socket.emit('start_chess_timer', {
      currentChannel,
      targetUserId: userId,
      winnerId: senderId
    });
    onSetChessModalShown(true);
  }

  async function handleConfirmChessMove({ state, isCheckmate, isStalemate }) {
    const gameWinnerId = isCheckmate ? userId : isStalemate ? 0 : undefined;
    const params = {
      userId,
      chessState: state,
      isChessMsg: 1,
      gameWinnerId
    };
    const content = 'Made a chess move';
    try {
      if (selectedChannelId) {
        onSubmitMessage({
          message: {
            ...params,
            profilePicId,
            username,
            content,
            channelId: selectedChannelId
          }
        });
        onSetReplyTarget(null);
        socket.emit('user_made_a_move', {
          userId,
          channelId: selectedChannelId
        });
      } else {
        const { members, message } = await startNewDMChannel({
          ...params,
          content,
          recepientId
        });
        onSendFirstDirectMessage({ members, message });
        socket.emit('join_chat_channel', message.channelId);
        socket.emit('send_bi_chat_invitation', recepientId, message);
        return;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete() {
    const { fileName, filePath, messageId } = deleteModal;
    await deleteMessage({ fileName, filePath, messageId });
    onDeleteMessage(messageId);
    setDeleteModal({
      shown: false,
      fileName: '',
      filePath: '',
      messageId: null
    });
    socket.emit('delete_chat_message', {
      channelId: selectedChannelId,
      messageId
    });
  }

  async function handleEditSettings({ editedChannelName, editedIsClosed }) {
    await editChannelSettings({
      channelName: editedChannelName,
      isClosed: editedIsClosed,
      channelId: selectedChannelId
    });
    onEditChannelSettings({
      channelName: editedChannelName,
      isClosed: editedIsClosed,
      channelId: selectedChannelId
    });
    socket.emit('new_channel_settings', {
      channelName: editedChannelName,
      isClosed: editedIsClosed,
      channelId: selectedChannelId
    });
    setSettingsModalShown(false);
  }

  function handleInviteUsersDone(users, message) {
    socket.emit(
      'new_chat_message',
      {
        ...message,
        channelId: message.channelId
      },
      {
        ...currentChannel,
        numUnreads: 1,
        lastMessage: {
          content: message.content,
          sender: { id: userId, username }
        },
        channelName
      }
    );
    socket.emit('send_group_chat_invitation', users, {
      message: { ...message, messageId: message.id }
    });
    setInviteUsersModalShown(false);
  }

  function handleLeaveConfirm() {
    if (currentChannel.creatorId === userId) {
      setLeaveConfirmModalShown(false);
      setSelectNewOwnerModalShown(true);
    } else {
      handleLeaveChannel();
    }
  }

  async function handleLeaveChannel() {
    await leaveChannel(selectedChannelId);
    onLeaveChannel(selectedChannelId);
    socket.emit('leave_chat_channel', {
      channelId: selectedChannelId,
      userId,
      username,
      profilePicId
    });
    const data = await loadChatChannel({ channelId: GENERAL_CHAT_ID });
    onEnterChannelWithId({ data, showOnTop: true });
    setLeaveConfirmModalShown(false);
  }

  async function handleLoadMore() {
    if (messagesLoadMoreButton) {
      const messageId = messages[0].id;
      const prevContentHeight = ContentRef.current?.offsetHeight || 0;
      if (!loadMoreButtonLock) {
        setLoadMoreButtonLock(true);
        const data = await loadMoreChatMessages({
          userId,
          messageId,
          channelId: selectedChannelId
        });
        onLoadMoreMessages(data);
        MessagesContainerRef.current.scrollTop = Math.max(
          MessagesContainerRef.current.scrollTop,
          (ContentRef.current?.offsetHeight || 0) - prevContentHeight
        );
        setLoadMoreButtonLock(false);
      }
    }
  }

  async function handleMessageSubmit(content) {
    setTextAreaHeight(0);
    let isFirstDirectMessage = selectedChannelId === 0;
    if (isFirstDirectMessage) {
      if (creatingNewDMChannel) return;
      onSetCreatingNewDMChannel(true);
      const { members, message } = await startNewDMChannel({
        content,
        userId,
        recepientId
      });
      onSendFirstDirectMessage({ members, message });
      socket.emit('join_chat_channel', message.channelId);
      socket.emit('send_bi_chat_invitation', recepientId, message);
      onSetCreatingNewDMChannel(false);
      return;
    }
    const message = {
      userId,
      username,
      profilePicId,
      content,
      channelId: selectedChannelId,
      subjectId: subject.id
    };
    onSubmitMessage({ message, replyTarget });
    onSetReplyTarget(null);
  }

  function handleReceiveNewMessage() {
    if (scrollAtBottom) {
      handleSetScrollToBottom();
    } else {
      setNewUnseenMessage(true);
    }
  }

  function handleSendFileMessage(params) {
    socket.emit(
      'new_chat_message',
      { ...params, isNewMessage: true },
      {
        ...currentChannel,
        numUnreads: 1,
        lastMessage: {
          fileName: params.fileName,
          sender: { id: userId, username }
        },
        channelName
      }
    );
  }

  async function handleSelectNewOwnerAndLeaveChannel(newOwner) {
    const notificationMsg = await changeChannelOwner({
      channelId: selectedChannelId,
      newOwner
    });
    socket.emit('new_channel_owner', {
      channelId: selectedChannelId,
      userId,
      username,
      profilePicId,
      newOwner,
      notificationMsg
    });
    handleLeaveChannel();
    setSelectNewOwnerModalShown(false);
  }

  function handleSetScrollToBottom() {
    MessagesContainerRef.current.scrollTop =
      ContentRef.current?.offsetHeight || 0;
    setTimeout(
      () =>
        (MessagesContainerRef.current.scrollTop =
          ContentRef.current?.offsetHeight || 0),
      100
    );
    if (ContentRef.current?.offsetHeight) setScrollAtBottom(true);
  }

  function handleShowDeleteModal({ fileName, filePath, messageId }) {
    setDeleteModal({
      shown: true,
      fileName,
      filePath,
      messageId
    });
  }

  function handleUpload(event) {
    const file = event.target.files[0];
    if (file.size / mb > maxSize) {
      return setAlertModalShown(true);
    }
    setFileObj(file);
    setUploadModalShown(true);
    event.target.value = null;
  }
}
