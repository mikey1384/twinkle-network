import React, { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import AccountMenu from './AccountMenu';
import MainNavs from './MainNavs';
import TwinkleLogo from './TwinkleLogo';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { css } from 'emotion';
import { Color, mobileMaxWidth, desktopMinWidth } from 'constants/css';
import { socket } from 'constants/io';
import { getSectionFromPathname } from 'helpers';
import { withRouter } from 'react-router';
import { useMyState } from 'helpers/hooks';
import {
  useAppContext,
  useViewContext,
  useNotiContext,
  useChatContext
} from 'contexts';

Header.propTypes = {
  chatLoading: PropTypes.bool,
  history: PropTypes.object.isRequired,
  location: PropTypes.object,
  onChatButtonClick: PropTypes.func,
  onMobileMenuOpen: PropTypes.func,
  showUpdateNotice: PropTypes.func,
  style: PropTypes.object
};

function Header({
  chatLoading,
  history,
  location: { pathname },
  onChatButtonClick,
  onMobileMenuOpen,
  showUpdateNotice,
  style = {}
}) {
  const {
    requestHelpers: {
      checkVersion,
      getNumberOfUnreadMessages,
      loadChat,
      updateChatLastRead
    }
  } = useAppContext();
  const { defaultSearchFilter, userId, username, loggedIn } = useMyState();
  const {
    state: { selectedChannelId, numUnreads },
    actions: {
      onClearRecentChessMessage,
      onGetNumberOfUnreadMessages,
      onInitChat,
      onNotifyChatSubjectChange,
      onReceiveMessage,
      onReceiveMessageOnDifferentChannel,
      onUpdateApiServerToS3Progress
    }
  } = useChatContext();
  const {
    state: { numNewNotis, numNewPosts, totalRewardAmount, versionMatch },
    actions: {
      onChangeSocketStatus,
      onCheckVersion,
      onIncreaseNumNewPosts,
      onIncreaseNumNewNotis
    }
  } = useNotiContext();
  const {
    state: { pageVisible }
  } = useViewContext();

  const prevUserIdRef = useRef(userId);
  useEffect(() => {
    socket.on('chat_invitation', onChatInvitation);
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('receive_message', handleReceiveMessage);
    socket.on('new_post', onIncreaseNumNewPosts);
    socket.on('new_notification', onIncreaseNumNewNotis);
    socket.on('receive_chat_file_upload_progress', onReceiveUploadProgress);
    socket.on('subject_change', onSubjectChange);

    return function cleanUp() {
      socket.removeListener('chat_invitation', onChatInvitation);
      socket.removeListener('connect', onConnect);
      socket.removeListener('disconnect', onDisconnect);
      socket.removeListener('new_post', onIncreaseNumNewPosts);
      socket.removeListener('new_notification', onIncreaseNumNewNotis);
      socket.removeListener(
        'receive_chat_file_upload_progress',
        onReceiveUploadProgress
      );
      socket.removeListener('receive_message', handleReceiveMessage);
      socket.removeListener('subject_change', onSubjectChange);
    };

    function onChatInvitation(data) {
      socket.emit('join_chat_channel', data.channelId);
    }
    async function onConnect() {
      console.log('connected to socket');
      onClearRecentChessMessage();
      onChangeSocketStatus(true);
      handleCheckVersion();
      if (userId) {
        handleGetNumberOfUnreadMessages();
        socket.emit('bind_uid_to_socket', userId, username);
        handleLoadChat();
      }

      async function handleLoadChat() {
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
        await updateChatLastRead(message.channelId);
        onReceiveMessage({ message, pageVisible });
      }
      if (!messageIsForCurrentChannel) {
        onReceiveMessageOnDifferentChannel({
          channel,
          senderIsNotTheUser,
          pageVisible
        });
      }
    }
    function onReceiveUploadProgress({ channelId, path, percentage }) {
      onUpdateApiServerToS3Progress({
        progress: percentage / 100,
        channelId,
        path
      });
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
    socket.connect();
    return function cleanUp() {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (userId) {
      socket.emit('bind_uid_to_socket', userId, username);
      socket.emit('enter_my_notification_channel', userId);
    } else {
      if (prevUserIdRef.current) {
        socket.emit('leave_my_notification_channel', prevUserIdRef.current);
      }
    }
    prevUserIdRef.current = userId;

    return function socketRefresh() {
      socket.disconnect();
      socket.connect();
    };
  }, [userId]);

  useEffect(() => {
    showUpdateNotice(versionMatch);
  }, [versionMatch]);

  return useMemo(
    () => (
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
              isAtExploreTab={['links', 'videos', 'subjects'].includes(
                getSectionFromPathname(pathname)?.section
              )}
              loggedIn={loggedIn}
              defaultSearchFilter={defaultSearchFilter}
              chatLoading={chatLoading}
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
    ),
    [
      chatLoading,
      defaultSearchFilter,
      loggedIn,
      numNewNotis,
      numNewPosts,
      numUnreads,
      pathname,
      totalRewardAmount
    ]
  );
}

export default withRouter(Header);
