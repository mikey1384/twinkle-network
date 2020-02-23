import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import PasswordForm from './PasswordForm';
import { useAppContext } from 'contexts';

Content.propTypes = {
  match: PropTypes.object.isRequired
};

export default function Content({ match }) {
  const {
    requestHelpers: { verifyEmail }
  } = useAppContext();
  const [loaded, setLoaded] = useState(false);
  const [profilePicId, setProfilePicId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState('');
  const [expired, setExpired] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    init();
    async function init() {
      try {
        const { profilePicId, userId, username, errorMsg } = await verifyEmail({
          token: match?.params?.token.replace(/\+/g, '.'),
          forPasswordReset: true
        });
        setLoaded(true);
        setProfilePicId(profilePicId);
        setUserId(userId);
        setUsername(username);
        if (errorMsg) {
          setErrorMessage(errorMsg);
        }
      } catch (error) {
        setLoaded(true);
        setExpired(error.response?.status === 401);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'center',
        marginTop: '10rem'
      }}
    >
      {loaded ? (
        <div style={{ textAlign: 'center' }}>
          {userId && username ? (
            <PasswordForm
              profilePicId={profilePicId}
              userId={userId}
              username={username}
            />
          ) : expired ? (
            <div>
              The token is invalid or expired. Please request the verification
              email again
            </div>
          ) : errorMessage ? (
            <div>{errorMessage}</div>
          ) : (
            <div>There was an error</div>
          )}
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}
