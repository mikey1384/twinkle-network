import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import ProfilePic from 'components/ProfilePic';
import Button from 'components/Button';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { openSigninModal } from 'redux/actions/UserActions';
import { connect } from 'react-redux';
import { container } from './Styles';
import { Color } from 'constants/css';

ProfileWidget.propTypes = {
  history: PropTypes.object,
  loadImage: PropTypes.func,
  openSigninModal: PropTypes.func,
  profilePicId: PropTypes.number,
  profileTheme: PropTypes.string,
  realName: PropTypes.string,
  showAlert: PropTypes.func,
  userId: PropTypes.number,
  username: PropTypes.string
};

function ProfileWidget({
  history,
  loadImage,
  openSigninModal,
  profilePicId,
  profileTheme,
  realName,
  showAlert,
  userId,
  username
}) {
  const FileInputRef = useRef(null);
  const themeColor = profileTheme || 'logoBlue';

  return (
    <ErrorBoundary>
      <div
        style={{ cursor: 'pointer' }}
        onClick={() => (username ? history.push(`/users/${username}`) : null)}
        className={container({
          username: Color[themeColor](0.6),
          usernameHovered: Color[themeColor]()
        })}
      >
        {username && (
          <div className="heading">
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
        <div className="details">
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
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            {!userId && (
              <>
                <div className="login-message">Log in</div>
                <div className="login-message">to access all features</div>
              </>
            )}
            {!userId && (
              <Button
                filled
                color="green"
                style={{ marginTop: '1rem' }}
                onClick={openSigninModal}
              >
                Tap here!
              </Button>
            )}
          </div>
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
  );

  function handlePicture(event) {
    const reader = new FileReader();
    const maxSize = 5000;
    const file = event.target.files[0];
    if (file.size / 1000 > maxSize) {
      return showAlert();
    }
    reader.onload = loadImage;
    reader.readAsDataURL(file);
    event.target.value = null;
  }
}

export default connect(
  state => ({
    realName: state.UserReducer.realName,
    twinkleXP: state.UserReducer.twinkleXP,
    username: state.UserReducer.username,
    userId: state.UserReducer.userId,
    profilePicId: state.UserReducer.profilePicId,
    profileTheme: state.UserReducer.profileTheme
  }),
  { openSigninModal }
)(ProfileWidget);
