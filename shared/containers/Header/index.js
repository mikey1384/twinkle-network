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
import SigninModal from '../Signin';
import {bindActionCreators} from 'redux';
import AccountMenu from './AccountMenu';
import ChatButton from './ChatButton';
import NotificationsButton from './NotificationsButton';
import {Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';
import {GENERAL_CHAT_ID} from 'constants/database';
import {browserHistory} from 'react-router';
import SearchBox from './SearchBox';

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
    fetchNotifications: fetchNotificationsAsync
  }
)
export default class Header extends Component {
  constructor(props) {
    super()

    this.state = {
      tabClicked: false,
      notificationsMenuShown: false
    }

    this.handleClick = this.handleClick.bind(this)

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
    const {socket, userId} = this.props;
    if (userId !== prevProps.userId) {
      if (prevProps.userId !== null) socket.emit('leave_my_notification_channel', prevProps.userId);
      socket.emit('enter_my_notification_channel', userId);
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
      notifications
    } = this.props;

    const {notificationsMenuShown} = this.state;

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
          onClick={this.handleClick}
        >
          Twinkle
        </Link>
        {!chatMode && <SearchBox />}
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

  renderTabs() {
    const NavLink = activeComponent('li');
    const {chatMode} = this.props;
    return chatMode ? null : (
      <Nav onClick={this.handleClick}>
        { /*
        <NavLink
          to="/"
          onlyActiveOnIndex
        >
          Home
        </NavLink>
        <NavLink to="/contents">
          Contents
        </NavLink>
          <NavLink to="/profile">
            Profile
          </NavLink>
          <NavLink to="/posts">
            Posts
          </NavLink>
          <NavLink to="/discussion">
            Discussion
          </NavLink>
          { this.props.isAdmin &&
            <NavLink to="/management">
              Management
            </NavLink>
          }
          */
        }
      </Nav>
    )
  }

  handleClick() {
    this.setState({tabClicked: true})
    if (this.props.chatMode) {
      this.props.turnChatOff();
    }
  }
}
