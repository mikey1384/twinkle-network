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

  constructor({ profile: { profileTheme } }) {
    super();
    this.state = {
      selectedTheme: profileTheme || 'logoBlue'
    };
  }

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

    if (prevProps.profile.id !== this.props.profile.id) {
      this.setState({
        selectedTheme: this.props.profile?.profileTheme || 'logoBlue'
      });
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
    const { selectedTheme } = this.state;
    return !unavailable ? (
      <div>
        {!id && <Loading text="Loading Profile..." />}
        {id && (
          <div
            style={{
              position: 'relative'
            }}
          >
            <Cover
              profile={profile}
              onSelectColor={color => this.setState({ selectedTheme: color })}
              selectedTheme={selectedTheme}
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
