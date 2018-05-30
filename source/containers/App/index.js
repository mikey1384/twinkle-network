import 'regenerator-runtime/runtime'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import Header from './Header'
import { connect } from 'react-redux'
import { initChat, resetChat, turnChatOff } from 'redux/actions/ChatActions'
import { changePageVisibility } from 'redux/actions/ViewActions'
import {
  initSession,
  openSigninModal,
  closeSigninModal
} from 'redux/actions/UserActions'
import { addEvent } from 'helpers/listenerHelpers'
import { recordUserAction } from 'helpers/userDataHelpers'
import { siteContent } from './Styles'
import MobileMenu from './MobileMenu'
import { Color, mobileMaxWidth } from 'constants/css'
import { css } from 'emotion'
import Button from 'components/Button'
import SearchBox from './SearchBox'
import Loading from 'components/Loading'
import SigninModal from 'containers/Signin'
import loadable from 'loadable-components'
const Home = loadable(() => import('containers/Home'), {
  LoadingComponent: Loading
})
const Videos = loadable(() => import('containers/Videos'), {
  LoadingComponent: Loading
})
const Links = loadable(() => import('containers/Links'), {
  LoadingComponent: Loading
})
const Chat = loadable(() => import('containers/Chat'), {
  LoadingComponent: Loading
})
const ContentPage = loadable(() => import('containers/ContentPage'), {
  LoadingComponent: Loading
})
import Redirect from 'containers/Redirect'

let visibilityChange
let hidden

class App extends Component {
  static propTypes = {
    chatMode: PropTypes.bool,
    initSession: PropTypes.func,
    turnChatOff: PropTypes.func,
    chatNumUnreads: PropTypes.number,
    numNewNotis: PropTypes.number,
    numNewPosts: PropTypes.number,
    closeSigninModal: PropTypes.func,
    resetChat: PropTypes.func,
    loggedIn: PropTypes.bool,
    location: PropTypes.object,
    initChat: PropTypes.func,
    changePageVisibility: PropTypes.func,
    history: PropTypes.object,
    signinModalShown: PropTypes.bool,
    username: PropTypes.string
  }

  state = {
    chatLoading: false,
    scrollPosition: 0,
    updateNoticeShown: false,
    mobileMenuShown: false,
    navScrollPositions: {}
  }

  componentDidMount() {
    const { initSession, location, history } = this.props
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
    addEvent(document.getElementById('App'), 'scroll', this.onScroll)
    addEvent(document, visibilityChange, this.handleVisibilityChange)
    window.ga('send', 'pageview', location.pathname)
    history.listen(location => {
      window.ga('send', 'pageview', location.pathname)
    })
  }

  getSnapshotBeforeUpdate(prevProps) {
    if (!prevProps.chatMode && this.props.chatMode) {
      return { scrollPosition: document.getElementById('App').scrollTop }
    }
    if (prevProps.location.pathname !== this.props.location.pathname) {
      return {
        navScrollPosition: {
          [prevProps.location.pathname]: document.getElementById('App')
            .scrollTop
        }
      }
    }
    return {}
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      chatNumUnreads,
      numNewNotis,
      numNewPosts,
      history,
      location,
      loggedIn
    } = this.props
    const { navScrollPositions } = this.state
    const newNotiNum = numNewPosts + numNewNotis + chatNumUnreads

    if (snapshot.scrollPosition) {
      this.setState({ scrollPosition: snapshot.scrollPosition })
    }

    if (snapshot.navScrollPosition) {
      this.setState(state => ({
        navScrollPositions: {
          ...state.navScrollPositions,
          ...snapshot.navScrollPosition
        }
      }))
    }

    if (location !== prevProps.location) {
      if (history.action === 'PUSH') {
        if (loggedIn) {
          recordUserAction({ action: 'navigation', target: location.pathname })
        }
        document.getElementById('App').scrollTop = 0
      } else {
        document.getElementById('App').scrollTop =
          navScrollPositions[location.pathname]
      }
    }

    if (
      this.props.numNewPosts !== prevProps.numNewPosts ||
      this.props.chatNumUnreads !== prevProps.chatNumUnreads ||
      this.props.numNewNotis !== prevProps.numNewNotis
    ) {
      let title = `${newNotiNum > 0 ? '(' + newNotiNum + ') ' : ''}Twinkle`
      document.title = title
    }

    if (this.props.chatMode !== prevProps.chatMode) {
      let title = `${newNotiNum > 0 ? '(' + newNotiNum + ') ' : ''}Twinkle`
      document.title = title
    }
  }

  render() {
    const {
      chatMode,
      closeSigninModal,
      location,
      history,
      signinModalShown,
      turnChatOff,
      username,
      resetChat
    } = this.props
    const {
      chatLoading,
      mobileMenuShown,
      scrollPosition,
      updateNoticeShown
    } = this.state
    return (
      <div
        className={css`
          height: CALC(100% - 6rem);
          width: 100%;
          @media (max-width: ${mobileMaxWidth}) {
            height: ${chatMode ? 'CALC(100% - 8rem)' : 'auto'};
          }
        `}
      >
        {signinModalShown && <SigninModal show onHide={closeSigninModal} />}
        {mobileMenuShown && (
          <MobileMenu
            chatMode={chatMode}
            location={location}
            history={history}
            username={username}
            onClose={() => this.setState({ mobileMenuShown: false })}
          />
        )}
        {updateNoticeShown && (
          <div
            className={css`
              position: fixed;
              width: 80%;
              left: 10%;
              top: 2rem;
              z-index: 2000;
              background: ${Color.blue()};
              color: #fff;
              padding: 1rem;
              text-align: center;
              font-size: 2rem;
              display: flex;
              flex-direction: column;
              justify-content: center;
              @media (max-width: ${mobileMaxWidth}) {
                width: 100%;
                left: 0;
              }
            `}
          >
            <p>
              The website has been updated. Click the button below to apply the
              update.
            </p>
            <p style={{ fontSize: '1.2em' }}>
              {
                "Warning: Update is mandatory. Some features will not work properly if you don't update!"
              }
            </p>
            <Button
              gold
              filled
              style={{ marginTop: '3rem', width: '20%', alignSelf: 'center' }}
              onClick={() => window.location.reload()}
            >
              Update!
            </Button>
          </div>
        )}
        <Header
          chatMode={chatMode}
          chatLoading={chatLoading}
          onChatButtonClick={this.onChatButtonClick}
          turnChatOff={turnChatOff}
          showUpdateNotice={match =>
            this.setState({ updateNoticeShown: !match })
          }
          onMobileMenuOpen={() => this.setState({ mobileMenuShown: true })}
        />
        <div id="App" className={`${siteContent} ${chatMode && 'hidden'}`}>
          <SearchBox
            className="mobile"
            style={{
              zIndex: 1000,
              padding: '1rem 0'
            }}
          />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/questions" component={ContentPage} />
            <Route path="/comments" component={ContentPage} />
            <Route path="/discussions" component={ContentPage} />
            <Route path="/videos" component={Videos} />
            <Route path="/links" component={Links} />
            <Route path="/users" component={Home} />
            <Route path="/users/:username" component={Home} />
            <Route path="/:username" component={Redirect} />
          </Switch>
        </div>
        {chatMode &&
          this.props.loggedIn && (
            <Chat
              onUnmount={async() => {
                await resetChat()
                document.getElementById('App').scrollTop = scrollPosition
                turnChatOff()
              }}
            />
          )}
      </div>
    )
  }

  handleVisibilityChange = () => {
    const { changePageVisibility } = this.props
    changePageVisibility(!document[hidden])
  }

  onChatButtonClick = async() => {
    const { initChat, chatMode, turnChatOff } = this.props
    this.setState({ chatLoading: true })
    await (chatMode ? turnChatOff() : initChat())
    this.setState({ chatLoading: false })
  }
}

export default connect(
  state => ({
    loggedIn: state.UserReducer.loggedIn,
    numNewPosts: state.NotiReducer.numNewPosts,
    numNewNotis: state.NotiReducer.numNewNotis,
    chatMode: state.ChatReducer.chatMode,
    chatNumUnreads: state.ChatReducer.numUnreads,
    signinModalShown: state.UserReducer.signinModalShown,
    username: state.UserReducer.username
  }),
  {
    closeSigninModal,
    openSigninModal,
    initSession,
    turnChatOff,
    initChat,
    resetChat,
    changePageVisibility
  }
)(App)
