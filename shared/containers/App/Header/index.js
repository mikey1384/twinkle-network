import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {openSigninModal, closeSigninModal, logout} from 'redux/actions/UserActions';
import {
  getNumberOfUnreadMessagesAsync,
  increaseNumberOfUnreadMessages,
  turnChatOff } from 'redux/actions/ChatActions';
import {fetchFeedsAsync} from 'redux/actions/FeedActions';
import {getInitialVideos} from 'redux/actions/VideoActions';
import {getPinnedPlaylistsAsync, getPlaylistsAsync} from 'redux/actions/PlaylistActions';
import SigninModal from 'containers/Signin';
import AccountMenu from './AccountMenu';
import ChatButton from './ChatButton';
//import NotificationsButton from './NotificationsButton';
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import {GENERAL_CHAT_ID} from 'constants/database';
import ExecutionEnvironment from 'exenv';
import SearchBox from './SearchBox';
import HeaderNav from './HeaderNav';
import {Color} from 'constants/css';

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
    //fetchNotifications: fetchNotificationsAsync,
    getInitialVideos,
    getPinnedPlaylists: getPinnedPlaylistsAsync,
    getPlaylists: getPlaylistsAsync,
    fetchFeedsAsync
  }
)
export default class Header extends Component {
  constructor(props) {
    super()
    this.state = {
      notificationsMenuShown: false,
      selectedTab: props.location ? props.location : 'home',
      logoColor: Color.logoColor
    }

    this.onLogoClick = this.onLogoClick.bind(this)

    const {socket, turnChatOff, increaseNumberOfUnreadMessages} = props;
    if (ExecutionEnvironment.canUseDOM) {
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
    const {getNumberOfUnreadMessages, socket} = this.props;
    if (nextProps.userId && !this.props.userId) {
      socket.connect();
      socket.emit('bind_uid_to_socket', nextProps.userId, nextProps.username);
    }
    if (!nextProps.userId && this.props.userId) {
      socket.disconnect();
    }
    if (nextProps.userId && nextProps.userId !== this.props.userId) {
      getNumberOfUnreadMessages();
      //fetchNotifications();
    }
    if (nextProps.userId && nextProps.chatMode !== this.props.chatMode && nextProps.chatMode === false) {
      getNumberOfUnreadMessages()
    }
  }

  componentDidUpdate(prevProps) {
    const {socket, userId, location, onProfilePage, chatMode} = this.props;

    if (userId !== prevProps.userId) {
      if (prevProps.userId !== null) socket.emit('leave_my_notification_channel', prevProps.userId);
      socket.emit('enter_my_notification_channel', userId);
    }

    if (prevProps.location !== location) {
      this.setState({
        selectedTab: location ? location : 'home',
        logoColor: `#${this.getLogoColor()}`
      })
    }

    if (prevProps.onProfilePage !== onProfilePage || prevProps.chatMode !== chatMode) {
      this.setState({
        logoColor: `#${this.getLogoColor()}`
      })
    }
  }

  render() {
    const {
      signinModalShown,
      loggedIn,
      logout,
      username,
      chatMode,
      openSigninModal,
      closeSigninModal,
      onChatButtonClick,
      numChatUnreads,
      getInitialVideos,
      getPinnedPlaylists,
      getPlaylists,
      fetchFeedsAsync
    } = this.props;

    const {selectedTab, logoColor} = this.state;
    return (
      <Navbar fluid fixedTop={!chatMode}>
        <Navbar.Header>
          <Link
            className="navbar-brand"
            style={{
              cursor: 'pointer',
              fontWeight: 'bold',
              color: logoColor
            }}
            to="/"
            onClick={this.onLogoClick}
          >
            Twinkle
          </Link>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          {!chatMode && [
              <Nav key="navItems">
                <HeaderNav
                  to="/"
                  selected={selectedTab === 'home'}
                  onClick={() => fetchFeedsAsync()}
                >
                  Home
                </HeaderNav>
                <HeaderNav
                  to="/videos"
                  onClick={() => {
                    getInitialVideos()
                    getPinnedPlaylists()
                    getPlaylists()
                  }}
                  selected={selectedTab === 'videos'}
                >
                  Videos
                </HeaderNav>
                {false && <HeaderNav
                  to="/links"
                  selected={selectedTab === 'links'}
                >
                  Links
                </HeaderNav>}
              </Nav>,
              <SearchBox className="col-xs-6" style={{marginTop: '6px'}} key="searchBox" />
            ]
          }
          <Nav pullRight>
            {loggedIn && [
              <ChatButton
                key={1}
                onClick={() => onChatButtonClick()}
                chatMode={chatMode}
                numUnreads={numChatUnreads}
              />
              /*,
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
              />
              :
              <NavItem onClick={() => openSigninModal()}>Log In | Sign Up</NavItem>
            }
          </Nav>
        </Navbar.Collapse>
        {signinModalShown &&
          <SigninModal show onHide={() => closeSigninModal()} />
        }
      </Navbar>
    )
  }

  getLogoColor() {
    return (
      function factory(string, c) {
        return string[Math.floor(Math.random() * string.length)] + (c && factory(string, c - 1));
      }
    )('789ABCDEF', 4);
  }

  onLogoClick() {
    this.setState({selectedTab: 'home'})
    if (this.props.chatMode) {
      this.props.turnChatOff();
    }
  }
}
