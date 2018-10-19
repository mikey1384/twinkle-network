import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Cover from './Cover';
import Body from './Body';
import ExecutionEnvironment from 'exenv';
import { connect } from 'react-redux';
import { checkValidUsername } from 'redux/actions/UserActions';
import NotFound from 'components/NotFound';
import Loading from 'components/Loading';

class Profile extends Component {
  static propTypes = {
    checkValidUsername: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    userId: PropTypes.number,
    username: PropTypes.string
  };

  componentDidMount() {
    const { checkValidUsername, match } = this.props;
    const { username } = match.params;
    if (ExecutionEnvironment.canUseDOM) checkValidUsername(username);
  }

  componentDidUpdate(prevProps) {
    const {
      checkValidUsername,
      history,
      userId,
      profile: { unavailable },
      match
    } = this.props;
    if (
      prevProps.match.params.username &&
      prevProps.match.params.username !== match.params.username
    ) {
      return checkValidUsername(match.params.username);
    }

    if (
      match.params.username === 'undefined' &&
      !prevProps.userId &&
      userId &&
      unavailable
    ) {
      history.push(`/${this.props.username}`);
    }
  }

  render() {
    const {
      history,
      location,
      match,
      profile: { unavailable, id },
      profile,
      userId
    } = this.props;
    return !unavailable ? (
      <div>
        {!id && <Loading text="Loading Profile..." />}
        {id && (
          <div
            style={{
              position: 'relative'
            }}
          >
            <Cover profile={profile} />
            <Body
              history={history}
              location={location}
              match={match}
              profile={profile}
            />
          </div>
        )}
      </div>
    ) : (
      <NotFound
        title={!userId ? 'For Registered Users Only' : ''}
        text={!userId ? 'Please Log In or Sign Up' : ''}
      />
    );
  }
}

export default connect(
  state => ({
    userId: state.UserReducer.userId,
    username: state.UserReducer.username,
    profile: state.UserReducer.profile
  }),
  { checkValidUsername }
)(Profile);
