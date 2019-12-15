import React, { useMemo, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { GENERAL_CHAT_ID } from 'constants/database';
import { phoneMaxWidth, Color } from 'constants/css';
import { css } from 'emotion';
import { socket } from 'constants/io';
import Button from 'components/Button';
import ConfirmModal from 'components/Modals/ConfirmModal';
import ChatInput from './ChatInput';
import DropdownButton from 'components/Buttons/DropdownButton';
import Loading from 'components/Loading';
import Message from '../Message';
import SubjectMsgsModal from '../Modals/SubjectMsgsModal';
import ChannelHeader from './ChannelHeader';
import UploadModal from '../Modals/UploadModal';
import InviteUsersModal from '../Modals/InviteUsers';
import AlertModal from 'components/Modals/AlertModal';
import SelectNewOwnerModal from '../Modals/SelectNewOwnerModal';
import SettingsModal from '../Modals/SettingsModal';
import Icon from 'components/Icon';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useNotiContext, useChatContext } from 'contexts';

MessagesContainer.propTypes = {
  channelName: PropTypes.string,
  chessCountdownObj: PropTypes.object,
  chessOpponent: PropTypes.object,
  loadMoreButton: PropTypes.bool,
  loading: PropTypes.bool,
  loadMoreMessages: PropTypes.func,
  currentChannel: PropTypes.object,
  messages: PropTypes.array,
  onChessBoardClick: PropTypes.func,
  onChessSpoilerClick: PropTypes.func,
  onMessageSubmit: PropTypes.func.isRequired,
  onSendFileMessage: PropTypes.func.isRequired,
  onShowChessModal: PropTypes.func.isRequired,
  recepientId: PropTypes.number,
  selectedChannelId: PropTypes.number,
  subjectId: PropTypes.number
};

export default function MessagesContainer({
  channelName,
  chessCountdownObj,
  chessOpponent,
  loadMoreButton,
  loading,
  loadMoreMessages,
  currentChannel,
  messages,
  onChessBoardClick,
  onChessSpoilerClick,
  onMessageSubmit,
  onSendFileMessage,
  onShowChessModal,
  recepientId,
  selectedChannelId,
  subjectId
}) {
  const {
    requestHelpers: {
      changeChannelOwner,
      deleteMessage,
      editChannelSettings,
      hideChat,
      leaveChannel,
      loadChatChannel
    }
  } = useAppContext();
  const { authLevel, profilePicId, userId, username } = useMyState();
  const {
    state: { messagesLoaded, reconnecting, replyTarget },
    actions: {
      onChannelLoadingDone,
      onDeleteMessage,
      onEditChannelSettings,
      onEnterChannelWithId,
      onHideChat,
      onLeaveChannel
    }
  } = useChatContext();
  const {
    state: { socketConnected }
  } = useNotiContext();
  const [deleteModal, setDeleteModal] = useState({
    shown: false,
    fileName: '',
    filePath: '',
    messageId: null
  });
  const [loadMoreButtonLock, setLoadMoreButtonLock] = useState(false);
  const [subjectMsgsModal, setSubjectMsgsModal] = useState({
    shown: false,
    subjectId: null,
    content: ''
  });
  const [newUnseenMessage, setNewUnseenMessage] = useState(false);
  const [textAreaHeight, setTextAreaHeight] = useState(0);
  const [fileObj, setFileObj] = useState('');
  const [inviteUsersModalShown, setInviteUsersModalShown] = useState(false);
  const [uploadModalShown, setUploadModalShown] = useState(false);
  const [alertModalShown, setAlertModalShown] = useState(false);
  const [settingsModalShown, setSettingsModalShown] = useState(false);
  const [leaveConfirmModalShown, setLeaveConfirmModalShown] = useState(false);
  const [selectNewOwnerModalShown, setSelectNewOwnerModalShown] = useState(
    false
  );
  const [scrollAtBottom, setScrollAtBottom] = useState(false);
  const MessagesRef = useRef(null);
  const ContentRef = useRef(null);
  const FileInputRef = useRef(null);
  const MessagesContainerRef = useRef({});
  const ChatInputRef = useRef(null);
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

  return (
    <div
      className={css`
        height: 100%;
        width: 60vw;
        border-left: 1px solid ${Color.borderGray()};
        padding: 0;
        position: relative;
        background: #fff;
        @media (max-width: ${phoneMaxWidth}) {
          width: 77vw;
        }
      `}
    >
      <input
        ref={FileInputRef}
        style={{ display: 'none' }}
        type="file"
        onChange={handleUpload}
      />
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
            opacity: loading && '0.3',
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
            {!loading && loadMoreButton ? (
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
                  onClick={handleLoadMoreButtonClick}
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
            <div style={{ opacity: loading ? 0 : 1 }} ref={MessagesRef}>
              {messages.map((message, index) => (
                <Message
                  key={selectedChannelId + (message.id || 'newMessage' + index)}
                  channelId={selectedChannelId}
                  channelName={channelName}
                  chessCountdownObj={chessCountdownObj}
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
                  onChessBoardClick={onChessBoardClick}
                  onChessSpoilerClick={onChessSpoilerClick}
                  onSendFileMessage={onSendFileMessage}
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
      </div>
      <div
        style={{
          background: Color.inputGray(),
          padding: '1rem',
          borderTop: `1px solid ${Color.borderGray()}`
        }}
      >
        {socketConnected ? (
          <ChatInput
            innerRef={ChatInputRef}
            loading={loading}
            myId={userId}
            isTwoPeopleChannel={currentChannel.twoPeople}
            currentChannelId={selectedChannelId}
            currentChannel={currentChannel}
            onChessButtonClick={onShowChessModal}
            onMessageSubmit={content => {
              setTextAreaHeight(0);
              onMessageSubmit(content);
            }}
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
        {alertModalShown && (
          <AlertModal
            title="File is too large"
            content={`The file size is larger than your limit of ${maxSize /
              mb} MB`}
            onHide={() => setAlertModalShown(false)}
          />
        )}
        {uploadModalShown && (
          <UploadModal
            channelId={selectedChannelId}
            fileObj={fileObj}
            onHide={() => setUploadModalShown(false)}
            subjectId={subjectId}
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
      </div>
    </div>
  );

  function checkScrollIsAtTheBottom({ content, container }) {
    return content.offsetHeight <= container.offsetHeight + container.scrollTop;
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
    socket.emit('new_chat_settings', {
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

  async function handleLoadMoreButtonClick() {
    const messageId = messages[0].id;
    if (!loadMoreButtonLock) {
      setLoadMoreButtonLock(true);
      await loadMoreMessages({
        userId,
        messageId,
        channelId: selectedChannelId
      });
      setLoadMoreButtonLock(false);
    }
  }

  function handleReceiveNewMessage() {
    if (scrollAtBottom) {
      handleSetScrollToBottom();
    } else {
      setNewUnseenMessage(true);
    }
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

  function handleShowDeleteModal({ fileName, filePath, messageId }) {
    setDeleteModal({
      shown: true,
      fileName,
      filePath,
      messageId
    });
  }

  function handleSetScrollToBottom() {
    setTimeout(
      () =>
        (MessagesContainerRef.current.scrollTop =
          ContentRef.current?.offsetHeight || 0),
      0
    );
    if (ContentRef.current?.offsetHeight) setScrollAtBottom(true);
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
