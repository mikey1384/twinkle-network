import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import AccountMenu from './AccountMenu';
import Icon from 'components/Icon';
import MainNavs from './MainNavs';
import TwinkleLogo from './TwinkleLogo';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { logout } from 'redux/actions/UserActions';
import {
  clearRecentChessMessage,
  getNumberOfUnreadMessages,
  increaseNumberOfUnreadMessages,
  turnChatOff,
  resetChat,
  updateApiServerToS3Progress
} from 'redux/actions/ChatActions';
import {
  changeRankingsLoadedStatus,
  changeSocketStatus,
  checkVersion,
  notifyChatSubjectChange,
  increaseNumNewPosts,
  increaseNumNewNotis
} from 'redux/actions/NotiActions';
import { closeSearch, initSearch } from 'redux/actions/SearchActions';
import { GENERAL_CHAT_ID } from 'constants/database';
import { css } from 'emotion';
import { desktopMinWidth } from 'constants/css';
import { socket } from 'constants/io';
import { recordUserAction } from 'helpers/userDataHelpers';
import { container } from './Styles';

Header.propTypes = {
  chatLoading: PropTypes.bool,
  chatMode: PropTypes.bool,
  changeRankingsLoadedStatus: PropTypes.func.isRequired,
  changeSocketStatus: PropTypes.func,
  checkVersion: PropTypes.func,
  clearRecentChessMessage: PropTypes.func,
  history: PropTypes.object.isRequired,
  getNumberOfUnreadMessages: PropTypes.func,
  increaseNumNewPosts: PropTypes.func,
  increaseNumNewNotis: PropTypes.func,
  increaseNumberOfUnreadMessages: PropTypes.func,
  initSearch: PropTypes.func,
  location: PropTypes.object,
  loggedIn: PropTypes.bool,
  logout: PropTypes.func,
  mobileNavbarShown: PropTypes.bool,
  notifyChatSubjectChange: PropTypes.func,
  numChatUnreads: PropTypes.number,
  numNewNotis: PropTypes.number,
  numNewPosts: PropTypes.number,
  onChatButtonClick: PropTypes.func,
  closeSearch: PropTypes.func.isRequired,
  onMobileMenuOpen: PropTypes.func,
  resetChat: PropTypes.func,
  searchMode: PropTypes.bool,
  showUpdateNotice: PropTypes.func,
  style: PropTypes.object,
  totalRewardAmount: PropTypes.number,
  turnChatOff: PropTypes.func,
  updateApiServerToS3Progress: PropTypes.func.isRequired,
  userId: PropTypes.number,
  username: PropTypes.string,
  versionMatch: PropTypes.bool
};

function Header({
  changeRankingsLoadedStatus,
  chatLoading,
  chatMode,
  changeSocketStatus,
  checkVersion,
  clearRecentChessMessage,
  closeSearch,
  getNumberOfUnreadMessages,
  history,
  increaseNumNewPosts,
  increaseNumNewNotis,
  increaseNumberOfUnreadMessages,
  initSearch,
  location: { pathname },
  logout,
  loggedIn,
  mobileNavbarShown,
  notifyChatSubjectChange,
  numChatUnreads,
  numNewNotis,
  numNewPosts,
  onChatButtonClick,
  onMobileMenuOpen,
  resetChat,
  searchMode,
  showUpdateNotice,
  style = {},
  totalRewardAmount,
  turnChatOff,
  updateApiServerToS3Progress,
  userId,
  username,
  versionMatch
}) {
  const prevUserIdRef = useRef(userId);
  useEffect(() => {
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('chat_invitation', onChatInvitation);
    socket.on('receive_message', onReceiveMessage);
    socket.on('new_story_post', increaseNumNewPosts);
    socket.on('new_notification', increaseNumNewNotis);
    socket.on('receive_chat_file_upload_progress', onReceiveUploadProgress);
    socket.on('subject_change', onSubjectChange);

    return function cleanUp() {
      socket.removeListener('chat_invitation', onChatInvitation);
      socket.removeListener('connect', onConnect);
      socket.removeListener('disconnect', onDisconnect);
      socket.removeListener('new_story_post', increaseNumNewPosts);
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
      if (!chatMode) increaseNumberOfUnreadMessages();
    }
    function onConnect() {
      console.log('connected to socket');
      clearRecentChessMessage();
      changeSocketStatus(true);
      checkVersion();
      if (userId) {
        socket.emit('bind_uid_to_socket', userId, username);
        if (!chatMode) {
          getNumberOfUnreadMessages();
        }
      }
    }
    function onDisconnect() {
      console.log('disconnected from socket');
      changeSocketStatus(false);
    }
    function onReceiveMessage(data) {
      if (
        !chatMode &&
        data.channelId !== GENERAL_CHAT_ID &&
        data.userId !== userId
      ) {
        increaseNumberOfUnreadMessages();
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
      if (!chatMode) {
        getNumberOfUnreadMessages();
      }
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
    pathname.split('/')[1] !== 'featured' &&
    !['links', 'videos'].includes(pathname.split('/')[1]) &&
    pathname.length > 1;

  return (
    <nav
      className={`unselectable ${container} ${
        mobileNavbarShown ? '' : 'desktop'
      }`}
      style={{
        justifyContent: 'space-around',
        position: chatMode ? 'relative' : 'fixed',
        ...style
      }}
    >
      {chatMode && (
        <div className="chat-bar" onClick={turnChatOff}>
          <Icon icon="times" />
          <div style={{ marginLeft: '1rem' }}>Tap to close chat</div>
        </div>
      )}
      {!chatMode && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <TwinkleLogo
            style={{ marginLeft: '3rem' }}
            closeSearch={closeSearch}
            history={history}
            isUsername={isUsername}
            numNewPosts={numNewPosts}
            pathname={pathname}
          />
          <MainNavs
            chatLoading={chatLoading}
            chatMode={chatMode}
            closeSearch={closeSearch}
            initSearch={initSearch}
            isUsername={isUsername}
            numChatUnreads={numChatUnreads}
            numNewNotis={numNewNotis}
            numNewPosts={numNewPosts}
            onChatButtonClick={onChatButtonClick}
            onMobileMenuOpen={onMobileMenuOpen}
            pathname={pathname}
            searchMode={searchMode}
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
            loggedIn={loggedIn}
            logout={onLogout}
            title={username}
          />
        </div>
      )}
    </nav>
  );

  function onLogout() {
    recordUserAction({ action: 'logout' });
    logout();
    resetChat();
  }
}

export default connect(
  state => ({
    loggedIn: state.UserReducer.loggedIn,
    username: state.UserReducer.username,
    userType: state.UserReducer.userType,
    userId: state.UserReducer.userId,
    mobileNavbarShown: state.ViewReducer.mobileNavbarShown,
    numNewNotis: state.NotiReducer.numNewNotis,
    numNewPosts: state.NotiReducer.numNewPosts,
    numChatUnreads: state.ChatReducer.numUnreads,
    chatMode: state.ChatReducer.chatMode,
    searchMode: state.SearchReducer.searchMode,
    totalRewardAmount: state.NotiReducer.totalRewardAmount,
    versionMatch: state.NotiReducer.versionMatch
  }),
  {
    changeRankingsLoadedStatus,
    changeSocketStatus,
    checkVersion,
    clearRecentChessMessage,
    getNumberOfUnreadMessages,
    increaseNumNewPosts,
    increaseNumNewNotis,
    increaseNumberOfUnreadMessages,
    initSearch,
    logout,
    notifyChatSubjectChange,
    closeSearch,
    resetChat,
    turnChatOff,
    updateApiServerToS3Progress
  }
)(withRouter(Header));
