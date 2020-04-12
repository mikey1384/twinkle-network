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
import SelectVideoModal from '../../Modals/SelectVideoModal';
import SelectNewOwnerModal from '../../Modals/SelectNewOwnerModal';
import SettingsModal from '../../Modals/SettingsModal';
import ErrorBoundary from 'components/ErrorBoundary';
import { GENERAL_CHAT_ID } from 'constants/database';
import { rewardReasons } from 'constants/defaultValues';
import { addEvent, removeEvent } from 'helpers/listenerHelpers';
import { css } from 'emotion';
import { Color } from 'constants/css';
import { socket } from 'constants/io';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useChatContext, useNotiContext } from 'contexts';
import { checkScrollIsAtTheBottom } from 'helpers';
import CallScreen from './CallScreen';

MessagesContainer.propTypes = {
  channelName: PropTypes.string,
  chessOpponent: PropTypes.object,
  currentChannel: PropTypes.object.isRequired
};

const CALL_SCREEN_HEIGHT = '30%';

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
      sendInvitationMessage,
      startNewDMChannel,
      updateUserXP
    }
  } = useAppContext();
  const {
    state: { socketConnected }
  } = useNotiContext();
  const {
    state: {
      channelOnCall,
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
  const [fileObj, setFileObj] = useState(null);
  const [inviteUsersModalShown, setInviteUsersModalShown] = useState(false);
  const [loadMoreButtonLock, setLoadMoreButtonLock] = useState(false);
  const [newUnseenMessage, setNewUnseenMessage] = useState(false);
  const [uploadModalShown, setUploadModalShown] = useState(false);
  const [alertModalShown, setAlertModalShown] = useState(false);
  const [selectVideoModalShown, setSelectVideoModalShown] = useState(false);
  const [leaving, setLeaving] = useState(false);
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
  const [selectNewOwnerModal, setSelectNewOwnerModal] = useState(null);

  const ContentRef = useRef(null);
  const MessagesRef = useRef(null);
  const mounted = useRef(null);
  const MessagesContainerRef = useRef({});
  const FileInputRef = useRef(null);
  const ChatInputRef = useRef(null);
  const timerRef = useRef(null);
  const mb = 1000;

  const selectedChannelIsOnCall = useMemo(
    () => selectedChannelId === channelOnCall.id,
    [channelOnCall.id, selectedChannelId]
  );

  useEffect(() => {
    if (selectedChannelId === channelOnCall.id) {
      handleSetScrollToBottom();
    }
  }, [channelOnCall, selectedChannelId]);

  const containerHeight = useMemo(() => {
    return `CALC(100% - 1rem - 2px - ${
      socketConnected && textAreaHeight
        ? `${textAreaHeight}px - 1rem`
        : '5.5rem'
    }${socketConnected && replyTarget ? ' - 12rem - 2px' : ''}${
      selectedChannelIsOnCall ? ` - ${CALL_SCREEN_HEIGHT}` : ''
    })`;
  }, [replyTarget, selectedChannelIsOnCall, socketConnected, textAreaHeight]);

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

  const loading = useMemo(
    () => channelLoading || creatingNewDMChannel || reconnecting,
    [channelLoading, creatingNewDMChannel, reconnecting]
  );

  const maxSize = useMemo(
    () =>
      authLevel > 3
        ? 5000 * mb
        : authLevel > 1
        ? 3000 * mb
        : authLevel === 1
        ? 1000 * mb
        : 300 * mb,
    [authLevel]
  );

  useEffect(() => {
    socket.on('chess_countdown_number_received', onReceiveCountdownNumber);
    socket.on('new_message_received', handleReceiveMessage);

    function onReceiveCountdownNumber({ channelId, number }) {
      if (channelId === selectedChannelId) {
        if (number === 0) {
          onSetChessModalShown(false);
        }
        setChessCountdownObj((chessCountdownObj) => ({
          ...chessCountdownObj,
          [channelId]: number
        }));
      }
    }
    function handleReceiveMessage({ message }) {
      if (message.isChessMsg) {
        setChessCountdownObj((chessCountdownObj) => ({
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
        if (MessagesContainerRef.current?.scrollTop === 0) {
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

  useEffect(() => {
    setLoadMoreButtonLock(false);
  }, [selectedChannelId]);

  return (
    <ErrorBoundary>
      {selectedChannelId !== GENERAL_CHAT_ID && (
        <DropdownButton
          skeuomorphic
          color="darkerGray"
          opacity={0.7}
          style={{
            position: 'absolute',
            zIndex: 15,
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
      {selectedChannelIsOnCall && (
        <CallScreen
          creatorId={currentChannel.creatorId}
          style={{ height: CALL_SCREEN_HEIGHT }}
        />
      )}
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
                  height: `CALC(100vh - ${
                    MessagesRef.current?.offsetHeight || 0
                  }px)`
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
                  onAcceptGroupInvitation={handleAcceptGroupInvitation}
                  onChessBoardClick={handleChessModalShown}
                  onChessSpoilerClick={handleChessSpoilerClick}
                  onDelete={handleShowDeleteModal}
                  onDropdownButtonClick={handleDropdownButtonClick}
                  onReceiveNewMessage={handleReceiveNewMessage}
                  onReplyClick={() => ChatInputRef.current.focus()}
                  onRewardMessageSubmit={handleRewardMessageSubmit}
                  onSetScrollToBottom={handleSetScrollToBottom}
                  recepientId={recepientId}
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
                setTimeout(
                  () =>
                    (MessagesContainerRef.current.scrollTop =
                      ContentRef.current?.offsetHeight || 0),
                  100
                );
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
            onMessageSubmit={(content) =>
              handleMessageSubmit({ content, target: replyTarget })
            }
            onHeightChange={(height) => {
              if (height !== textAreaHeight) {
                setTextAreaHeight(height > 46 ? height : 0);
              }
            }}
            onUploadButtonClick={() => FileInputRef.current.click()}
            onSelectVideoButtonClick={() => setSelectVideoModalShown(true)}
          />
        ) : (
          <div>
            <Loading
              style={{ height: '4.6rem' }}
              innerStyle={{ fontSize: '2rem' }}
              text="Socket disconnected. Reconnecting..."
            />
          </div>
        )}
      </div>
      {alertModalShown && (
        <AlertModal
          title="File is too large"
          content={`The file size is larger than your limit of ${
            maxSize / mb
          } MB`}
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
          isClass={currentChannel.isClass}
          isClosed={currentChannel.isClosed}
          userIsChannelOwner={currentChannel.creatorId === userId}
          channelName={channelName}
          onHide={() => setSettingsModalShown(false)}
          onDone={handleEditSettings}
          channelId={selectedChannelId}
          onChangeOwner={() => setSelectNewOwnerModal({ andLeave: false })}
        />
      )}
      {leaveConfirmModalShown && (
        <ConfirmModal
          title="Leave Channel"
          onHide={() => setLeaveConfirmModalShown(false)}
          onConfirm={handleLeaveConfirm}
          disabled={leaving}
        />
      )}
      {selectVideoModalShown && (
        <SelectVideoModal
          onHide={() => setSelectVideoModalShown(false)}
          onSend={(videoId) => {
            handleMessageSubmit({
              content: `https://www.twin-kle.com/videos/${videoId}`,
              target: replyTarget
            });
            setSelectVideoModalShown(false);
          }}
        />
      )}
      {!!selectNewOwnerModal && (
        <SelectNewOwnerModal
          onHide={() => setSelectNewOwnerModal(null)}
          members={currentChannel.members}
          onSubmit={handleSelectNewOwner}
          isClass={currentChannel.isClass}
        />
      )}
    </ErrorBoundary>
  );

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
        socket.emit('join_chat_group', message.channelId);
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
    if (userId === currentChannel.creatorId) {
      socket.emit('new_channel_settings', {
        channelName: editedChannelName,
        isClosed: editedIsClosed,
        channelId: selectedChannelId
      });
    }
    setSettingsModalShown(false);
  }

  function handleInviteUsersDone({ users, message, isClass }) {
    if (isClass) {
      socket.emit('new_chat_message', {
        message: {
          ...message,
          channelId: message.channelId
        },
        channel: {
          ...currentChannel,
          numUnreads: 1,
          lastMessage: {
            content: message.content,
            sender: { id: userId, username }
          },
          channelName
        },
        newMembers: users
      });
      socket.emit(
        'send_group_chat_invitation',
        users.map((user) => user.id),
        {
          message: { ...message, messageId: message.id },
          isClass
        }
      );
    } else {
      sendInvitationMessage({
        recepients: users.map((user) => user.id),
        origin: currentChannel.id
      });
    }
    setInviteUsersModalShown(false);
  }

  function handleLeaveConfirm() {
    if (currentChannel.creatorId === userId) {
      setLeaveConfirmModalShown(false);
      if (currentChannel.members.length === 1) {
        handleLeaveChannel();
      } else {
        setSelectNewOwnerModal({ andLeave: true });
      }
    } else {
      handleLeaveChannel();
    }
  }

  function handleDropdownButtonClick() {
    if (scrollAtBottom) {
      handleSetScrollToBottom();
    }
  }

  async function handleLeaveChannel() {
    if (!leaving) {
      try {
        setLeaving(true);
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
        setLeaving(false);
      } catch (error) {
        console.error(error);
        setLeaving(false);
      }
    }
  }

  async function handleLoadMore() {
    if (messagesLoadMoreButton) {
      const messageId = messages[0].id;
      const prevContentHeight = ContentRef.current?.offsetHeight || 0;
      if (!loadMoreButtonLock) {
        setLoadMoreButtonLock(true);
        try {
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
        } catch (error) {
          console.error(error);
          setLoadMoreButtonLock(false);
        }
      }
    }
  }

  function handleAcceptGroupInvitation({ channel, messages, joinMessage }) {
    onEnterChannelWithId({ data: { channel, messages }, showOnTop: true });
    socket.emit('new_chat_message', {
      message: joinMessage,
      channel,
      newMembers: [{ id: userId, username, profilePicId }]
    });
    onSubmitMessage({ message: joinMessage });
  }

  async function handleMessageSubmit({
    content,
    rewardAmount,
    rewardReason,
    target
  }) {
    setTextAreaHeight(0);
    let isFirstDirectMessage = selectedChannelId === 0;
    if (isFirstDirectMessage) {
      if (creatingNewDMChannel) return;
      onSetCreatingNewDMChannel(true);
      try {
        const { members, message } = await startNewDMChannel({
          content,
          userId,
          recepientId
        });
        onSendFirstDirectMessage({ members, message });
        socket.emit('join_chat_group', message.channelId);
        socket.emit('send_bi_chat_invitation', recepientId, message);
        onSetCreatingNewDMChannel(false);
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    }
    const message = {
      userId,
      username,
      profilePicId,
      content,
      channelId: selectedChannelId,
      subjectId: subject.id
    };
    onSubmitMessage({
      message,
      replyTarget: target,
      rewardReason,
      rewardAmount
    });
    onSetReplyTarget(null);
    return Promise.resolve();
  }

  async function handleRewardMessageSubmit({ amount, reasonId, message }) {
    handleMessageSubmit({
      content: rewardReasons[reasonId].message,
      rewardAmount: amount,
      rewardReason: reasonId,
      target: message
    });
    await updateUserXP({
      amount,
      action: 'reward',
      target: 'chat',
      targetId: message.id,
      type: 'increase',
      userId: message.userId
    });
  }

  function handleReceiveNewMessage() {
    if (scrollAtBottom) {
      handleSetScrollToBottom();
    } else {
      setNewUnseenMessage(true);
    }
  }

  async function handleSelectNewOwner(newOwner) {
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
    if (selectNewOwnerModal.andLeave) {
      handleLeaveChannel();
    }
    setSelectNewOwnerModal(null);
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
