import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {openSigninModal, closeSigninModal, logout} from 'redux/actions/UserActions'
import {
  getNumberOfUnreadMessagesAsync,
  increaseNumberOfUnreadMessages,
  turnChatOff
} from 'redux/actions/ChatActions'
import {reloadFeeds, clearFeeds} from 'redux/actions/FeedActions'
import {getInitialVideos} from 'redux/actions/VideoActions'
import {
  getPlaylistsAsync,
  getPinnedPlaylistsAsync
} from 'redux/actions/PlaylistActions'
import SigninModal from 'containers/Signin'
import AccountMenu from './AccountMenu'
import ChatButton from './ChatButton'
// import NotificationsButton from './NotificationsButton'
import {Navbar, Nav, NavItem} from 'react-bootstrap'
import {GENERAL_CHAT_ID} from 'constants/database'
import SearchBox from './SearchBox'
import HeaderNav from './HeaderNav'
import {Color} from 'constants/css'

@connect(
  state => ({
    loggedIn: state.UserReducer.loggedIn,
    username: state.UserReducer.username,
    userType: state.UserReducer.userType,
    isAdmin: state.UserReducer.isAdmin,
    userId: state.UserReducer.userId,
    signinModalShown: state.UserReducer.signinModalShown,
    numChatUnreads: state.ChatReducer.numUnreads,
    chatMode: state.ChatReducer.chatMode,
    notifications: state.NotiReducer.notifications
  }),
  {
    openSigninModal,
    closeSigninModal,
    logout,
    turnChatOff,
    getNumberOfUnreadMessages: getNumberOfUnreadMessagesAsync,
    increaseNumberOfUnreadMessages,
    getPinnedPlaylists: getPinnedPlaylistsAsync,
    getPlaylists: getPlaylistsAsync,
    getInitialVideos,
    reloadFeeds,
    clearFeeds
    // fetchNotifications: fetchNotificationsAsync
  }
)
export default class Header extends Component {
  static propTypes = {
    location: PropTypes.string,
    socket: PropTypes.object,
    turnChatOff: PropTypes.func,
    increaseNumberOfUnreadMessages: PropTypes.func,
    userId: PropTypes.number,
    username: PropTypes.string,
    getNumberOfUnreadMessages: PropTypes.func,
    chatMode: PropTypes.bool,
    onProfilePage: PropTypes.bool,
    signinModalShown: PropTypes.bool,
    loggedIn: PropTypes.bool,
    logout: PropTypes.func,
    openSigninModal: PropTypes.func,
    closeSigninModal: PropTypes.func,
    onChatButtonClick: PropTypes.func,
    numChatUnreads: PropTypes.number,
    reloadFeeds: PropTypes.func,
    clearFeeds: PropTypes.func,
    getInitialVideos: PropTypes.func,
    getPinnedPlaylists: PropTypes.func,
    getPlaylists: PropTypes.func
  }

  constructor(props) {
    super()
    this.state = {
      notificationsMenuShown: false,
      selectedTab: props.location || 'home',
      logoBlue: Color.logoBlue,
      logoGreen: Color.logoGreen,
      feedLoading: false
    }

    this.onLogoClick = this.onLogoClick.bind(this)
  }

  componentDidMount() {
    const {socket, turnChatOff, increaseNumberOfUnreadMessages} = this.props
    socket.on('connect', () => {
      if (this.props.userId) {
        socket.emit('bind_uid_to_socket', this.props.userId, this.props.username)
      }
    })
    socket.on('receive_notification', data => {
      console.log(data)
    })
    socket.on('receive_message', data => {
      if (!this.props.chatMode && data.channelId !== GENERAL_CHAT_ID && data.userId !== this.props.userId) {
        increaseNumberOfUnreadMessages()
      }
    })
    socket.on('chat_invitation', data => {
      socket.emit('join_chat_channel', data.channelId)
      if (!this.props.chatMode) increaseNumberOfUnreadMessages()
    })
    socket.on('disconnect', () => {
      turnChatOff()
    })
  }

  componentWillReceiveProps(nextProps) {
    const {getNumberOfUnreadMessages, socket} = this.props
    if (nextProps.userId && !this.props.userId) {
      socket.connect()
      socket.emit('bind_uid_to_socket', nextProps.userId, nextProps.username)
    }
    if (!nextProps.userId && this.props.userId) {
      socket.disconnect()
    }
    if (nextProps.userId && nextProps.userId !== this.props.userId) {
      getNumberOfUnreadMessages()
      // fetchNotifications()
    }
    if (nextProps.userId && nextProps.chatMode !== this.props.chatMode && nextProps.chatMode === false) {
      getNumberOfUnreadMessages()
    }
  }

  componentDidUpdate(prevProps) {
    const {socket, userId, location, onProfilePage, chatMode} = this.props

    if (userId !== prevProps.userId) {
      if (prevProps.userId !== null) socket.emit('leave_my_notification_channel', prevProps.userId)
      socket.emit('enter_my_notification_channel', userId)
    }

    if (prevProps.location !== location) {
      this.setState({
        selectedTab: location || 'home',
        logoBlue: `#${this.getLogoColor()}`,
        logoGreen: `#${this.getLogoColor()}`
      })
    }

    if (prevProps.onProfilePage !== onProfilePage || prevProps.chatMode !== chatMode) {
      this.setState({
        logoBlue: `#${this.getLogoColor()}`,
        logoGreen: `#${this.getLogoColor()}`
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
      reloadFeeds,
      getInitialVideos,
      getPinnedPlaylists,
      getPlaylists
    } = this.props

    const {selectedTab, logoBlue, logoGreen, feedLoading} = this.state
    return (
      <Navbar fluid fixedTop={!chatMode}>
        <Navbar.Header>
          <Link
            className="navbar-brand"
            style={{
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
            to="/"
            onClick={this.onLogoClick}
          >
            <span style={{color: logoBlue}}>Twin</span><span style={{color: logoGreen}}>kle</span>
          </Link>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          {!chatMode &&
            [<Nav key="navItems">
                <HeaderNav
                  to="/"
                  selected={selectedTab === 'home'}
                  onClick={() => {
                    if (!feedLoading) {
                      this.setState({feedLoading: true})
                      return reloadFeeds().then(
                        () => this.setState({feedLoading: false})
                      )
                    }
                  }}
                >
                  Home
                </HeaderNav>
                <HeaderNav
                  to="/videos"
                  selected={selectedTab === 'videos'}
                  onClick={() => {
                    getInitialVideos()
                    getPinnedPlaylists()
                    getPlaylists()
                  }}
                >
                  Watch
                </HeaderNav>
                {false &&
                  <HeaderNav
                   to="/links"
                   selected={selectedTab === 'links'}
                 >
                   Read
                 </HeaderNav>
                }
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
        return string[Math.floor(Math.random() * string.length)] + (c && factory(string, c - 1))
      }
    )('789ABCDEF', 4)
  }

  onLogoClick() {
    const {clearFeeds} = this.props
    const {selectedTab} = this.state
    if (selectedTab !== 'home') clearFeeds()
    this.setState({selectedTab: 'home'})
    if (this.props.chatMode) {
      this.props.turnChatOff()
    }
  }
}
