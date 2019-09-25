import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { GENERAL_CHAT_ID } from 'constants/database';
import { mobileMaxWidth, Color } from 'constants/css';
import { css } from 'emotion';
import { socket } from 'constants/io';
import Button from 'components/Button';
import ConfirmModal from 'components/Modals/ConfirmModal';
import ChatInput from './ChatInput';
import DropdownButton from 'components/Buttons/DropdownButton';
import Loading from 'components/Loading';
import Message from '../Message';
import SubjectMsgsModal from '../Modals/SubjectMsgsModal';
import SubjectHeader from './SubjectHeader';
import UploadModal from '../Modals/UploadModal';
import InviteUsersModal from '../Modals/InviteUsers';
import AlertModal from 'components/Modals/AlertModal';
import EditTitleModal from '../Modals/EditTitle';
import { useAppContext } from 'context';

MessagesContainer.propTypes = {
  channelName: PropTypes.string,
  chessCountdownObj: PropTypes.object,
  chessOpponent: PropTypes.object,
  loadMoreButton: PropTypes.bool,
  loading: PropTypes.bool,
  loadMoreMessages: PropTypes.func,
  currentChannel: PropTypes.object,
  currentChannelId: PropTypes.number.isRequired,
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
  currentChannelId,
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
    chat: {
      actions: {
        onDeleteMessage,
        onEditChannelTitle,
        onEnterChannelWithId,
        onHideChat,
        onLeaveChannel
      }
    },
    notification: {
      state: { socketConnected }
    },
    user: {
      state: { authLevel, profilePicId, userId, username }
    },
    requestHelpers: {
      deleteMessage,
      editChannelTitle,
      hideChat,
      leaveChannel,
      loadChatChannel
    }
  } = useAppContext();
  const [deleteModal, setDeleteModal] = useState({
    shown: false,
    fileName: '',
    filePath: '',
    messageId: null
  });
  const [fillerHeight, setFillerHeight] = useState(20);
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
  const [editTitleModalShown, setEditTitleModalShown] = useState(false);
  const [leaveConfirmModalShown, setLeaveConfirmModalShown] = useState(false);
  const [scrollAtBottom, setScrollAtBottom] = useState(false);
  const MessagesRef = useRef({});
  const ContentRef = useRef({});
  const FileInputRef = useRef(null);
  const MessagesContainerRef = useRef({});
  const mb = 1000;
  const maxSize =
    authLevel > 8
      ? 4000 * mb
      : authLevel > 4
      ? 2000 * mb
      : authLevel === 4
      ? 1000 * mb
      : 50 * mb;
  const menuProps = currentChannel.twoPeople
    ? [{ label: 'Hide Chat', onClick: handleHideChat }]
    : [
        {
          label: 'Invite People',
          onClick: () => setInviteUsersModalShown(true)
        },
        {
          label: 'Edit Channel Name',
          onClick: () => setEditTitleModalShown(true)
        },
        {
          separator: true
        },
        {
          label: 'Leave Channel',
          onClick: () => setLeaveConfirmModalShown(true)
        }
      ];

  useEffect(() => {
    setFillerHeight(
      MessagesContainerRef.current?.offsetHeight >
        MessagesRef.current?.offsetHeight
        ? MessagesContainerRef.current?.offsetHeight -
            MessagesRef.current?.offsetHeight
        : 0
    );
    MessagesContainerRef.current.scrollTop = ContentRef.current?.offsetHeight;
    setTimeout(
      () =>
        MessagesContainerRef.current
          ? (MessagesContainerRef.current.scrollTop =
              ContentRef.current?.offsetHeight || 0)
          : {},
      0
    );
  }, [currentChannel.id]);

  return (
    <div
      className={css`
        height: 100%;
        width: CALC(100% - 30rem);
        border-left: 1px solid ${Color.borderGray()};
        padding: 0 0 1rem 1rem;
        position: relative;
        background: #fff;
        @media (max-width: ${mobileMaxWidth}) {
          width: 75%;
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
          height: CALC(
            100% - ${textAreaHeight ? `${textAreaHeight}px` : '4.5rem'}
          );
          position: relative;
          -webkit-overflow-scrolling: touch;
        `}
      >
        {loading && <Loading />}
        <div
          ref={MessagesContainerRef}
          style={{
            position: 'absolute',
            left: '0',
            right: '0',
            bottom: '0',
            opacity: loading && '0.3',
            top: currentChannelId === 2 ? '7rem' : 0,
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
            {loadMoreButton ? (
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
            <div ref={MessagesRef}>
              {messages.map((message, index) => (
                <Message
                  key={message.id || 'newMessage' + index}
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
                  index={index}
                  isLastMsg={index === messages.length - 1}
                  isNotification={!!message.isNotification}
                  message={message}
                  onChessBoardClick={onChessBoardClick}
                  onChessSpoilerClick={onChessSpoilerClick}
                  onSendFileMessage={onSendFileMessage}
                  onDelete={handleShowDeleteModal}
                  onReceiveNewMessage={handleReceiveNewMessage}
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
        {!loading && currentChannelId === 2 && <SubjectHeader />}
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
      {socketConnected ? (
        <ChatInput
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
            style={{ height: '2.2rem' }}
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
          onDone={onInviteUsersDone}
        />
      )}
      {editTitleModalShown && (
        <EditTitleModal
          title={channelName}
          onHide={() => setEditTitleModalShown(false)}
          onDone={handleEditChannelTitle}
        />
      )}
      {leaveConfirmModalShown && (
        <ConfirmModal
          title="Leave Channel"
          onHide={() => setLeaveConfirmModalShown(false)}
          onConfirm={handleLeaveChannel}
        />
      )}
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

  async function handleEditChannelTitle(title) {
    await editChannelTitle({ title, channelId: selectedChannelId });
    onEditChannelTitle({ title, channelId: selectedChannelId });
    setEditTitleModalShown(false);
  }

  async function handleHideChat() {
    await hideChat(selectedChannelId);
    onHideChat(selectedChannelId);
    const data = await loadChatChannel({
      channelId: GENERAL_CHAT_ID
    });
    onEnterChannelWithId({ data, showOnTop: true });
  }

  async function handleLoadMoreButtonClick() {
    const messageId = messages[0].id;
    const channelId = messages[0].channelId;
    if (!loadMoreButtonLock) {
      setLoadMoreButtonLock(true);
      await loadMoreMessages({ userId, messageId, channelId });
      setLoadMoreButtonLock(false);
    }
  }

  function handleReceiveNewMessage() {
    const messageSenderId = messages[messages.length - 1].userId;
    if (messageSenderId === userId || scrollAtBottom) {
      setFillerHeight(
        MessagesContainerRef.current?.offsetHeight >
          MessagesRef.current?.offsetHeight
          ? MessagesContainerRef.current?.offsetHeight -
              MessagesRef.current?.offsetHeight
          : 0
      );
      handleSetScrollToBottom();
    } else {
      setNewUnseenMessage(true);
    }
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
        MessagesContainerRef.current
          ? (MessagesContainerRef.current.scrollTop =
              ContentRef.current?.offsetHeight || 0)
          : {},
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

  function onInviteUsersDone(users, message) {
    socket.emit('new_chat_message', {
      ...message,
      channelId: message.channelId
    });
    socket.emit('send_group_chat_invitation', users, {
      message: { ...message, messageId: message.id }
    });
    setInviteUsersModalShown(false);
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
}
