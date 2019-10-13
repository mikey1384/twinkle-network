import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Cover from './Cover';
import Body from './Body';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { css } from 'emotion';
import { useAppContext } from 'contexts';
import NotFound from 'components/NotFound';
import Loading from 'components/Loading';

Profile.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default function Profile({ history, location, match }) {
  const {
    user: {
      state: { userId, username, profile },
      actions: { onChangeProfileTheme, onShowProfile, onUserNotExist }
    },
    requestHelpers: { loadProfileViaUsername, setTheme }
  } = useAppContext();
  const [selectedTheme, setSelectedTheme] = useState('logoBlue');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!profile.id || profile.username !== match.params.username) {
      init();
    }
    async function init() {
      setLoading(true);
      try {
        const { pageNotExists, user } = await loadProfileViaUsername(
          match.params.username
        );
        if (pageNotExists) return onUserNotExist();
        onShowProfile(user);
      } catch (error) {
        onUserNotExist();
      }
      setLoading(false);
    }
  }, [match.params.username]);

  useEffect(() => {
    if (
      match.params.username === 'undefined' &&
      userId &&
      profile.unavailable
    ) {
      history.push(`/${username}`);
    }
    setSelectedTheme(profile?.profileTheme || 'logoBlue');
  }, [match.params.username, profile, userId]);

  return (
    <ErrorBoundary style={{ minHeight: '10rem' }}>
      {!profile.unavailable ? (
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
    await setTheme({ color: selectedTheme });
    onChangeProfileTheme({ userId, theme: selectedTheme });
  }
}
