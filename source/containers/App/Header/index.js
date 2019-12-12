import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import AccountMenu from './AccountMenu';
import MainNavs from './MainNavs';
import TwinkleLogo from './TwinkleLogo';
import ErrorBoundary from 'components/ErrorBoundary';
import { css } from 'emotion';
import { Color, mobileMaxWidth, desktopMinWidth } from 'constants/css';
import { socket } from 'constants/io';
import { getSectionFromPathname } from 'helpers';
import { useHistory, useLocation } from 'react-router-dom';
import { useMyState } from 'helpers/hooks';
import {
  useAppContext,
  useViewContext,
  useNotiContext,
  useChatContext
} from 'contexts';

Header.propTypes = {
  onChatButtonClick: PropTypes.func,
  onMobileMenuOpen: PropTypes.func,
  style: PropTypes.object
};

export default function Header({
  onChatButtonClick,
  onMobileMenuOpen,
  style = {}
}) {
  const { pathname } = useLocation();
  const history = useHistory();
  const usingChat = getSectionFromPathname(pathname)?.section === 'chat';
  const {
    requestHelpers: {
      checkVersion,
      getNumberOfUnreadMessages,
      loadChat,
      updateChatLastRead
    }
  } = useAppContext();
  const {
    defaultSearchFilter,
    userId,
    username,
    loggedIn,
    profilePicId
  } = useMyState();
  const {
    state: { currentChannel, selectedChannelId, numUnreads },
    actions: {
      onSetReconnecting,
      onChangeChannelOwner,
      onClearRecentChessMessage,
      onGetNumberOfUnreadMessages,
      onInitChat,
      onReceiveFirstMsg,
      onReceiveMessage,
      onReceiveMessageOnDifferentChannel
    }
  } = useChatContext();

  const {
    state: { numNewNotis, numNewPosts, totalRewardAmount, versionMatch },
    actions: {
      onChangeSocketStatus,
      onCheckVersion,
      onIncreaseNumNewPosts,
      onIncreaseNumNewNotis,
      onNotifyChatSubjectChange,
      onShowUpdateNotice
    }
  } = useNotiContext();
  const {
    state: { pageVisible }
  } = useViewContext();

  const prevProfilePicId = useRef(profilePicId);

  useEffect(() => {
    socket.disconnect();
    socket.connect();
  }, [userId]);

  useEffect(() => {
    if (userId && profilePicId !== prevProfilePicId.current) {
      socket.emit('change_profile_pic', profilePicId);
    }
    prevProfilePicId.current = profilePicId;
  }, [profilePicId, userId, username]);

  useEffect(() => {
    socket.on('chat_invitation', onChatInvitation);
    socket.on('change_channel_owner', onChangeChannelOwner);
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('new_post', onIncreaseNumNewPosts);
    socket.on('new_notification', onIncreaseNumNewNotis);
    socket.on('receive_message', handleReceiveMessage);
    socket.on('subject_change', onSubjectChange);

    return function cleanUp() {
      socket.removeListener('chat_invitation', onChatInvitation);
      socket.removeListener('change_channel_owner', onChangeChannelOwner);
      socket.removeListener('connect', onConnect);
      socket.removeListener('disconnect', onDisconnect);
      socket.removeListener('new_post', onIncreaseNumNewPosts);
      socket.removeListener('new_notification', onIncreaseNumNewNotis);
      socket.removeListener('receive_message', handleReceiveMessage);
      socket.removeListener('subject_change', onSubjectChange);
    };

    function onChatInvitation(data) {
      let duplicate = false;
      if (selectedChannelId === 0) {
        if (
          data.members.filter(member => member.userId !== userId)[0].userId ===
          currentChannel.members.filter(member => member.userId !== userId)[0]
            .userId
        ) {
          duplicate = true;
        }
      }
      onReceiveFirstMsg({ data, duplicate, pageVisible });
      socket.emit('join_chat_channel', data.channelId);
    }
    async function onConnect() {
      console.log('connected to socket');
      onClearRecentChessMessage();
      onChangeSocketStatus(true);
      handleCheckVersion();
      if (userId) {
        handleGetNumberOfUnreadMessages();
        socket.emit('bind_uid_to_socket', { userId, username, profilePicId });
        socket.emit('enter_my_notification_channel', userId);
        handleLoadChat();
      }

      async function handleLoadChat() {
        onSetReconnecting(true);
        const data = await loadChat();
        onInitChat(data);
      }

      async function handleCheckVersion() {
        const data = await checkVersion();
        onCheckVersion(data);
      }

      async function handleGetNumberOfUnreadMessages() {
        const numUnreads = await getNumberOfUnreadMessages();
        onGetNumberOfUnreadMessages(numUnreads);
      }
    }
    function onDisconnect() {
      console.log('disconnected from socket');
      onChangeSocketStatus(false);
    }
    async function handleReceiveMessage(message, channel) {
      let messageIsForCurrentChannel = message.channelId === selectedChannelId;
      let senderIsNotTheUser = message.userId !== userId;
      if (messageIsForCurrentChannel && senderIsNotTheUser) {
        if (usingChat) {
          await updateChatLastRead(message.channelId);
        }
        onReceiveMessage({
          message,
          pageVisible,
          usingChat
        });
      }
      if (!messageIsForCurrentChannel) {
        onReceiveMessageOnDifferentChannel({
          channel,
          senderIsNotTheUser,
          pageVisible,
          usingChat
        });
      }
    }
    function onSubjectChange({ subject }) {
      onNotifyChatSubjectChange(subject);
    }
  });

  useEffect(() => {
    const newNotiNum = numNewPosts + numNewNotis + numUnreads;
    document.title = `${newNotiNum > 0 ? '(' + newNotiNum + ') ' : ''}Twinkle`;
  }, [numNewNotis, numNewPosts, numUnreads, pathname]);

  useEffect(() => {
    onShowUpdateNotice(!versionMatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [versionMatch]);

  return (
    <ErrorBoundary>
      <nav
        className={`unselectable ${css`
          z-index: 30000;
          position: relative;
          font-family: sans-serif, Arial, Helvetica;
          font-size: 1.7rem;
          background: #fff;
          display: flex;
          box-shadow: 0 3px 3px -3px ${Color.black(0.6)};
          align-items: center;
          width: 100%;
          margin-bottom: 0px;
          height: 4.5rem;
          @media (min-width: ${desktopMinWidth}) {
            top: 0;
          }
          @media (max-width: ${mobileMaxWidth}) {
            bottom: 0;
            height: 5rem;
            border-top: 1px solid ${Color.borderGray()};
          }
        `}`}
        style={{
          justifyContent: 'space-around',
          position: 'fixed',
          ...style
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <TwinkleLogo style={{ marginLeft: '3rem' }} />
          <MainNavs
            loggedIn={loggedIn}
            defaultSearchFilter={defaultSearchFilter}
            numChatUnreads={numUnreads}
            numNewNotis={numNewNotis}
            numNewPosts={numNewPosts}
            onChatButtonClick={onChatButtonClick}
            onMobileMenuOpen={onMobileMenuOpen}
            pathname={pathname}
            totalRewardAmount={totalRewardAmount}
          />
          <AccountMenu
            className={`desktop ${css`
              margin-right: 3rem;
              @media (max-width: ${mobileMaxWidth}) {
                margin-right: 0;
              }
            `}`}
            history={history}
          />
        </div>
      </nav>
    </ErrorBoundary>
  );
}
