import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import activeComponent from 'react-router-active-component';
import {openSigninModal, closeSigninModal, logout} from 'redux/actions/UserActions';
import {
  getNumberOfUnreadMessagesAsync,
  increaseNumberOfUnreadMessages,
  turnChatOff } from 'redux/actions/ChatActions';
import {fetchNotificationsAsync} from 'redux/actions/NotiActions';
import {getInitialVideos} from 'redux/actions/VideoActions';
import {getPinnedPlaylistsAsync, getPlaylistsAsync} from 'redux/actions/PlaylistActions';
import SigninModal from '../Signin';
import {bindActionCreators} from 'redux';
import AccountMenu from './AccountMenu';
import ChatButton from './ChatButton';
import NotificationsButton from './NotificationsButton';
import {Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';
import {GENERAL_CHAT_ID} from 'constants/database';
import {browserHistory} from 'react-router';
import SearchBox from './SearchBox';
import HeaderNav from 'components/HeaderNav';

@connect(
  state => ({
    loggedIn: state.UserReducer.loggedIn,
    username: state.UserReducer.username,
    userType: state.UserReducer.userType,
    isAdmin: state.UserReducer.isAdmin,
    userId: state.UserReducer.userId,
    signinModalShown: state.UserReducer.signinModalShown,
    numChatUnreads: state.ChatReducer.numUnreads,
    notifications: state.NotiReducer.notifications
  }),
  {
    openSigninModal,
    closeSigninModal,
    logout,
    turnChatOff,
    getNumberOfUnreadMessages: getNumberOfUnreadMessagesAsync,
    increaseNumberOfUnreadMessages,
    fetchNotifications: fetchNotificationsAsync,
    getInitialVideos,
    getPinnedPlaylists: getPinnedPlaylistsAsync,
    getPlaylists: getPlaylistsAsync
  }
)
export default class Header extends Component {
  constructor(props) {
    super()
    this.state = {
      notificationsMenuShown: false,
      selectedTab: !props.location || props.location.pathname === '/' ?
      'home' : props.location.pathname.split('/')[1]
    }

    this.onLogoClick = this.onLogoClick.bind(this)

    const {socket, turnChatOff, increaseNumberOfUnreadMessages} = props;
    if (!!browserHistory) {
      socket.on('connect', () => {
        if (this.props.userId) {
          socket.emit('bind_uid_to_socket', this.props.userId, this.props.username);
        }
      })
      socket.on('receive_notification', data => {
        console.log(data);
      })
      socket.on('receive_message', data => {
        if (data.channelId !== GENERAL_CHAT_ID && data.userId !== this.props.userId) {
          increaseNumberOfUnreadMessages()
        }
      })
      socket.on('chat_invitation', data => {
        socket.emit('join_chat_channel', data.channelId);
        increaseNumberOfUnreadMessages();
      })
      socket.on('disconnect', () => {
        turnChatOff()
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    const {getNumberOfUnreadMessages, socket, fetchNotifications} = this.props;
    if (nextProps.userId && !this.props.userId) {
      socket.connect();
      socket.emit('bind_uid_to_socket', nextProps.userId, nextProps.username);
    }
    if (!nextProps.userId && this.props.userId) {
      socket.disconnect();
    }
    if (nextProps.userId && nextProps.userId !== this.props.userId) {
      getNumberOfUnreadMessages();
      fetchNotifications();
    }
    if (nextProps.userId && nextProps.chatMode !== this.props.chatMode && nextProps.chatMode === false) {
      getNumberOfUnreadMessages()
    }
  }

  componentDidUpdate(prevProps) {
    const {socket, userId, location} = this.props;
    if (userId !== prevProps.userId) {
      if (prevProps.userId !== null) socket.emit('leave_my_notification_channel', prevProps.userId);
      socket.emit('enter_my_notification_channel', userId);
    }
    if (prevProps.location.pathname !== location.pathname) {
      const pathname = location.pathname.split('/')[1] || location.pathname
      this.setState({
        selectedTab: !location || location.pathname === '/' ? 'home' : pathname
      })
    }
  }

  render() {
    const {
      signinModalShown,
      loggedIn,
      logout,
      username,
      userType,
      isAdmin,
      userId,
      chatMode,
      openSigninModal,
      closeSigninModal,
      onChatButtonClick,
      staticTop,
      numChatUnreads,
      notifications,
      getInitialVideos,
      getPinnedPlaylists,
      getPlaylists,
      fetchFeeds
    } = this.props;

    const {notificationsMenuShown, selectedTab} = this.state;
    let staticTopOn;
    let fixedTopOn;
    if (staticTop) {
      staticTopOn = true;
      fixedTopOn = false;
    } else {
      staticTopOn = false;
      fixedTopOn = true;
    }
    return (
      <Navbar staticTop={staticTopOn} fixedTop={fixedTopOn} fluid>
        <Link
          className="navbar-brand"
          style={{cursor: 'pointer'}}
          to="/"
          onClick={this.onLogoClick}
        >
          Twinkle
        </Link>
        {!chatMode && [
            <ul className="nav navbar-nav" key="navItems">
              <HeaderNav
                key="home"
                to="/"
                selected={selectedTab === 'home'}
              >
                Home
              </HeaderNav>
              <HeaderNav
                key="videos"
                to="videos"
                onClick={() => {
                  getInitialVideos()
                  getPinnedPlaylists()
                  getPlaylists()
                }}
                selected={selectedTab === 'videos'}
              >
                Videos
              </HeaderNav>
            </ul>,
            <SearchBox key="searchBox" />
          ]
        }
        <Nav pullRight className="flexbox-container">
          {loggedIn && [
            <ChatButton
              key={1}
              onClick={() => onChatButtonClick()}
              chatMode={chatMode}
              numUnreads={numChatUnreads}
            />/*,
            <NotificationsButton
              onHideMenu={() => this.setState({notificationsMenuShown: false})}
              onClick={() => this.setState({notificationsMenuShown: !notificationsMenuShown})}
              menuShown={notificationsMenuShown}
              notifications={notifications}
              key={2}
            />*/
          ]}
          {loggedIn ?
            <AccountMenu
              title={username}
              logout={logout}
            /> :
            <NavItem onClick={() => openSigninModal()}>Log In | Sign Up</NavItem>
          }
        </Nav>
        {signinModalShown &&
          <SigninModal show onHide={() => closeSigninModal()} />
        }
      </Navbar>
    )
  }

  onLogoClick() {
    this.setState({selectedTab: 'home'})
    if (this.props.chatMode) {
      this.props.turnChatOff();
    }
  }
}
