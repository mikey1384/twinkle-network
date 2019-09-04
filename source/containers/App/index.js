import 'regenerator-runtime/runtime'; // for async await
import React, { Suspense, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Button from 'components/Button';
import Loading from 'components/Loading';
import SigninModal from 'containers/Signin';
import MobileMenu from './MobileMenu';
import Profile from 'containers/Profile';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  initChat,
  postFileUploadStatus,
  postUploadComplete,
  sendFirstDirectMessage,
  updateClientToApiServerProgress
} from 'redux/actions/ChatActions';
import {
  changePageVisibility,
  recordScrollPosition
} from 'redux/actions/ViewActions';
import { auth, uploadFileOnChat } from 'helpers/requestHelpers';
import {
  initSession,
  openSigninModal,
  closeSigninModal,
  logout
} from 'redux/actions/UserActions';
import { addEvent, removeEvent } from 'helpers/listenerHelpers';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import { hot } from 'react-hot-loader';
import { socket } from 'constants/io';

const Home = React.lazy(() => import('containers/Home'));
const Privacy = React.lazy(() => import('containers/Privacy'));
const Redirect = React.lazy(() => import('containers/Redirect'));
const Explore = React.lazy(() => import('containers/Explore'));
const PlaylistPage = React.lazy(() => import('containers/PlaylistPage'));
const ContentPage = React.lazy(() => import('containers/ContentPage'));
const VideoPage = React.lazy(() => import('containers/VideoPage'));
const LinkPage = React.lazy(() => import('containers/LinkPage'));
const Verify = React.lazy(() => import('containers/Verify'));
const Chat = React.lazy(() => import('containers/Chat'));

App.propTypes = {
  changePageVisibility: PropTypes.func.isRequired,
  closeSigninModal: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object,
  initSession: PropTypes.func.isRequired,
  location: PropTypes.object,
  logout: PropTypes.func.isRequired,
  pageVisible: PropTypes.bool,
  postFileUploadStatus: PropTypes.func.isRequired,
  postUploadComplete: PropTypes.func.isRequired,
  sendFirstDirectMessage: PropTypes.func.isRequired,
  signinModalShown: PropTypes.bool,
  updateClientToApiServerProgress: PropTypes.func.isRequired,
  updateDetail: PropTypes.string,
  username: PropTypes.string
};

function App({
  changePageVisibility,
  closeSigninModal,
  dispatch,
  initSession,
  location,
  history,
  logout,
  pageVisible,
  postFileUploadStatus,
  postUploadComplete,
  signinModalShown,
  sendFirstDirectMessage,
  updateClientToApiServerProgress,
  updateDetail,
  username
}) {
  const [updateNoticeShown, setUpdateNoticeShown] = useState(false);
  const [mobileMenuShown, setMobileMenuShown] = useState(false);
  const visibilityChangeRef = useRef(null);
  const hiddenRef = useRef(null);
  const authRef = useRef(null);

  useEffect(() => {
    changePageVisibility(true);
  }, []);

  useEffect(() => {
    if (!auth()?.headers?.authorization) {
      logout();
    } else if (
      authRef.current?.headers?.authorization !== auth()?.headers?.authorization
    ) {
      initSession(location.pathname);
    }
    window.ga('send', 'pageview', location.pathname);
    history.listen(location => {
      window.ga('send', 'pageview', location.pathname);
    });
    authRef.current = auth();
  }, [pageVisible]);

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

  return (
    <div
      className={css`
        height: CALC(100% - 4.5rem);
        width: 100%;
        @media (max-width: ${mobileMaxWidth}) {
          height: auto;
        }
      `}
    >
      {mobileMenuShown && (
        <MobileMenu
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
        history={history}
        showUpdateNotice={match => setUpdateNoticeShown(!match)}
        onMobileMenuOpen={() => setMobileMenuShown(true)}
      />
      <div
        id="App"
        className={css`
          margin-top: 4.5rem;
          height: 100%;
          @media (max-width: ${mobileMaxWidth}) {
            margin-top: 0;
            padding-top: 0;
            padding-bottom: 9rem;
          }
        `}
      >
        <Suspense fallback={<Loading />}>
          <Switch>
            <Route
              path="/users/:username"
              render={({ history, location, match }) => (
                <Profile history={history} location={location} match={match} />
              )}
            />
            <Route path="/comments/:contentId" component={ContentPage} />
            <Route path="/videos/:videoId" component={VideoPage} />
            <Route path="/videos" component={Explore} />
            <Route path="/links/:linkId" component={LinkPage} />
            <Route path="/links" component={Explore} />
            <Route path="/subjects/:contentId" component={ContentPage} />
            <Route path="/subjects" component={Explore} />
            <Route path="/playlists" component={PlaylistPage} />
            <Route
              path="/talk"
              component={() => <Chat onFileUpload={handleFileUpload} />}
            />
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
        {signinModalShown && <SigninModal show onHide={closeSigninModal} />}
      </Suspense>
    </div>
  );

  async function handleFileUpload({
    channelId,
    content,
    fileName,
    filePath,
    fileToUpload,
    recepientId,
    subjectId
  }) {
    postFileUploadStatus({
      channelId,
      content,
      fileName,
      filePath,
      fileToUpload,
      recepientId
    });
    const { messageId, members, message } = await uploadFileOnChat({
      channelId,
      content,
      dispatch,
      selectedFile: fileToUpload,
      onUploadProgress: handleUploadProgress,
      recepientId,
      path: filePath,
      subjectId
    });
    if (members) {
      sendFirstDirectMessage({ members, message });
      socket.emit('join_chat_channel', message.channelId);
      socket.emit('send_bi_chat_invitation', recepientId, message);
    }
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
}

export default connect(
  state => ({
    pageVisible: state.ViewReducer.pageVisible,
    scrollPositions: state.ViewReducer.scrollPositions,
    signinModalShown: state.UserReducer.signinModalShown,
    updateDetail: state.NotiReducer.updateDetail,
    username: state.UserReducer.username
  }),
  dispatch => ({
    dispatch,
    closeSigninModal: () => dispatch(closeSigninModal()),
    openSigninModal: () => dispatch(openSigninModal()),
    initSession: pathname => dispatch(initSession(pathname)),
    initChat: data => dispatch(initChat(data)),
    logout: () => dispatch(logout()),
    postFileUploadStatus: params => dispatch(postFileUploadStatus(params)),
    postUploadComplete: params => dispatch(postUploadComplete(params)),
    sendFirstDirectMessage: params => dispatch(sendFirstDirectMessage(params)),
    updateClientToApiServerProgress: params =>
      dispatch(updateClientToApiServerProgress(params)),
    changePageVisibility: visible => dispatch(changePageVisibility(visible)),
    recordScrollPosition: params => dispatch(recordScrollPosition(params))
  })
)(process.env.NODE_ENV === 'development' ? hot(module)(App) : App);
