import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import Link from 'components/Link'
import { logout } from 'redux/actions/UserActions'
import {
  getNumberOfUnreadMessages,
  increaseNumberOfUnreadMessages,
  turnChatOff,
  resetChat
} from 'redux/actions/ChatActions'
import {
  checkVersion,
  notifyChatSubjectChange,
  increaseNumNewPosts,
  increaseNumNewNotis
} from 'redux/actions/NotiActions'
import AccountMenu from './AccountMenu'
import ChatButton from './ChatButton'
import { GENERAL_CHAT_ID } from 'constants/database'
import SearchBox from '../SearchBox'
import HeaderNav from './HeaderNav'
import { Color } from 'constants/css'
import { socket } from 'constants/io'
import { recordUserAction } from 'helpers/userDataHelpers'
import { container } from './Styles'
import { css } from 'emotion'

class Header extends Component {
  static propTypes = {
    chatLoading: PropTypes.bool,
    chatMode: PropTypes.bool,
    checkVersion: PropTypes.func,
    getNumberOfUnreadMessages: PropTypes.func,
    increaseNumNewPosts: PropTypes.func,
    increaseNumNewNotis: PropTypes.func,
    increaseNumberOfUnreadMessages: PropTypes.func,
    location: PropTypes.object,
    loggedIn: PropTypes.bool,
    logout: PropTypes.func,
    notifyChatSubjectChange: PropTypes.func,
    numChatUnreads: PropTypes.number,
    numNewNotis: PropTypes.number,
    numNewPosts: PropTypes.number,
    onChatButtonClick: PropTypes.func,
    onMobileMenuOpen: PropTypes.func,
    resetChat: PropTypes.func,
    showUpdateNotice: PropTypes.func,
    style: PropTypes.object,
    totalRewardAmount: PropTypes.number,
    turnChatOff: PropTypes.func,
    userId: PropTypes.number,
    username: PropTypes.string,
    versionMatch: PropTypes.bool
  }

  state = {
    notificationsMenuShown: false,
    feedLoading: false,
    logoHovered: false
  }

  componentDidMount() {
    const {
      turnChatOff,
      increaseNumNewPosts,
      increaseNumNewNotis,
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
    socket.on('new_story_post', increaseNumNewPosts)
    socket.on('new_notification', increaseNumNewNotis)
  }

  componentDidUpdate(prevProps) {
    const {
      chatMode,
      userId,
      username,
      getNumberOfUnreadMessages,
      showUpdateNotice,
      versionMatch
    } = this.props
    if (userId && !prevProps.userId) {
      socket.connect()
      socket.emit('bind_uid_to_socket', userId, username)
    }
    if (!userId && prevProps.userId) {
      socket.disconnect()
    }
    if (userId && userId !== prevProps.userId) {
      getNumberOfUnreadMessages()
    }
    if (userId && chatMode !== prevProps.chatMode && chatMode === false) {
      getNumberOfUnreadMessages()
    }
    if (versionMatch !== prevProps.versionMatch) {
      showUpdateNotice(versionMatch)
    }
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
      loggedIn,
      username,
      chatMode,
      onChatButtonClick,
      onMobileMenuOpen,
      numChatUnreads,
      numNewNotis,
      numNewPosts,
      style = {},
      totalRewardAmount,
      turnChatOff
    } = this.props
    const { logoHovered } = this.state
    return (
      <nav
        className={`unselectable ${container} ${chatMode && 'header chat'}`}
        style={{
          position: chatMode ? 'relative' : 'fixed',
          ...style
        }}
      >
        <div
          className={`desktop ${css`
            position: relative;
            margin-left: 1rem;
            width: 12rem;
            height: 2rem;
            .logo-twin {
              color: ${logoHovered ? '#fff' : Color.logoBlue()};
            }
            .logo-kle {
              color: ${logoHovered ? '#fff' : Color.logoGreen()};
            }
          `}`}
        >
          <div
            className={css`
              font-size: 2rem;
              font-weight: bold;
              line-height: 1;
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              height: 100%;
              width: 100%;
              margin: 0;
              text-decoration: none;
              color: #fff;
              &:before,
              &:after {
                display: block;
                content: 'Twinkle';
                position: absolute;
                top: 0;
                left: 0;
                opacity: 0.8;
              }
              &:after {
                color: #0ff;
                z-index: -2;
              }
              &:before {
                color: #f0f;
                z-index: -1;
              }
              &:hover {
                &:before {
                  animation: glitch-left 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)
                    both infinite;
                }
                &:after {
                  animation: glitch-left-2 1s
                    cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse both infinite;
                }
              }
            }
            @keyframes glitch-left {
              0% {
                transform: translate(0);
              }
              33% {
                transform: translate(-5px, 3px);
              }
              66% {
                transform: translate(5px, -3px);
              }
              to {
                transform: translate(0);
              }
            }
            @keyframes glitch-left-2 {
              0% {
                transform: translate(0);
              }
              33% {
                transform: translate(-5px, -3px);
              }
              66% {
                transform: translate(5px, 2px);
              }
              to {
                transform: translate(0);
              }
            }`}
          >
            <Link
              style={{
                cursor: 'pointer',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
              to="/"
              onClick={this.onLogoClick}
            >
              <div
                onMouseEnter={() => this.setState({ logoHovered: true })}
                onMouseLeave={() => this.setState({ logoHovered: false })}
              >
                <span className="logo-twin">Twin</span>
                <span className="logo-kle">kle</span>
              </div>
            </Link>
          </div>
        </div>
        <div className="main-tabs">
          <div
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
                  alert={numNewNotis > 0 || totalRewardAmount > 0}
                  alertColor={Color.pink()}
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
                  alert={numNewPosts > 0}
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
                      className="glyphicon glyphicon-comment mobile-no-hover"
                      style={{ color: numChatUnreads > 0 && Color.pink() }}
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
            <ChatButton
              style={{ marginRight: '1rem' }}
              onClick={onChatButtonClick}
              chatMode={chatMode}
              loading={chatLoading}
              numUnreads={numChatUnreads}
            />
            {loggedIn && (
              <AccountMenu title={username} logout={this.onLogout} />
            )}
          </div>
        </div>
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
    userId: state.UserReducer.userId,
    numNewNotis: state.NotiReducer.numNewNotis,
    numNewPosts: state.NotiReducer.numNewPosts,
    numChatUnreads: state.ChatReducer.numUnreads,
    chatMode: state.ChatReducer.chatMode,
    totalRewardAmount: state.NotiReducer.totalRewardAmount,
    versionMatch: state.NotiReducer.versionMatch
  }),
  {
    logout,
    turnChatOff,
    getNumberOfUnreadMessages,
    increaseNumNewPosts,
    increaseNumNewNotis,
    increaseNumberOfUnreadMessages,
    notifyChatSubjectChange,
    checkVersion,
    resetChat
  }
)(withRouter(Header))
