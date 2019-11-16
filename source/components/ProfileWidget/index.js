import React, { useMemo, Suspense, useRef } from 'react';
import PropTypes from 'prop-types';
import ProfilePic from 'components/ProfilePic';
import Button from 'components/Button';
import ErrorBoundary from 'components/ErrorBoundary';
import Loading from 'components/Loading';
import { container } from './Styles';
import { borderRadius } from 'constants/css';
import { css } from 'emotion';
import { useMyState } from 'helpers/hooks';
import { useAppContext } from 'contexts';
const WelcomeMessage = React.lazy(() => import('./WelcomeMessage'));

ProfileWidget.propTypes = {
  history: PropTypes.object,
  onLoadImage: PropTypes.func,
  onShowAlert: PropTypes.func
};

export default function ProfileWidget({ history, onLoadImage, onShowAlert }) {
  const {
    user: {
      actions: { onOpenSigninModal }
    }
  } = useAppContext();
  const { profilePicId, realName, userId, username } = useMyState();
  const FileInputRef = useRef(null);
  return useMemo(
    () => (
      <ErrorBoundary>
        <div className={container} style={{ cursor: 'pointer' }}>
          {username && (
            <div
              className="heading"
              onClick={() =>
                username ? history.push(`/users/${username}`) : null
              }
            >
              <ProfilePic
                className="widget__profile-pic"
                style={{
                  cursor: userId ? 'pointer' : 'default'
                }}
                userId={userId}
                profilePicId={profilePicId}
                onClick={() => {
                  if (userId) history.push(`/users/${username}`);
                }}
              />
              <div className="names">
                <a>{username}</a>
                {realName && (
                  <div>
                    <span>({realName})</span>
                  </div>
                )}
              </div>
            </div>
          )}
          <div
            className={`details ${css`
              border-top-right-radius: ${username ? '' : borderRadius};
              border-top-left-radius: ${username ? '' : borderRadius};
            `}`}
          >
            {userId && (
              <div>
                <Button
                  style={{ width: '100%' }}
                  transparent
                  onClick={() => history.push(`/users/${username}`)}
                >
                  View Profile
                </Button>
                <Button
                  style={{ width: '100%' }}
                  transparent
                  onClick={() => FileInputRef.current.click()}
                >
                  Change Picture
                </Button>
              </div>
            )}
            <Suspense
              fallback={
                <Loading
                  innerStyle={{ fontSize: '2rem' }}
                  text="Loading Twinkle Network"
                />
              }
            >
              <WelcomeMessage
                userId={userId}
                openSigninModal={onOpenSigninModal}
              />
            </Suspense>

            <input
              ref={FileInputRef}
              style={{ display: 'none' }}
              type="file"
              onChange={handlePicture}
              accept="image/*"
            />
          </div>
        </div>
      </ErrorBoundary>
    ),
    [profilePicId, realName, userId, username]
  );

  function handlePicture(event) {
    const reader = new FileReader();
    const maxSize = 5000;
    const file = event.target.files[0];
    if (file.size / 1000 > maxSize) {
      return onShowAlert();
    }
    reader.onload = onLoadImage;
    reader.readAsDataURL(file);
    event.target.value = null;
  }
}
