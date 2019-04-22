import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import AccountMenu from './AccountMenu';
import ChatButton from './ChatButton';
import Icon from 'components/Icon';
import SearchBox from '../SearchBox';
import HeaderNav from './HeaderNav';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Route } from 'react-router-dom';
import { logout } from 'redux/actions/UserActions';
import {
  getNumberOfUnreadMessages,
  increaseNumberOfUnreadMessages,
  turnChatOff,
  resetChat
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
import { Color, desktopMinWidth } from 'constants/css';
import { socket } from 'constants/io';
import { recordUserAction } from 'helpers/userDataHelpers';
import { container, logo } from './Styles';

Header.propTypes = {
  chatLoading: PropTypes.bool,
  chatMode: PropTypes.bool,
  changeRankingsLoadedStatus: PropTypes.func.isRequired,
  changeSocketStatus: PropTypes.func,
  checkVersion: PropTypes.func,
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
  searchBoxRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  searchMode: PropTypes.bool,
  showUpdateNotice: PropTypes.func,
  style: PropTypes.object,
  totalRewardAmount: PropTypes.number,
  turnChatOff: PropTypes.func,
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
  searchBoxRef,
  searchMode,
  showUpdateNotice,
  style = {},
  totalRewardAmount,
  turnChatOff,
  userId,
  username,
  versionMatch
}) {
  const [prevPathname, setPrevPathname] = useState();
  const prevUserIdRef = useRef(userId);
  useEffect(() => {
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('chat_invitation', onChatInvitation);
    socket.on('receive_message', onReceiveMessage);
    socket.on('subject_change', onSubjectChange);
    socket.on('new_story_post', increaseNumNewPosts);
    socket.on('new_notification', increaseNumNewNotis);

    return function cleanUp() {
      socket.removeListener('chat_invitation', onChatInvitation);
      socket.removeListener('connect', onConnect);
      socket.removeListener('disconnect', onDisconnect);
      socket.removeListener('new_story_post', increaseNumNewPosts);
      socket.removeListener('new_notification', increaseNumNewNotis);
      socket.removeListener('receive_message', onReceiveMessage);
      socket.removeListener('subject_change', onSubjectChange);
    };

    function onChatInvitation(data) {
      socket.emit('join_chat_channel', data.channelId);
      if (!chatMode) increaseNumberOfUnreadMessages();
    }
    function onConnect() {
      console.log('connected to socket');
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
      if (
        !chatMode &&
        data.channelId !== GENERAL_CHAT_ID &&
        data.userId !== userId
      ) {
        increaseNumberOfUnreadMessages();
      }
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
    return function() {
      setPrevPathname(pathname);
    };
  }, [pathname]);

  useEffect(() => {
    showUpdateNotice(versionMatch);
  }, [versionMatch]);

  const isUsername =
    pathname.split('/')[1] !== 'xp' &&
    ['links', 'videos'].indexOf(pathname.split('/')[1]) === -1 &&
    pathname.length > 1;

  const notAtHomeSection =
    ['links', 'videos', 'xp', 'comments', 'subjects'].indexOf(
      pathname.split('/')[1]
    ) === -1;

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
        <div className="main-tabs">
          <Route
            to="/"
            children={({ match }) => {
              return (
                <div
                  className={logo.outer}
                  onClick={() => {
                    history.push('/');
                    closeSearch();
                  }}
                >
                  <div
                    onClick={onLogoClick}
                    className={`${logo.inner} ${
                      isUsername || match.isExact ? 'active' : ''
                    }`}
                  >
                    <span
                      style={
                        notAtHomeSection && numNewPosts > 0
                          ? {
                              color: Color.gold()
                            }
                          : {}
                      }
                      className="logo logo-twin"
                    >
                      Twin
                    </span>
                    <span
                      style={
                        notAtHomeSection && numNewPosts > 0
                          ? {
                              color: Color.gold()
                            }
                          : {}
                      }
                      className="logo logo-kle"
                    >
                      kle
                    </span>
                  </div>
                </div>
              );
            }}
          />
          <>
            <HeaderNav
              className={`${searchMode || chatLoading ? 'hidden' : 'mobile'}`}
              alert={numNewNotis > 0 || totalRewardAmount > 0}
              alertColor={Color.gold()}
              imgLabel="user"
              onClick={onMobileMenuOpen}
            />
            <div
              className={`header-nav ${chatLoading ? 'hidden' : 'mobile'}`}
              onClick={searchMode ? closeSearch : initSearch}
              style={{ width: searchMode && '10%' }}
            >
              <a className={searchMode ? 'active' : ''}>
                {searchMode ? <Icon icon="times" /> : <Icon icon="search" />}
              </a>
            </div>
            <HeaderNav
              to="/"
              onClick={() => {
                closeSearch();
                window.scrollTo(0, 0);
              }}
              isHome
              className={chatLoading || searchMode ? 'hidden' : 'mobile'}
              imgLabel="home"
              alert={numNewPosts > 0}
              isUsername={isUsername}
            >
              Home
            </HeaderNav>
            <HeaderNav
              to="/xp"
              onClick={closeSearch}
              pathname={pathname}
              className={chatLoading || searchMode ? 'hidden' : 'mobile'}
              imgLabel="bolt"
            />
            {renderWorkNav()}
          </>
          <div
            className={!searchMode || chatLoading ? 'desktop' : ''}
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginLeft: '1rem',
              marginRight: '1rem',
              width: '60%'
            }}
          >
            <SearchBox
              innerRef={searchBoxRef}
              onFocus={initSearch}
              style={{
                width: '95%'
              }}
            />
          </div>
          <div
            className={`header-nav ${
              chatLoading || chatMode ? 'hidden' : 'mobile'
            }`}
            style={{ width: searchMode && '10%' }}
            onClick={onChatButtonClick}
          >
            <a
              style={{
                color: numChatUnreads > 0 && Color.gold()
              }}
            >
              <Icon icon="comments" />
            </a>
          </div>
          <div className={`header-nav ${chatLoading ? 'mobile' : 'hidden'}`}>
            Loading...
          </div>
          <div>
            <ChatButton
              className="desktop"
              onClick={onChatButtonClick}
              chatMode={chatMode}
              loading={chatLoading}
              numUnreads={numChatUnreads}
            />
          </div>
          <AccountMenu
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

  function onLogoClick() {
    document.getElementById('App').scrollTop = 0;
  }

  function onLogout() {
    recordUserAction({ action: 'logout' });
    logout();
    resetChat();
  }

  function renderWorkNav() {
    if (
      !prevPathname ||
      ['xp', 'links', 'videos'].indexOf(pathname.split('/')[1]) === -1
    ) {
      return (
        <HeaderNav
          to="/xp"
          onClick={closeSearch}
          pathname={pathname}
          className="desktop"
          imgLabel="bolt"
        >
          EARN XP
        </HeaderNav>
      );
    }

    if (['links'].indexOf(prevPathname.split('/')[1]) !== -1) {
      return (
        <HeaderNav
          to="/links"
          onClick={closeSearch}
          pathname={pathname}
          className="desktop"
          imgLabel="book"
        >
          READ
        </HeaderNav>
      );
    }

    if (['videos'].indexOf(prevPathname.split('/')[1]) !== -1) {
      return (
        <HeaderNav
          to="/videos"
          onClick={closeSearch}
          pathname={pathname}
          className="desktop"
          imgLabel="film"
        >
          WATCH
        </HeaderNav>
      );
    }

    return (
      <HeaderNav
        to="/xp"
        onClick={closeSearch}
        pathname={pathname}
        className="desktop"
        imgLabel="bolt"
      >
        EARN XP
      </HeaderNav>
    );
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
    getNumberOfUnreadMessages,
    increaseNumNewPosts,
    increaseNumNewNotis,
    increaseNumberOfUnreadMessages,
    initSearch,
    logout,
    notifyChatSubjectChange,
    closeSearch,
    resetChat,
    turnChatOff
  }
)(withRouter(Header));
