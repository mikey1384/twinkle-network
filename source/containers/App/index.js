import 'regenerator-runtime/runtime'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import Chat from '../Chat'
import Header from './Header'
import { connect } from 'react-redux'
import {
  initChatAsync,
  resetChat,
  turnChatOff
} from 'redux/actions/ChatActions'
import { changePageVisibility } from 'redux/actions/ViewActions'
import { initSessionAsync } from 'redux/actions/UserActions'
import { addEvent, removeEvent } from 'helpers/listenerHelpers'
import Home from 'containers/Home'
import ContentPage from 'containers/ContentPage'
import Videos from 'containers/Videos'
import Links from 'containers/Links'
import TwinkleXP from 'containers/TwinkleXP'
import Redirect from 'containers/Redirect'
import Button from 'components/Button'
import { recordUserAction } from 'helpers/userDataHelpers'
import {
  fetchNotifications,
  clearNotifications
} from 'redux/actions/NotiActions'

let visibilityChange
let hidden

class App extends Component {
  static propTypes = {
    chatMode: PropTypes.bool,
    initSession: PropTypes.func,
    turnChatOff: PropTypes.func,
    chatNumUnreads: PropTypes.number,
    clearNotifications: PropTypes.func,
    fetchNotifications: PropTypes.func,
    resetChat: PropTypes.func,
    loggedIn: PropTypes.bool,
    location: PropTypes.object,
    initChat: PropTypes.func,
    changePageVisibility: PropTypes.func,
    history: PropTypes.object
  }

  state = {
    chatLoading: false,
    scrollPosition: 0,
    updateNoticeShown: false,
    navScrollPositions: {}
  }

  componentDidMount() {
    const { initSession, location } = this.props
    if (typeof document.hidden !== 'undefined') {
      hidden = 'hidden'
      visibilityChange = 'visibilitychange'
    } else if (typeof document.msHidden !== 'undefined') {
      hidden = 'msHidden'
      visibilityChange = 'msvisibilitychange'
    } else if (typeof document.webkitHidden !== 'undefined') {
      hidden = 'webkitHidden'
      visibilityChange = 'webkitvisibilitychange'
    }
    initSession(location.pathname)
    addEvent(document.getElementById('react-view'), 'scroll', this.onScroll)
    addEvent(document, visibilityChange, this.handleVisibilityChange)
  }

  componentDidUpdate(prevProps) {
    let elements = document.documentElement.childNodes
    const {
      chatMode,
      chatNumUnreads,
      history,
      location,
      loggedIn,
      fetchNotifications,
      clearNotifications
    } = this.props

    const { navScrollPositions } = this.state

    if (prevProps.loggedIn !== loggedIn) {
      if (loggedIn) {
        fetchNotifications()
      } else {
        clearNotifications()
      }
    }

    if (location !== prevProps.location) {
      if (history.action === 'PUSH') {
        if (loggedIn) {
          recordUserAction({ action: 'navigation', target: location.pathname })
        }
        document.getElementById('react-view').scrollTop = 0
        const navScrollPosition = { [location.key]: 0 }
        this.setState(state => ({
          navScrollPositions: {
            ...state.navScrollPositions,
            ...navScrollPosition
          }
        }))
      } else {
        document.getElementById('react-view').scrollTop = navScrollPositions[location.key]
      }
    }

    if (this.props.chatNumUnreads !== prevProps.chatNumUnreads) {
      let title = `${
        chatNumUnreads > 0 ? '(' + chatNumUnreads + ') ' : ''
      }Twinkle`
      let display = chatMode ? 'none' : 'inline'
      document.title = title
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].tagName === 'GRAMMARLY-CARD') {
          elements[i].style.display = display
        }
      }
    }

    if (this.props.chatMode !== prevProps.chatMode) {
      let title = `${
        chatNumUnreads > 0 ? '(' + chatNumUnreads + ') ' : ''
      }Twinkle`
      let display = chatMode ? 'none' : 'inline'
      document.title = title
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].tagName === 'GRAMMARLY-CARD') {
          elements[i].style.display = display
        }
      }
    }
  }

  componentWillUnmount() {
    removeEvent(document.getElementById('react-view'), 'scroll', this.onScroll)
  }

  render() {
    const { chatMode, turnChatOff, resetChat, loggedIn } = this.props
    const { chatLoading, scrollPosition, updateNoticeShown } = this.state
    const style =
      chatMode && loggedIn
        ? {
            display: 'none'
          }
        : { paddingTop: '65px' }

    return (
      <div
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: chatMode && '#fff'
        }}
      >
        <Header
          staticTop={chatMode}
          chatMode={chatMode}
          chatLoading={chatLoading}
          onChatButtonClick={this.onChatButtonClick}
          turnChatOff={turnChatOff}
          showUpdateNotice={match =>
            this.setState({ updateNoticeShown: !match })
          }
        />
        <div
          style={{
            ...style,
            paddingBottom: '1rem'
          }}
        >
          {updateNoticeShown && (
            <div
              className="alert alert-info"
              style={{
                position: 'fixed',
                textAlign: 'center',
                width: '80%',
                left: '10%'
              }}
            >
              <p style={{ fontSize: '1.4em' }}>
                The website has been updated. Click the button below to apply
                the update.
              </p>
              <p style={{ fontSize: '1.2em' }}>
                {
                  "Warning: Update is mandatory. Some features will not work properly if you don't!"
                }
              </p>
              <Button
                className="btn btn-lg btn-success"
                style={{
                  marginTop: '1em',
                  fontSize: '1.5em'
                }}
                onClick={() => window.location.reload()}
              >
                Update!
              </Button>
            </div>
          )}
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/questions" component={ContentPage} />
            <Route path="/comments" component={ContentPage} />
            <Route path="/discussions" component={ContentPage} />
            <Route path="/videos" component={Videos} />
            <Route path="/links" component={Links} />
            <Route path="/users" component={Home} />
            <Route path="/twinklexp" component={TwinkleXP} />
            <Route path="/users/:username" component={Home} />
            <Route path="/:username" component={Redirect} />
          </Switch>
        </div>
        {chatMode &&
          this.props.loggedIn && (
            <Chat
              onUnmount={() =>
                resetChat().then(() => {
                  document.getElementById('react-view').scrollTop = scrollPosition
                  turnChatOff()
                })
              }
            />
          )}
      </div>
    )
  }

  handleVisibilityChange = () => {
    const { changePageVisibility } = this.props
    changePageVisibility(!document[hidden])
  }

  onChatButtonClick = () => {
    const { initChat, chatMode, turnChatOff } = this.props
    this.setState({ chatLoading: true })
    return (chatMode ? turnChatOff() : initChat()).then(() =>
      this.setState({ chatLoading: false })
    )
  }

  onScroll = event => {
    const { chatMode, location } = this.props
    if (!chatMode) {
      this.setState(state => ({
        scrollPosition: document.getElementById('react-view').scrollTop,
        navScrollPositions: {
          ...state.navScrollPositions,
          [location.key]: document.getElementById('react-view').scrollTop
        }
      }))
    }
  }
}

export default connect(
  state => ({
    loggedIn: state.UserReducer.loggedIn,
    chatMode: state.ChatReducer.chatMode,
    chatNumUnreads: state.ChatReducer.numUnreads
  }),
  {
    initSession: initSessionAsync,
    turnChatOff,
    fetchNotifications,
    clearNotifications,
    initChat: initChatAsync,
    resetChat,
    changePageVisibility
  }
)(App)
