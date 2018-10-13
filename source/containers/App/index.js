import 'regenerator-runtime/runtime'; // for async await
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from './Header';
import { connect } from 'react-redux';
import { initChat, resetChat, turnChatOff } from 'redux/actions/ChatActions';
import { loadChat } from 'helpers/requestHelpers';
import {
  changePageVisibility,
  enableAutoscroll
} from 'redux/actions/ViewActions';
import {
  initSession,
  openSigninModal,
  closeSigninModal
} from 'redux/actions/UserActions';
import { addEvent } from 'helpers/listenerHelpers';
import { recordUserAction } from 'helpers/userDataHelpers';
import { siteContent } from './Styles';
import MobileMenu from './MobileMenu';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import Button from 'components/Button';
import Loading from 'components/Loading';
import SigninModal from 'containers/Signin';
import loadable from 'loadable-components';
import { hot } from 'react-hot-loader';
const Home = loadable(() => import('containers/Home'), {
  LoadingComponent: Loading
});
const Videos = loadable(() => import('containers/Videos'), {
  LoadingComponent: Loading
});
const Links = loadable(() => import('containers/Links'), {
  LoadingComponent: Loading
});
const Chat = loadable(() => import('containers/Chat'), {
  LoadingComponent: Loading
});
const ContentPage = loadable(() => import('containers/ContentPage'), {
  LoadingComponent: Loading
});
const PlaylistPage = loadable(() => import('containers/PlaylistPage'), {
  loadingComponent: Loading
});
const SearchPage = loadable(() => import('containers/SearchPage'), {
  LoadingComponent: Loading
});
import Redirect from 'containers/Redirect';

let visibilityChange;
let hidden;

class App extends Component {
  static propTypes = {
    autoscrollDisabled: PropTypes.bool.isRequired,
    chatMode: PropTypes.bool,
    changePageVisibility: PropTypes.func.isRequired,
    chatNumUnreads: PropTypes.number,
    closeSigninModal: PropTypes.func.isRequired,
    enableAutoscroll: PropTypes.func.isRequired,
    history: PropTypes.object,
    initChat: PropTypes.func.isRequired,
    initSession: PropTypes.func.isRequired,
    location: PropTypes.object,
    loggedIn: PropTypes.bool,
    numNewNotis: PropTypes.number,
    numNewPosts: PropTypes.number,
    resetChat: PropTypes.func.isRequired,
    searchMode: PropTypes.bool,
    searchText: PropTypes.string,
    signinModalShown: PropTypes.bool,
    turnChatOff: PropTypes.func.isRequired,
    username: PropTypes.string
  };

  state = {
    chatLoading: false,
    scrollPosition: 0,
    updateNoticeShown: false,
    mobileMenuShown: false,
    navScrollPositions: {}
  };

  body =
    typeof document !== 'undefined'
      ? document.scrollingElement || document.documentElement
      : {};

  componentDidMount() {
    const { initSession, location, history } = this.props;
    if (typeof document.hidden !== 'undefined') {
      hidden = 'hidden';
      visibilityChange = 'visibilitychange';
    } else if (typeof document.msHidden !== 'undefined') {
      hidden = 'msHidden';
      visibilityChange = 'msvisibilitychange';
    } else if (typeof document.webkitHidden !== 'undefined') {
      hidden = 'webkitHidden';
      visibilityChange = 'webkitvisibilitychange';
    }
    initSession(location.pathname);
    addEvent(document, visibilityChange, this.handleVisibilityChange);
    window.ga('send', 'pageview', location.pathname);
    history.listen(location => {
      window.ga('send', 'pageview', location.pathname);
    });
  }

  getSnapshotBeforeUpdate(prevProps) {
    if (
      (!this.props.searchMode && !prevProps.chatMode && this.props.chatMode) ||
      (!prevProps.searchMode && this.props.searchMode)
    ) {
      return {
        scrollPosition: this.body.scrollTop
      };
    }
    if (prevProps.location.pathname !== this.props.location.pathname) {
      return {
        navScrollPosition: {
          [prevProps.location.pathname]: document.getElementById('App')
            .scrollTop
        }
      };
    }
    return {};
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      autoscrollDisabled,
      chatNumUnreads,
      enableAutoscroll,
      numNewNotis,
      numNewPosts,
      history,
      location,
      loggedIn
    } = this.props;
    const { navScrollPositions, scrollPosition } = this.state;
    const newNotiNum = numNewPosts + numNewNotis + chatNumUnreads;

    if (snapshot.navScrollPosition) {
      this.setState(state => ({
        navScrollPositions: {
          ...state.navScrollPositions,
          ...snapshot.navScrollPosition
        }
      }));
    }

    if (snapshot.scrollPosition) {
      this.setState(state => ({
        scrollPosition: snapshot.scrollPosition
      }));
    }

    if (prevProps.searchMode && !this.props.searchMode) {
      if (location !== prevProps.location) {
        this.setState({ scrollPosition: 0 });
      } else {
        this.body.scrollTop = scrollPosition;
      }
    }

    if (location !== prevProps.location) {
      if (history.action === 'PUSH') {
        if (loggedIn) {
          recordUserAction({ action: 'navigation', target: location.pathname });
        }
        if (autoscrollDisabled) {
          enableAutoscroll();
        } else {
          this.body.scrollTop = 0;
          document.getElementById('App').scrollTop = 0;
        }
      } else {
        document.getElementById('App').scrollTop =
          navScrollPositions[location.pathname];
      }
    }

    if (
      this.props.numNewPosts !== prevProps.numNewPosts ||
      this.props.chatNumUnreads !== prevProps.chatNumUnreads ||
      this.props.numNewNotis !== prevProps.numNewNotis
    ) {
      document.title = `${
        newNotiNum > 0 ? '(' + newNotiNum + ') ' : ''
      }Twinkle`;
    }

    if (this.props.chatMode !== prevProps.chatMode) {
      document.title = `${
        newNotiNum > 0 ? '(' + newNotiNum + ') ' : ''
      }Twinkle`;
    }
  }

  render() {
    const {
      chatMode,
      closeSigninModal,
      location,
      history,
      searchMode,
      signinModalShown,
      searchText,
      turnChatOff,
      username,
      resetChat
    } = this.props;
    const {
      chatLoading,
      mobileMenuShown,
      scrollPosition,
      updateNoticeShown
    } = this.state;
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
            <p style={{ fontSize: '1.3em' }}>
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
          searchBoxRef={ref => (this.SearchBox = ref)}
          showUpdateNotice={match =>
            this.setState({ updateNoticeShown: !match })
          }
          onMobileMenuOpen={() => this.setState({ mobileMenuShown: true })}
        />
        {searchMode && (
          <div
            className={`${css`
              margin-top: 6rem;
              @media (max-width: ${mobileMaxWidth}) {
                margin-top: 0;
              }
            `} ${chatMode ? 'hidden' : ''}`}
          >
            <SearchPage
              searchText={searchText}
              onSearchBoxFocus={
                this.SearchBox ? () => this.SearchBox.focus() : () => {}
              }
            />
          </div>
        )}
        <div
          id="App"
          className={`${siteContent} ${(chatMode || searchMode) && 'hidden'}`}
        >
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/questions" component={ContentPage} />
            <Route path="/comments" component={ContentPage} />
            <Route path="/discussions" component={ContentPage} />
            <Route path="/playlists" component={PlaylistPage} />
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
                await resetChat();
                this.body.scrollTop = scrollPosition;
                turnChatOff();
              }}
            />
          )}
      </div>
    );
  }

  handleVisibilityChange = () => {
    const { changePageVisibility } = this.props;
    changePageVisibility(!document[hidden]);
  };

  onChatButtonClick = async() => {
    const { chatMode, turnChatOff } = this.props;
    this.setState({ chatLoading: true });
    await (chatMode ? turnChatOff() : this.initChat());
    this.setState({ chatLoading: false });
  };

  initChat = async() => {
    const { dispatch, initChat } = this.props;
    const data = await loadChat({ dispatch });
    initChat(data);
  };
}

export default connect(
  state => ({
    autoscrollDisabled: state.ViewReducer.autoscrollDisabled,
    loggedIn: state.UserReducer.loggedIn,
    numNewPosts: state.NotiReducer.numNewPosts,
    numNewNotis: state.NotiReducer.numNewNotis,
    chatMode: state.ChatReducer.chatMode,
    chatNumUnreads: state.ChatReducer.numUnreads,
    searchMode: state.SearchReducer.searchMode,
    searchText: state.SearchReducer.searchText,
    signinModalShown: state.UserReducer.signinModalShown,
    username: state.UserReducer.username
  }),
  dispatch => ({
    dispatch,
    closeSigninModal: () => dispatch(closeSigninModal()),
    enableAutoscroll: () => dispatch(enableAutoscroll()),
    openSigninModal: () => dispatch(openSigninModal()),
    initSession: pathname => dispatch(initSession(pathname)),
    turnChatOff: () => dispatch(turnChatOff()),
    initChat: data => dispatch(initChat(data)),
    resetChat: () => dispatch(resetChat()),
    changePageVisibility: visible => dispatch(changePageVisibility(visible))
  })
)(hot(module)(App));
