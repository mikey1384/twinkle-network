import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Loading from 'components/Loading';
import { verifyEmail } from 'helpers/requestHelpers';
import Link from 'components/Link';

class Email extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    username: PropTypes.string
  };

  state = {
    loaded: false,
    verified: false,
    expired: false
  };

  async componentDidMount() {
    const { match } = this.props;
    try {
      await verifyEmail({ token: match?.params?.token });
      this.setState({ loaded: true, verified: true });
    } catch (error) {
      this.setState({ loaded: true, expired: error.response?.status === 401 });
    }
  }

  render() {
    const { loaded, expired, verified } = this.state;
    const { username } = this.props;
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
              <div>Your email has been successfully verified</div>
            ) : expired ? (
              <div>
                The token is invalid or expired. Please request the verification
                email again
              </div>
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
}

export default connect(state => ({
  username: state.UserReducer.username
}))(Email);
