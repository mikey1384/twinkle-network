import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import DropdownButton from 'components/Buttons/DropdownButton';
import SubjectMsgsModal from '../Modals/SubjectMsgsModal';
import Icon from 'components/Icon';
import MessagesContainer from './ChatMessages';
import { phoneMaxWidth, Color } from 'constants/css';
import { css } from 'emotion';
import { socket } from 'constants/io';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useChatContext } from 'contexts';

Body.propTypes = {
  channelName: PropTypes.string,
  chessCountdownObj: PropTypes.object,
  chessOpponent: PropTypes.object,
  loadMoreButton: PropTypes.bool,
  loading: PropTypes.bool,
  loadMoreMessages: PropTypes.func,
  currentChannel: PropTypes.object,
  messages: PropTypes.array,
  onChessSpoilerClick: PropTypes.func,
  onMessageSubmit: PropTypes.func.isRequired,
  onSendFileMessage: PropTypes.func.isRequired,
  onShowChessModal: PropTypes.func.isRequired,
  recepientId: PropTypes.number,
  selectedChannelId: PropTypes.number,
  subjectId: PropTypes.number
};

export default function Body({
  channelName,
  chessCountdownObj,
  chessOpponent,
  loadMoreButton,
  loading,
  loadMoreMessages,
  currentChannel,
  messages,
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
    state: { messagesLoaded, reconnecting },
    actions: {
      onChannelLoadingDone,
      onDeleteMessage,
      onEditChannelSettings,
      onEnterChannelWithId,
      onHideChat,
      onLeaveChannel
    }
  } = useChatContext();
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
  const [scrollAtBottom, setScrollAtBottom] = useState(true);
  const ContentRef = useRef(null);
  const FileInputRef = useRef(null);
  const ChatInputRef = useRef(null);
  const timerRef = useRef(null);
  const mounted = useRef(null);
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
      <MessagesContainer
        chessCountdownObj={chessCountdownObj}
        chessOpponent={chessOpponent}
        loading={loading}
        onChessSpoilerClick={onChessSpoilerClick}
        onShowChessModal={onShowChessModal}
      />
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
    if (loadMoreButton) {
      const messageId = messages[0].id;
      const prevContentHeight = ContentRef.current?.offsetHeight || 0;
      if (!loadMoreButtonLock) {
        setLoadMoreButtonLock(true);
        await loadMoreMessages({
          userId,
          messageId,
          channelId: selectedChannelId
        });
        MessagesContainerRef.current.scrollTop = Math.max(
          MessagesContainerRef.current.scrollTop,
          (ContentRef.current?.offsetHeight || 0) - prevContentHeight
        );
        setLoadMoreButtonLock(false);
      }
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
}
