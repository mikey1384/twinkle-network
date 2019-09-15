import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useScrollPosition } from 'helpers/hooks';
import Cover from './Cover';
import Body from './Body';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { css } from 'emotion';
import { connect } from 'react-redux';
import {
  changeProfileTheme,
  checkValidUsername
} from 'redux/actions/UserActions';
import { setTheme } from 'helpers/requestHelpers';
import { Context } from 'context';
import NotFound from 'components/NotFound';
import Loading from 'components/Loading';

Profile.propTypes = {
  changeProfileTheme: PropTypes.func.isRequired,
  checkValidUsername: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  userId: PropTypes.number,
  username: PropTypes.string
};

function Profile({
  changeProfileTheme,
  checkValidUsername,
  dispatch,
  history,
  location,
  match,
  profile,
  profile: { unavailable },
  userId,
  username
}) {
  const {
    view: {
      state: { scrollPositions },
      actions: { onRecordScrollPosition }
    }
  } = useContext(Context);
  const [selectedTheme, setSelectedTheme] = useState('logoBlue');
  const [loading, setLoading] = useState(false);
  useScrollPosition({
    scrollPositions,
    pathname: location.pathname,
    onRecordScrollPosition,
    currentSection: `/users/${username}`
  });

  useEffect(() => {
    if (history.action === 'PUSH' || !profile.id) {
      init();
    }
    async function init() {
      setLoading(true);
      await checkValidUsername(match.params.username);
      setLoading(false);
    }
  }, [match.params.username]);

  useEffect(() => {
    if (match.params.username === 'undefined' && userId && unavailable) {
      history.push(`/${username}`);
    }
    setSelectedTheme(profile?.profileTheme || 'logoBlue');
  }, [match.params.username, profile, userId]);

  return (
    <ErrorBoundary style={{ minHeight: '10rem' }}>
      {!unavailable ? (
        <>
          {loading && <Loading text="Loading Profile..." />}
          {!loading && profile.id && (
            <div
              className={css`
                a {
                  white-space: pre-wrap;
                  overflow-wrap: break-word;
                  word-break: break-word;
                }
              `}
              style={{
                position: 'relative'
              }}
            >
              <Cover
                profile={profile}
                onSelectTheme={theme => {
                  setSelectedTheme(theme);
                }}
                selectedTheme={selectedTheme}
                onSetTheme={onSetTheme}
              />
              <Body
                history={history}
                location={location}
                match={match}
                profile={profile}
                selectedTheme={selectedTheme}
              />
            </div>
          )}
        </>
      ) : (
        <NotFound
          title={!userId ? 'For Registered Users Only' : ''}
          text={!userId ? 'Please Log In or Sign Up' : ''}
        />
      )}
    </ErrorBoundary>
  );

  async function onSetTheme() {
    await setTheme({ color: selectedTheme, dispatch });
    changeProfileTheme(selectedTheme);
  }
}

export default connect(
  state => ({
    userId: state.UserReducer.userId,
    username: state.UserReducer.username,
    profile: state.UserReducer.profile
  }),
  dispatch => ({
    dispatch,
    changeProfileTheme: theme => dispatch(changeProfileTheme(theme)),
    checkValidUsername: username => dispatch(checkValidUsername(username))
  })
)(Profile);
