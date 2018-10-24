import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Route } from 'react-router-dom';
import Link from 'components/Link';
import { logout } from 'redux/actions/UserActions';
import {
  getNumberOfUnreadMessages,
  increaseNumberOfUnreadMessages,
  turnChatOff,
  resetChat
} from 'redux/actions/ChatActions';
import {
  changeSocketStatus,
  checkVersion,
  notifyChatSubjectChange,
  increaseNumNewPosts,
  increaseNumNewNotis
} from 'redux/actions/NotiActions';
import { closeSearch, initSearch } from 'redux/actions/SearchActions';
import AccountMenu from './AccountMenu';
import ChatButton from './ChatButton';
import Icon from 'components/Icon';
import { GENERAL_CHAT_ID } from 'constants/database';
import SearchBox from '../SearchBox';
import HeaderNav from './HeaderNav';
import { css } from 'emotion';
import { Color, desktopMinWidth } from 'constants/css';
import { socket } from 'constants/io';
import { recordUserAction } from 'helpers/userDataHelpers';
import { container, logo } from './Styles';

class Header extends Component {
  static propTypes = {
    chatLoading: PropTypes.bool,
    chatMode: PropTypes.bool,
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
    searchBoxRef: PropTypes.func,
    searchMode: PropTypes.bool,
    showUpdateNotice: PropTypes.func,
    style: PropTypes.object,
    totalRewardAmount: PropTypes.number,
    turnChatOff: PropTypes.func,
    userId: PropTypes.number,
    username: PropTypes.string,
    versionMatch: PropTypes.bool
  };

  state = {
    notificationsMenuShown: false,
    feedLoading: false
  };

  componentDidMount() {
    const {
      increaseNumNewPosts,
      increaseNumNewNotis,
      increaseNumberOfUnreadMessages,
      checkVersion,
      changeSocketStatus
    } = this.props;
    socket.on('connect', () => {
      console.log('connected to socket');
      changeSocketStatus(true);
      checkVersion();
      if (this.props.userId) {
        socket.emit(
          'bind_uid_to_socket',
          this.props.userId,
          this.props.username
        );
      }
    });
    socket.on('receive_message', data => {
      if (
        !this.props.chatMode &&
        data.channelId !== GENERAL_CHAT_ID &&
        data.userId !== this.props.userId
      ) {
        increaseNumberOfUnreadMessages();
      }
    });
    socket.on('chat_invitation', data => {
      socket.emit('join_chat_channel', data.channelId);
      if (!this.props.chatMode) increaseNumberOfUnreadMessages();
    });
    socket.on('disconnect', () => {
      console.log('disconnected from socket');
      changeSocketStatus(false);
    });
    socket.on('subject_change', this.onSubjectChange);
    socket.on('new_story_post', increaseNumNewPosts);
    socket.on('new_notification', increaseNumNewNotis);
  }

  componentDidUpdate(prevProps) {
    const {
      chatMode,
      userId,
      username,
      getNumberOfUnreadMessages,
      showUpdateNotice,
      versionMatch
    } = this.props;
    if (userId && !prevProps.userId) {
      socket.connect();
      socket.emit('bind_uid_to_socket', userId, username);
    }
    if (!userId && prevProps.userId) {
      socket.disconnect();
    }
    if (userId && userId !== prevProps.userId) {
      getNumberOfUnreadMessages();
    }
    if (userId && chatMode !== prevProps.chatMode && chatMode === false) {
      getNumberOfUnreadMessages();
    }
    if (versionMatch !== prevProps.versionMatch) {
      showUpdateNotice(versionMatch);
    }
    if (userId !== prevProps.userId) {
      if (prevProps.userId !== null) {
        socket.emit('leave_my_notification_channel', prevProps.userId);
      }
      socket.emit('enter_my_notification_channel', userId);
    }
  }

  render() {
    const {
      chatLoading,
      location: { pathname },
      history,
      loggedIn,
      username,
      chatMode,
      initSearch,
      onChatButtonClick,
      onMobileMenuOpen,
      mobileNavbarShown,
      numChatUnreads,
      numNewNotis,
      numNewPosts,
      closeSearch,
      searchBoxRef,
      searchMode,
      style = {},
      totalRewardAmount,
      turnChatOff
    } = this.props;
    const isUsername =
      pathname.split('/')[1] !== 'videos' &&
      ['links', 'twinklexp'].indexOf(pathname.split('/')[1]) === -1 &&
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
          <div className="main-tabs">
            <Route
              to="/"
              children={({ match }) => {
                return (
                  <Link onClick={closeSearch} to="/">
                    <div className={logo.outer}>
                      <div
                        onClick={this.onLogoClick}
                        className={`${logo.inner} ${
                          isUsername || match.isExact ? 'active' : ''
                        }`}
                      >
                        <span
                          style={
                            numNewPosts > 0
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
                            numNewPosts > 0
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
                  </Link>
                );
              }}
            />
            <>
              <HeaderNav
                className={`${searchMode || chatLoading ? 'hidden' : 'mobile'}`}
                alert={numNewNotis > 0 || totalRewardAmount > 0}
                alertColor={Color.pink()}
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
                to="/videos"
                onClick={closeSearch}
                className={chatLoading || searchMode ? 'desktop' : ''}
                imgLabel="film"
              >
                Watch
              </HeaderNav>
              <HeaderNav
                to="/links"
                onClick={closeSearch}
                className={`${chatLoading || searchMode ? 'desktop' : ''} ${css`
                  @media (min-width: ${desktopMinWidth}) {
                    margin-right: 1rem;
                    margin-left: 2rem;
                  }
                `}`}
                imgLabel="book"
              >
                Read
              </HeaderNav>
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
                  color: numChatUnreads > 0 && Color.pink()
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
              logout={this.onLogout}
              title={username}
            />
          </div>
        )}
      </nav>
    );
  }

  onLogoClick = () => {
    if (this.props.chatMode) {
      this.props.turnChatOff();
    }
  };

  onLogout = () => {
    const { logout, resetChat } = this.props;
    recordUserAction({ action: 'logout' });
    logout();
    resetChat();
  };

  onSubjectChange = ({ subject }) => {
    const { notifyChatSubjectChange } = this.props;
    notifyChatSubjectChange(subject);
  };
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
