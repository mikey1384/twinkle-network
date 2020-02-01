import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import Link from 'components/Link';
import { useAppContext } from 'contexts';

Email.propTypes = {
  match: PropTypes.object.isRequired
};

export default function Email({ match }) {
  const {
    requestHelpers: { verifyEmail }
  } = useAppContext();
  const [loaded, setLoaded] = useState(false);
  const [verified, setVerified] = useState(false);
  const [expired, setExpired] = useState(false);
  const [username, setUsername] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    init();
    async function init() {
      try {
        const { username, errorMsg } = await verifyEmail({
          token: match?.params?.token
        });
        setLoaded(true);
        setVerified(!!username);
        if (username) {
          setUsername(username);
        } else if (errorMsg) {
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
          {verified ? (
            <div>Your email address has been successfully verified</div>
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
          {username && (
            <div style={{ marginTop: '1.5rem' }}>
              <Link to={`/users/${username}`}>
                Go back to your profile page
              </Link>
            </div>
          )}
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}
