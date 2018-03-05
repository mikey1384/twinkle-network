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
import {
  checkVersion,
  notifyChatSubjectChange
} from 'redux/actions/NotiActions'
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
import { container } from './Styles'

class Header extends Component {
  static propTypes = {
    chatLoading: PropTypes.bool,
    chatMode: PropTypes.bool,
    checkVersion: PropTypes.func,
    closeSigninModal: PropTypes.func,
    getNumberOfUnreadMessages: PropTypes.func,
    increaseNumberOfUnreadMessages: PropTypes.func,
    location: PropTypes.object,
    loggedIn: PropTypes.bool,
    logout: PropTypes.func,
    notifyChatSubjectChange: PropTypes.func,
    numChatUnreads: PropTypes.number,
    onChatButtonClick: PropTypes.func,
    onMobileMenuOpen: PropTypes.func,
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
    logoBlue: Color.logoBlue(),
    logoGreen: Color.logoGreen(),
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
    const { userId } = this.props

    if (userId !== prevProps.userId) {
      if (prevProps.userId !== null) {
        socket.emit('leave_my_notification_channel', prevProps.userId)
      }
      socket.emit('enter_my_notification_channel', userId)
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
      onMobileMenuOpen,
      numChatUnreads,
      turnChatOff
    } = this.props

    const { logoBlue, logoGreen } = this.state
    return (
      <nav
        className={`${container} ${chatMode && 'header chat'}`}
        style={{
          position: 'fixed'
        }}
      >
        <div className="desktop logo">
          <Link
            style={{
              cursor: 'pointer',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
            to="/"
            onClick={this.onLogoClick}
          >
            <span style={{ color: logoBlue }}>Twin</span>
            <span style={{ color: logoGreen }}>kle</span>
          </Link>
        </div>
        <div className="main-tabs">
          <div
            className="nav navbar-nav"
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              width: '100%'
            }}
          >
            {!chatMode && (
              <Fragment>
                <HeaderNav
                  className={chatLoading ? 'hidden' : 'mobile'}
                  imgLabel="user"
                  onClick={onMobileMenuOpen}
                >
                  Menu
                </HeaderNav>
                <HeaderNav
                  to="/"
                  isHome
                  className={chatLoading ? 'desktop' : ''}
                  imgLabel="home"
                  isUsername={
                    pathname.split('/')[1] !== 'videos' &&
                    ['links', 'twinklexp'].indexOf(pathname.split('/')[1]) ===
                      -1 &&
                    pathname.length > 1
                  }
                >
                  Home
                </HeaderNav>
                <HeaderNav
                  to="/videos"
                  className={chatLoading ? 'desktop' : ''}
                  imgLabel="film"
                >
                  Watch
                </HeaderNav>
                <HeaderNav
                  to="/links"
                  className={chatLoading ? 'desktop' : ''}
                  imgLabel="book"
                >
                  Read
                </HeaderNav>
                <div
                  className={`header-nav ${chatLoading ? 'hidden' : 'mobile'}`}
                  onClick={onChatButtonClick}
                >
                  <a>
                    <span
                      className={`glyphicon glyphicon-comment mobile-no-hover ${numChatUnreads >
                        0 && 'new'}`}
                    />
                  </a>
                </div>
                <div
                  className={`header-nav ${chatLoading ? 'mobile' : 'hidden'}`}
                >
                  Loading...
                </div>
              </Fragment>
            )}
            {chatMode && (
              <div
                className="header-nav mobile"
                style={{ display: 'flex', alignItems: 'center' }}
                onClick={turnChatOff}
              >
                <div>
                  <span
                    style={{ marginTop: '1.5rem' }}
                    className="glyphicon glyphicon-remove"
                  />
                </div>
                <div style={{ marginLeft: '1rem' }}>Tap to close chat</div>
              </div>
            )}
          </div>
        </div>
        <div
          className="desktop"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '98%',
            marginLeft: '2%',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', width: '65%' }}>
            {!chatMode && <SearchBox style={{ width: '100%' }} />}
          </div>
          <div
            style={{
              display: 'flex',
              width: '35%',
              justifyContent: 'flex-end'
            }}
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
              <AccountMenu
                title={username}
                logout={this.onLogout}
              />
            ) : (
              <Button success onClick={() => openSigninModal()}>
                Log In | Sign Up
              </Button>
            )}
          </div>
        </div>
        {signinModalShown && (
          <SigninModal show onHide={() => closeSigninModal()} />
        )}
      </nav>
    )
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
    notifyChatSubjectChange,
    checkVersion,
    resetChat
  }
)(withRouter(Header))
