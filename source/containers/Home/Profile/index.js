import React, {Component, PropTypes} from 'react'
import Header from './Header'
import Body from './Body'
import ExecutionEnvironment from 'exenv'
import {connect} from 'react-redux'
import {checkValidUsername, unmountProfile} from 'redux/actions/UserActions'
import NotFound from 'components/NotFound'
import Loading from 'components/Loading'
import {browserHistory} from 'react-router'

@connect(
  state => ({
    userId: state.UserReducer.userId,
    username: state.UserReducer.username,
    profilePicId: state.UserReducer.profilePicId,
    profilePage: state.UserReducer.profilePage
  }),
  {checkValidUsername, unmountProfile}
)
export default class Profile extends Component {
  static propTypes = {
    checkValidUsername: PropTypes.func,
    params: PropTypes.object,
    userId: PropTypes.number,
    profilePage: PropTypes.object,
    username: PropTypes.string,
    unmountProfile: PropTypes.func
  }

  constructor(props) {
    super()
    const {checkValidUsername} = props
    const {username} = props.params
    if (ExecutionEnvironment.canUseDOM) checkValidUsername(username)
  }

  componentDidUpdate(prevProps) {
    const {checkValidUsername, userId, profilePage} = this.props
    const {unavailable} = profilePage
    if (ExecutionEnvironment.canUseDOM) {
      if (prevProps.params.username !== this.props.params.username) {
        return checkValidUsername(this.props.params.username)
      }

      if (this.props.params.username === 'undefined' && !prevProps.userId && !!userId && !!unavailable) {
        browserHistory.push(`/${this.props.username}`)
      }
    }
  }

  componentWillUnmount() {
    const {unmountProfile} = this.props
    unmountProfile()
  }

  render() {
    const {profilePage, userId} = this.props
    const {unavailable} = profilePage
    return !unavailable ? (
      <div style={{width: '100%'}}>
        {!profilePage.id && <Loading text="Loading Profile..." />}
        {!!profilePage.id &&
          <div style={{width: '100%'}}>
            <Header {...this.props} />
            {false && <Body {...this.props} />}
          </div>
        }
      </div>
    ) :
    <NotFound title={!userId && 'For Registered Users Only'} text={!userId && 'Please Log In or Sign Up'} />
  }
}
