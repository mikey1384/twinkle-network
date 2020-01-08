import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Cover from './Cover';
import Body from './Body';
import ErrorBoundary from 'components/ErrorBoundary';
import { css } from 'emotion';
import { useAppContext, useContentContext, useProfileContext } from 'contexts';
import { useContentState, useMyState, useProfileState } from 'helpers/hooks';
import NotFound from 'components/NotFound';
import Loading from 'components/Loading';
import GoBack from 'components/GoBack';

Profile.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default function Profile({ history, location, match }) {
  const {
    requestHelpers: { loadProfileViaUsername, setTheme }
  } = useAppContext();
  const { userId, username } = useMyState();
  const {
    actions: { onChangeProfileTheme, onInitContent }
  } = useContentContext();
  const {
    actions: { onSetProfileId, onUserNotExist }
  } = useProfileContext();
  const [selectedTheme, setSelectedTheme] = useState('logoBlue');
  const [loading, setLoading] = useState(false);
  const { notExist, profileId } = useProfileState(match.params.username);
  const profile = useContentState({
    contentType: 'user',
    contentId: profileId
  });
  useEffect(() => {
    if (!notExist && !profile.loaded) {
      init();
    }
    async function init() {
      setLoading(true);
      try {
        const { pageNotExists, user } = await loadProfileViaUsername(
          match.params.username
        );
        if (pageNotExists) return onUserNotExist(match.params.username);
        onSetProfileId({ username: match.params.username, profileId: user.id });
        onInitContent({
          contentType: 'user',
          contentId: user.id,
          userId: user.id,
          username: match.params.username,
          ...user
        });
      } catch (error) {
        onUserNotExist(match.params.username);
      }
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.params.username, notExist, profile.loaded]);

  useEffect(() => {
    if (
      match.params.username === 'undefined' &&
      userId &&
      profile.unavailable
    ) {
      history.push(`/${username}`);
    }
    setSelectedTheme(profile?.profileTheme || 'logoBlue');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.params.username, profile, userId, username]);

  return (
    <ErrorBoundary style={{ minHeight: '10rem' }}>
      <GoBack isMobile to="/users" text="Users" />
      {!notExist ? (
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
