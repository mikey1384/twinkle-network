import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import AccountMenu from './AccountMenu';
import MainNavs from './MainNavs';
import TwinkleLogo from './TwinkleLogo';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  resetChat,
  updateApiServerToS3Progress
} from 'redux/actions/ChatActions';
import {
  changeRankingsLoadedStatus,
  changeSocketStatus,
  onCheckVersion,
  notifyChatSubjectChange,
  increaseNumNewPosts,
  increaseNumNewNotis
} from 'redux/actions/NotiActions';
import { GENERAL_CHAT_ID } from 'constants/database';
import { css } from 'emotion';
import { Color, mobileMaxWidth, desktopMinWidth } from 'constants/css';
import { socket } from 'constants/io';
import { getSectionFromPathname } from 'helpers';
import { useAppContext } from 'context';

Header.propTypes = {
  chatLoading: PropTypes.bool,
  changeRankingsLoadedStatus: PropTypes.func.isRequired,
  changeSocketStatus: PropTypes.func,
  onCheckVersion: PropTypes.func,
  history: PropTypes.object.isRequired,
  increaseNumNewPosts: PropTypes.func,
  increaseNumNewNotis: PropTypes.func,
  location: PropTypes.object,
  notifyChatSubjectChange: PropTypes.func,
  numChatUnreads: PropTypes.number,
  numNewNotis: PropTypes.number,
  numNewPosts: PropTypes.number,
  onChatButtonClick: PropTypes.func,
  onMobileMenuOpen: PropTypes.func,
  selectedChannelId: PropTypes.number,
  showUpdateNotice: PropTypes.func,
  style: PropTypes.object,
  totalRewardAmount: PropTypes.number,
  updateApiServerToS3Progress: PropTypes.func.isRequired,
  versionMatch: PropTypes.bool
};

function Header({
  changeRankingsLoadedStatus,
  chatLoading,
  changeSocketStatus,
  onCheckVersion,
  history,
  increaseNumNewPosts,
  increaseNumNewNotis,
  location: { pathname },
  notifyChatSubjectChange,
  numChatUnreads,
  numNewNotis,
  numNewPosts,
  onChatButtonClick,
  onMobileMenuOpen,
  selectedChannelId,
  showUpdateNotice,
  style = {},
  totalRewardAmount,
  updateApiServerToS3Progress,
  versionMatch
}) {
  const {
    chat: {
      actions: {
        onClearChatLoadedState,
        onClearRecentChessMessage,
        onGetNumberOfUnreadMessages,
        onIncreaseNumberOfUnreadMessages,
        onInitChat,
        onReceiveMessage,
        onReceiveMessageOnDifferentChannel
      }
    },
    user: {
      state: { defaultSearchFilter, userId, username }
    },
    view: {
      state: { pageVisible }
    },
    requestHelpers: {
      checkVersion,
      getNumberOfUnreadMessages,
      loadChat,
      updateChatLastRead
    }
  } = useAppContext();
  const prevUserIdRef = useRef(userId);
  const [homeLink, setHomeLink] = useState('/');
  useEffect(() => {
    const { section } = getSectionFromPathname(pathname);
    if (section === 'users') {
      setHomeLink('/users');
    }
    if (section === 'home' || numNewPosts > 0) {
      setHomeLink('/');
    }
  }, [pathname]);
  useEffect(() => {
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('chat_invitation', onChatInvitation);
    socket.on('receive_message', handleReceiveMessage);
    socket.on('new_post', increaseNumNewPosts);
    socket.on('new_notification', increaseNumNewNotis);
    socket.on('receive_chat_file_upload_progress', onReceiveUploadProgress);
    socket.on('subject_change', onSubjectChange);

    return function cleanUp() {
      socket.removeListener('chat_invitation', onChatInvitation);
      socket.removeListener('connect', onConnect);
      socket.removeListener('disconnect', onDisconnect);
      socket.removeListener('new_post', increaseNumNewPosts);
      socket.removeListener('new_notification', increaseNumNewNotis);
      socket.removeListener(
        'receive_chat_file_upload_progress',
        onReceiveUploadProgress
      );
      socket.removeListener('receive_message', onReceiveMessage);
      socket.removeListener('subject_change', onSubjectChange);
    };

    function onChatInvitation(data) {
      socket.emit('join_chat_channel', data.channelId);
    }
    async function onConnect() {
      console.log('connected to socket');
      const { section } = getSectionFromPathname(pathname);
      onClearRecentChessMessage();
      changeSocketStatus(true);
      handleCheckVersion();
      if (userId) {
        handleGetNumberOfUnreadMessages();
        socket.emit('bind_uid_to_socket', userId, username);
        if (section === 'talk') {
          const data = await loadChat();
          onInitChat(data);
        }
      }
      if (section !== 'talk') {
        onClearChatLoadedState();
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
      changeSocketStatus(false);
    }
    async function handleReceiveMessage(message, channel) {
      const { section } = getSectionFromPathname(pathname);
      if (
        message.channelId !== GENERAL_CHAT_ID &&
        message.userId !== userId &&
        section !== 'talk'
      ) {
        onIncreaseNumberOfUnreadMessages();
      }

      let messageIsForCurrentChannel = message.channelId === selectedChannelId;
      let senderIsNotTheUser = message.userId !== userId;
      if (messageIsForCurrentChannel && senderIsNotTheUser) {
        await updateChatLastRead({ channelId: message.channelId });
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
      updateApiServerToS3Progress({
        progress: percentage / 100,
        channelId,
        path
      });
    }
    function onSubjectChange({ subject }) {
      notifyChatSubjectChange(subject);
    }
  });

  useEffect(() => {
    const newNotiNum = numNewPosts + numNewNotis + numChatUnreads;
    const { section } = getSectionFromPathname(pathname);
    document.title = `${
      newNotiNum > 0 && !['links', 'videos', 'subjects'].includes(section)
        ? '(' + newNotiNum + ') '
        : ''
    }Twinkle`;
  }, [numNewNotis, numNewPosts, numChatUnreads, pathname]);

  useEffect(() => {
    socket.connect();
    return function cleanUp() {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.disconnect();
    socket.connect();
    changeRankingsLoadedStatus(false);
    if (userId) {
      socket.emit('bind_uid_to_socket', userId, username);
      socket.emit('enter_my_notification_channel', userId);
    } else {
      if (prevUserIdRef.current) {
        socket.emit('leave_my_notification_channel', prevUserIdRef.current);
      }
    }
    prevUserIdRef.current = userId;
  }, [userId]);

  useEffect(() => {
    showUpdateNotice(versionMatch);
  }, [versionMatch]);

  const isUsername =
    !['links', 'videos', 'talk', 'comments', 'subjects'].includes(
      getSectionFromPathname(pathname)?.section
    ) && pathname.length > 1;

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
            height: 9rem;
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
          <TwinkleLogo style={{ marginLeft: '3rem' }} history={history} />
          <MainNavs
            isAtExploreTab={['links', 'videos', 'subjects'].includes(
              getSectionFromPathname(pathname)?.section
            )}
            defaultSearchFilter={defaultSearchFilter}
            homeLink={homeLink}
            chatLoading={chatLoading}
            isUsername={isUsername}
            numChatUnreads={numChatUnreads}
            numNewNotis={numNewNotis}
            numNewPosts={numNewPosts}
            onChatButtonClick={onChatButtonClick}
            onMobileMenuOpen={onMobileMenuOpen}
            pathname={pathname}
            totalRewardAmount={totalRewardAmount}
          />
          <AccountMenu
            style={{ marginRight: '3rem' }}
            className={`desktop ${css`
              @media (min-width: ${desktopMinWidth}) {
                margin-left: 0.5rem;
              }
            `}`}
            history={history}
          />
        </div>
      </nav>
    </ErrorBoundary>
  );
}

export default connect(
  state => ({
    selectedChannelId: state.ChatReducer.selectedChannelId,
    numNewNotis: state.NotiReducer.numNewNotis,
    numNewPosts: state.NotiReducer.numNewPosts,
    numChatUnreads: state.ChatReducer.numUnreads,
    totalRewardAmount: state.NotiReducer.totalRewardAmount,
    versionMatch: state.NotiReducer.versionMatch
  }),
  {
    changeRankingsLoadedStatus,
    changeSocketStatus,
    onCheckVersion,
    increaseNumNewPosts,
    increaseNumNewNotis,
    notifyChatSubjectChange,
    resetChat,
    updateApiServerToS3Progress
  }
)(withRouter(Header));
