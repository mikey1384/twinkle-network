import React, {Component} from 'react';
import Header from './Header';
import Body from './Body';
import ExecutionEnvironment from 'exenv';
import {connect} from 'react-redux';
import {checkValidUsername, unmountProfile} from 'redux/actions/UserActions';
import NotFound from 'components/NotFound';
import Loading from 'components/Loading';


@connect(
  state => ({
    userId: state.UserReducer.userId,
    profilePicId: state.UserReducer.profilePicId,
    profilePage: state.UserReducer.profilePage
  }),
  {checkValidUsername, unmountProfile}
)
export default class Profile extends Component {
  constructor(props) {
    super()
    const {checkValidUsername} = props;
    const {username} = props.params;
    if (ExecutionEnvironment.canUseDOM) checkValidUsername(username);
  }

  componentDidUpdate(prevProps) {
    const {checkValidUsername} = this.props;
    if (ExecutionEnvironment.canUseDOM && prevProps.params.username !== this.props.params.username)
    checkValidUsername(this.props.params.username)
  }

  componentWillUnmount() {
    const {unmountProfile} = this.props;
    unmountProfile();
  }

  render() {
    const {profilePage} = this.props;
    const {unavailable} = this.props.profilePage;
    return !unavailable ? (
      <div>
        {!profilePage.id && <Loading text="Loading Profile..." />}
        {!!profilePage.id &&
          <div>
            <Header {...this.props} />
            {false && <Body {...this.props} />}
          </div>
        }
      </div>
    ) : <NotFound />
  }
}
