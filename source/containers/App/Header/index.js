import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import {
  openSigninModal,
  closeSigninModal,
  logout
} from 'redux/actions/UserActions'
import {
  getNumberOfUnreadMessagesAsync,
  increaseNumberOfUnreadMessages,
  turnChatOff,
  resetChat
} from 'redux/actions/ChatActions'
import { getInitialVideos } from 'redux/actions/VideoActions'
import {
  checkVersion,
  notifyChatSubjectChange
} from 'redux/actions/NotiActions'
import {
  getPlaylistsAsync,
  getPinnedPlaylistsAsync
} from 'redux/actions/PlaylistActions'
import SigninModal from 'containers/Signin'
import AccountMenu from './AccountMenu'
import ChatButton from './ChatButton'
import Button from 'components/Button'
import { GENERAL_CHAT_ID } from 'constants/database'
import SearchBox from './SearchBox'
import HeaderNav from './HeaderNav'
import { Color } from 'constants/css'
import { socket } from 'constants/io'
import { recordUserAction } from 'helpers/userDataHelpers'

class Header extends Component {
  static propTypes = {
    chatLoading: PropTypes.bool,
    chatMode: PropTypes.bool,
    checkVersion: PropTypes.func,
    closeSigninModal: PropTypes.func,
    getInitialVideos: PropTypes.func,
    getNumberOfUnreadMessages: PropTypes.func,
    getPinnedPlaylists: PropTypes.func,
    getPlaylists: PropTypes.func,
    increaseNumberOfUnreadMessages: PropTypes.func,
    location: PropTypes.object,
    loggedIn: PropTypes.bool,
    logout: PropTypes.func,
    notifyChatSubjectChange: PropTypes.func,
    numChatUnreads: PropTypes.number,
    onChatButtonClick: PropTypes.func,
    onProfilePage: PropTypes.bool,
    openSigninModal: PropTypes.func,
    resetChat: PropTypes.func,
    showUpdateNotice: PropTypes.func,
    signinModalShown: PropTypes.bool,
    turnChatOff: PropTypes.func,
    userId: PropTypes.number,
    username: PropTypes.string,
    versionMatch: PropTypes.bool
  }

  state = {
    notificationsMenuShown: false,
    logoBlue: Color.logoBlue,
    logoGreen: Color.logoGreen,
    feedLoading: false
  }

  componentDidMount() {
    const {
      turnChatOff,
      increaseNumberOfUnreadMessages,
      checkVersion
    } = this.props
    socket.on('connect', () => {
      checkVersion()
      if (this.props.userId) {
        socket.emit(
          'bind_uid_to_socket',
          this.props.userId,
          this.props.username
        )
      }
    })
    socket.on('receive_message', data => {
      if (
        !this.props.chatMode &&
        data.channelId !== GENERAL_CHAT_ID &&
        data.userId !== this.props.userId
      ) {
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
    socket.on('subject_change', this.onSubjectChange)
  }

  componentWillReceiveProps(nextProps) {
    const { getNumberOfUnreadMessages, showUpdateNotice } = this.props
    if (nextProps.userId && !this.props.userId) {
      socket.connect()
      socket.emit('bind_uid_to_socket', nextProps.userId, nextProps.username)
    }
    if (!nextProps.userId && this.props.userId) {
      socket.disconnect()
    }
    if (nextProps.userId && nextProps.userId !== this.props.userId) {
      getNumberOfUnreadMessages()
    }
    if (
      nextProps.userId &&
      nextProps.chatMode !== this.props.chatMode &&
      nextProps.chatMode === false
    ) {
      getNumberOfUnreadMessages()
    }
    if (nextProps.versionMatch !== this.props.versionMatch) {
      showUpdateNotice(nextProps.versionMatch)
    }
  }

  componentDidUpdate(prevProps) {
    const { userId, location, onProfilePage, chatMode } = this.props

    if (userId !== prevProps.userId) {
      if (prevProps.userId !== null) { socket.emit('leave_my_notification_channel', prevProps.userId) }
      socket.emit('enter_my_notification_channel', userId)
    }

    if (prevProps.location !== location) {
      this.setState({
        logoBlue: `#${this.getLogoColor()}`,
        logoGreen: `#${this.getLogoColor()}`
      })
    }

    if (
      prevProps.onProfilePage !== onProfilePage ||
      prevProps.chatMode !== chatMode
    ) {
      this.setState({
        logoBlue: `#${this.getLogoColor()}`,
        logoGreen: `#${this.getLogoColor()}`
      })
    }
  }

  render() {
    const {
      chatLoading,
      location: { pathname },
      signinModalShown,
      loggedIn,
      username,
      chatMode,
      openSigninModal,
      closeSigninModal,
      onChatButtonClick,
      numChatUnreads,
      getInitialVideos,
      getPinnedPlaylists,
      getPlaylists
    } = this.props

    const { logoBlue, logoGreen } = this.state
    return (
      <nav
        className={`navbar navbar-default${
          !chatMode ? ' navbar-fixed-top' : ''
        }`}
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          width: '100%'
        }}
      >
        <div className="navbar-header">
          <Link
            className="navbar-brand"
            style={{
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
            to="/"
            onClick={this.onLogoClick}
          >
            <span style={{ color: logoBlue }}>Twin</span>
            <span style={{ color: logoGreen }}>kle</span>
          </Link>
        </div>
        <div
          className="col-xs-10"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <ul
            className="nav navbar-nav"
            style={{ display: 'flex', justifyContent: 'flex-start' }}
          >
            {!chatMode && (
              <Fragment>
                <HeaderNav
                  to="/"
                  isHome
                  imgLabel="home"
                  isUsername={
                    pathname.split('/')[1] !== 'videos' &&
                    ['links', 'twinklexp'].indexOf(pathname.split('/')[1]) ===
                      -1 &&
                    pathname.length > 1
                  }
                >
                  <span>Home</span>
                </HeaderNav>
                <HeaderNav
                  to="/videos"
                  imgLabel="watch"
                  onClick={() => {
                    getInitialVideos()
                    getPinnedPlaylists()
                    getPlaylists()
                  }}
                >
                  <span>Watch</span>
                </HeaderNav>
                <HeaderNav to="/links" imgLabel="read">
                  <span>Read</span>
                </HeaderNav>
              </Fragment>
            )}
          </ul>
          {!chatMode && (
            <SearchBox style={{ width: '70%', marginLeft: '2rem' }} />
          )}
        </div>
        <div
          className="col-xs-2"
          style={{ display: 'flex', justifyContent: 'flex-end' }}
        >
          {loggedIn && (
            <ChatButton
              style={{ marginRight: '1rem' }}
              onClick={onChatButtonClick}
              chatMode={chatMode}
              loading={chatLoading}
              numUnreads={numChatUnreads}
            />
          )}
          {loggedIn ? (
            <AccountMenu title={username} logout={this.onLogout} />
          ) : (
            <Button
              className="btn btn-success"
              onClick={() => openSigninModal()}
            >
              Log In | Sign Up
            </Button>
          )}
        </div>
        {signinModalShown && (
          <SigninModal show onHide={() => closeSigninModal()} />
        )}
      </nav>
    )
  }

  getLogoColor = () => {
    return (function factory(string, c) {
      return (
        string[Math.floor(Math.random() * string.length)] +
        (c && factory(string, c - 1))
      )
    })('789ABCDEF', 4)
  }

  onLogoClick = () => {
    if (this.props.chatMode) {
      this.props.turnChatOff()
    }
  }

  onLogout = () => {
    const { logout, resetChat } = this.props
    recordUserAction({ action: 'logout' })
    logout()
    resetChat()
  }

  onSubjectChange = ({ subject }) => {
    const { notifyChatSubjectChange } = this.props
    notifyChatSubjectChange(subject)
  }
}

export default connect(
  state => ({
    loggedIn: state.UserReducer.loggedIn,
    username: state.UserReducer.username,
    userType: state.UserReducer.userType,
    isAdmin: state.UserReducer.isAdmin,
    userId: state.UserReducer.userId,
    signinModalShown: state.UserReducer.signinModalShown,
    numChatUnreads: state.ChatReducer.numUnreads,
    chatMode: state.ChatReducer.chatMode,
    versionMatch: state.NotiReducer.versionMatch
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
    notifyChatSubjectChange,
    checkVersion,
    resetChat
  }
)(withRouter(Header))
