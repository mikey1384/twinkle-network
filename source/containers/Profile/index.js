import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Cover from './Cover';
import Body from './Body';
import { css } from 'emotion';
import { connect } from 'react-redux';
import {
  changeProfileTheme,
  checkValidUsername,
  unmountProfile
} from 'redux/actions/UserActions';
import { setTheme } from 'helpers/requestHelpers';
import NotFound from 'components/NotFound';
import Loading from 'components/Loading';

class Profile extends Component {
  static propTypes = {
    checkValidUsername: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    unmountProfile: PropTypes.func.isRequired,
    userId: PropTypes.number,
    username: PropTypes.string
  };

  state = {
    selectedTheme: undefined
  };

  componentDidMount() {
    const { checkValidUsername, match } = this.props;
    const { username } = match.params;
    checkValidUsername(username);
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
        selectedTheme: this.props.profile.profileTheme || 'logoBlue'
      });
    }
  }

  componentWillUnmount() {
    const { unmountProfile } = this.props;
    unmountProfile();
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
    return (
      <div style={{ minHeight: '10rem' }}>
        {!unavailable ? (
          <>
            {!id && <Loading text="Loading Profile..." />}
            {id && (
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
                  onSelectTheme={theme =>
                    this.setState({ selectedTheme: theme })
                  }
                  selectedTheme={selectedTheme}
                  onSetTheme={this.onSetTheme}
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
      </div>
    );
  }

  onSetTheme = async() => {
    const { changeProfileTheme, dispatch } = this.props;
    const { selectedTheme } = this.state;
    await setTheme({ color: selectedTheme, dispatch });
    changeProfileTheme(selectedTheme);
  };
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
    checkValidUsername: username => dispatch(checkValidUsername(username)),
    unmountProfile: () => dispatch(unmountProfile())
  })
)(Profile);
