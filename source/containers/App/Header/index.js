import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import AccountMenu from './AccountMenu';
import MainNavs from './MainNavs';
import TwinkleLogo from './TwinkleLogo';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { logout } from 'redux/actions/UserActions';
import {
  clearRecentChessMessage,
  getNumberOfUnreadMessages,
  increaseNumberOfUnreadMessages,
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
import { GENERAL_CHAT_ID } from 'constants/database';
import { css } from 'emotion';
import { desktopMinWidth } from 'constants/css';
import { socket } from 'constants/io';
import { recordUserAction } from 'helpers/userDataHelpers';
import { container } from './Styles';

Header.propTypes = {
  chatLoading: PropTypes.bool,
  changeRankingsLoadedStatus: PropTypes.func.isRequired,
  changeSocketStatus: PropTypes.func,
  checkVersion: PropTypes.func,
  clearRecentChessMessage: PropTypes.func,
  history: PropTypes.object.isRequired,
  increaseNumNewPosts: PropTypes.func,
  increaseNumNewNotis: PropTypes.func,
  increaseNumberOfUnreadMessages: PropTypes.func,
  location: PropTypes.object,
  loggedIn: PropTypes.bool,
  logout: PropTypes.func,
  mobileNavbarShown: PropTypes.bool,
  notifyChatSubjectChange: PropTypes.func,
  numChatUnreads: PropTypes.number,
  numNewNotis: PropTypes.number,
  numNewPosts: PropTypes.number,
  onChatButtonClick: PropTypes.func,
  onMobileMenuOpen: PropTypes.func,
  resetChat: PropTypes.func,
  searchFilter: PropTypes.string,
  showUpdateNotice: PropTypes.func,
  style: PropTypes.object,
  totalRewardAmount: PropTypes.number,
  updateApiServerToS3Progress: PropTypes.func.isRequired,
  userId: PropTypes.number,
  username: PropTypes.string,
  versionMatch: PropTypes.bool
};

function Header({
  changeRankingsLoadedStatus,
  chatLoading,
  changeSocketStatus,
  checkVersion,
  clearRecentChessMessage,
  history,
  increaseNumNewPosts,
  increaseNumNewNotis,
  increaseNumberOfUnreadMessages,
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
  searchFilter,
  showUpdateNotice,
  style = {},
  totalRewardAmount,
  updateApiServerToS3Progress,
  userId,
  username,
  versionMatch
}) {
  const prevUserIdRef = useRef(userId);
  const category = ['videos', 'subjects', 'links'].includes(searchFilter)
    ? searchFilter
    : 'subjects';
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
    }
    function onConnect() {
      console.log('connected to socket');
      clearRecentChessMessage();
      changeSocketStatus(true);
      checkVersion();
      if (userId) {
        socket.emit('bind_uid_to_socket', userId, username);
      }
    }
    function onDisconnect() {
      console.log('disconnected from socket');
      changeSocketStatus(false);
    }
    function onReceiveMessage(data) {
      if (data.channelId !== GENERAL_CHAT_ID && data.userId !== userId) {
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
      pathname.split('/')[1]
    ) && pathname.length > 1;

  return (
    <nav
      className={`unselectable ${container} ${
        mobileNavbarShown ? '' : 'desktop'
      }`}
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
          category={category}
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
          loggedIn={loggedIn}
          logout={onLogout}
          title={username}
        />
      </div>
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
    searchFilter: state.UserReducer.searchFilter,
    username: state.UserReducer.username,
    userType: state.UserReducer.userType,
    userId: state.UserReducer.userId,
    mobileNavbarShown: state.ViewReducer.mobileNavbarShown,
    numNewNotis: state.NotiReducer.numNewNotis,
    numNewPosts: state.NotiReducer.numNewPosts,
    numChatUnreads: state.ChatReducer.numUnreads,
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
    logout,
    notifyChatSubjectChange,
    resetChat,
    updateApiServerToS3Progress
  }
)(withRouter(Header));
