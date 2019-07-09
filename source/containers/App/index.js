import 'regenerator-runtime/runtime'; // for async await
import React, { Suspense, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Button from 'components/Button';
import Loading from 'components/Loading';
import SigninModal from 'containers/Signin';
import MobileMenu from './MobileMenu';
import withScroll from 'components/Wrappers/withScroll';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  initChat,
  postFileUploadStatus,
  postUploadComplete,
  resetChat,
  turnChatOff,
  updateClientToApiServerProgress
} from 'redux/actions/ChatActions';
import { loadChat, uploadFileOnChat } from 'helpers/requestHelpers';
import { changePageVisibility } from 'redux/actions/ViewActions';
import {
  initSession,
  openSigninModal,
  closeSigninModal
} from 'redux/actions/UserActions';
import { addEvent, removeEvent } from 'helpers/listenerHelpers';
import { siteContent } from './Styles';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import { hot } from 'react-hot-loader';
import Profile from 'containers/Profile';

const Home = React.lazy(() => import('containers/Home'));
const Privacy = React.lazy(() => import('containers/Privacy'));
const Redirect = React.lazy(() => import('containers/Redirect'));
const SearchPage = React.lazy(() => import('containers/SearchPage'));
const WorkSection = React.lazy(() => import('containers/WorkSection'));
const PlaylistPage = React.lazy(() => import('containers/PlaylistPage'));
const ContentPage = React.lazy(() => import('containers/ContentPage'));
const VideoPage = React.lazy(() => import('containers/VideoPage'));
const LinkPage = React.lazy(() => import('containers/LinkPage'));
const Verify = React.lazy(() => import('containers/Verify'));
const Chat = React.lazy(() => import('containers/Chat'));

App.propTypes = {
  changePageVisibility: PropTypes.func.isRequired,
  chatMode: PropTypes.bool,
  chatNumUnreads: PropTypes.number,
  closeSigninModal: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object,
  initChat: PropTypes.func.isRequired,
  initSession: PropTypes.func.isRequired,
  location: PropTypes.object,
  loggedIn: PropTypes.bool,
  numNewNotis: PropTypes.number,
  numNewPosts: PropTypes.number,
  postFileUploadStatus: PropTypes.func.isRequired,
  postUploadComplete: PropTypes.func.isRequired,
  resetChat: PropTypes.func.isRequired,
  searchMode: PropTypes.bool,
  searchText: PropTypes.string,
  signinModalShown: PropTypes.bool,
  turnChatOff: PropTypes.func.isRequired,
  updateClientToApiServerProgress: PropTypes.func.isRequired,
  updateDetail: PropTypes.string,
  username: PropTypes.string
};

function App({
  changePageVisibility,
  chatMode,
  chatNumUnreads,
  closeSigninModal,
  dispatch,
  initChat,
  initSession,
  location,
  loggedIn,
  numNewNotis,
  numNewPosts,
  history,
  postFileUploadStatus,
  postUploadComplete,
  resetChat,
  searchMode,
  searchText,
  signinModalShown,
  turnChatOff,
  updateClientToApiServerProgress,
  updateDetail,
  username
}) {
  const [chatLoading, setChatLoading] = useState(false);
  const [updateNoticeShown, setUpdateNoticeShown] = useState(false);
  const [mobileMenuShown, setMobileMenuShown] = useState(false);
  const SearchBoxRef = useRef(null);
  const visibilityChangeRef = useRef(null);
  const hiddenRef = useRef(null);

  useEffect(() => {
    initSession(location.pathname);
    window.ga('send', 'pageview', location.pathname);
    history.listen(location => {
      window.ga('send', 'pageview', location.pathname);
    });
  }, []);

  useEffect(() => {
    if (typeof document.hidden !== 'undefined') {
      hiddenRef.current = 'hidden';
      visibilityChangeRef.current = 'visibilitychange';
    } else if (typeof document.msHidden !== 'undefined') {
      hiddenRef.current = 'msHidden';
      visibilityChangeRef.current = 'msvisibilitychange';
    } else if (typeof document.webkitHidden !== 'undefined') {
      hiddenRef.current = 'webkitHidden';
      visibilityChangeRef.current = 'webkitvisibilitychange';
    }
    addEvent(document, visibilityChangeRef.current, handleVisibilityChange);
    function handleVisibilityChange() {
      changePageVisibility(!document[hiddenRef.current]);
    }
    return function cleanUp() {
      removeEvent(
        document,
        visibilityChangeRef.current,
        handleVisibilityChange
      );
    };
  });

  useEffect(() => {
    const newNotiNum = numNewPosts + numNewNotis + chatNumUnreads;
    document.title = `${newNotiNum > 0 ? '(' + newNotiNum + ') ' : ''}Twinkle`;
  }, [numNewNotis, numNewPosts, chatMode, chatNumUnreads]);

  return (
    <div
      className={css`
        height: CALC(100% - 5rem);
        width: 100%;
        @media (max-width: ${mobileMaxWidth}) {
          height: ${chatMode ? 'CALC(100% - 8rem)' : 'auto'};
        }
      `}
    >
      {mobileMenuShown && (
        <MobileMenu
          chatMode={chatMode}
          location={location}
          history={history}
          username={username}
          onClose={() => setMobileMenuShown(false)}
        />
      )}
      {updateNoticeShown && (
        <div
          className={css`
            position: fixed;
            width: 80%;
            left: 10%;
            top: 2rem;
            z-index: 100000;
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
          {updateDetail && (
            <p style={{ color: Color.gold() }}>{updateDetail}</p>
          )}
          <Button
            color="gold"
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
        history={history}
        onChatButtonClick={onChatButtonClick}
        turnChatOff={turnChatOff}
        searchBoxRef={SearchBoxRef}
        showUpdateNotice={match => setUpdateNoticeShown(!match)}
        onMobileMenuOpen={() => setMobileMenuShown(true)}
      />
      <div
        id="App"
        className={`${siteContent} ${(chatMode || searchMode) && 'hidden'}`}
      >
        <Suspense fallback={<Loading />}>
          <Switch>
            <Route
              path="/users/:username"
              render={({ history, location, match }) => (
                <Profile history={history} location={location} match={match} />
              )}
            />
            <Route path="/subjects" component={ContentPage} />
            <Route path="/comments" component={ContentPage} />
            <Route path="/videos/:videoId" component={VideoPage} />
            <Route path="/videos" component={WorkSection} />
            <Route path="/links/:linkId" component={LinkPage} />
            <Route path="/links" component={WorkSection} />
            <Route path="/featured" component={WorkSection} />
            <Route path="/playlists" component={PlaylistPage} />
            <Route path="/verify" component={Verify} />
            <Route path="/privacy" component={Privacy} />
            <Route
              exact
              path="/"
              render={({ history, location }) => (
                <Home history={history} location={location} />
              )}
            />
            <Route
              exact
              path="/users/"
              render={({ history, location }) => (
                <Home history={history} location={location} />
              )}
            />
            <Route path="/:username" component={Redirect} />
          </Switch>
        </Suspense>
      </div>
      <Suspense fallback={<Loading />}>
        {searchMode && (
          <div
            className={`${css`
              margin-top: 5rem;
              @media (max-width: ${mobileMaxWidth}) {
                margin-top: 0;
              }
            `} ${chatMode ? 'hidden' : ''}`}
          >
            <SearchPage
              searchText={searchText}
              onSearchBoxFocus={() => SearchBoxRef.current.focus()}
            />
          </div>
        )}
        {chatMode && loggedIn && (
          <Chat onFileUpload={handleFileUpload} onUnmount={handleChatUnmount} />
        )}
        {signinModalShown && <SigninModal show onHide={closeSigninModal} />}
      </Suspense>
    </div>
  );

  async function handleFileUpload({
    channelId,
    content,
    fileName,
    filePath,
    fileToUpload
  }) {
    postFileUploadStatus({
      channelId,
      content,
      fileName,
      filePath,
      fileToUpload
    });
    const { messageId } = await uploadFileOnChat({
      channelId,
      content,
      dispatch,
      selectedFile: fileToUpload,
      onUploadProgress: handleUploadProgress,
      path: filePath
    });
    postUploadComplete({
      path: filePath,
      channelId,
      messageId,
      result: !!messageId
    });
    function handleUploadProgress({ loaded, total }) {
      updateClientToApiServerProgress({
        channelId,
        path: filePath,
        progress: loaded / total
      });
    }
  }

  async function onChatButtonClick() {
    setChatLoading(true);
    try {
      await (chatMode ? turnChatOff() : handleInitChat());
    } catch (error) {
      setChatLoading(false);
    }
    setChatLoading(false);
  }

  async function handleChatUnmount() {
    await resetChat();
    turnChatOff();
  }

  async function handleInitChat() {
    const data = await loadChat({ dispatch });
    initChat(data);
  }
}

export default connect(
  state => ({
    loggedIn: state.UserReducer.loggedIn,
    numNewPosts: state.NotiReducer.numNewPosts,
    numNewNotis: state.NotiReducer.numNewNotis,
    chatMode: state.ChatReducer.chatMode,
    chatNumUnreads: state.ChatReducer.numUnreads,
    searchMode: state.SearchReducer.searchMode,
    searchText: state.SearchReducer.searchText,
    signinModalShown: state.UserReducer.signinModalShown,
    updateDetail: state.NotiReducer.updateDetail,
    username: state.UserReducer.username
  }),
  dispatch => ({
    dispatch,
    closeSigninModal: () => dispatch(closeSigninModal()),
    openSigninModal: () => dispatch(openSigninModal()),
    initSession: pathname => dispatch(initSession(pathname)),
    turnChatOff: () => dispatch(turnChatOff()),
    initChat: data => dispatch(initChat(data)),
    postFileUploadStatus: params => dispatch(postFileUploadStatus(params)),
    postUploadComplete: params => dispatch(postUploadComplete(params)),
    resetChat: () => dispatch(resetChat()),
    updateClientToApiServerProgress: params =>
      dispatch(updateClientToApiServerProgress(params)),
    changePageVisibility: visible => dispatch(changePageVisibility(visible))
  })
)(
  process.env.NODE_ENV === 'development'
    ? hot(module)(withScroll(App))
    : withScroll(App)
);
