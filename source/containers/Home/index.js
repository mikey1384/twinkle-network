import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Route} from 'react-router-dom'
import Profile from './Profile'
import People from './People'
import Feeds from './Feeds'
import Notification from 'containers/Notification'
import {disconnectHomeComponent} from 'redux/actions/FeedActions'

@connect(
  state => ({
    username: state.UserReducer.username,
    userId: state.UserReducer.userId,
    notificationLoaded: state.NotiReducer.loaded
  }),
  {disconnectHomeComponent}
)
export default class Home extends Component {
  static propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
    notificationLoaded: PropTypes.bool,
    username: PropTypes.string,
    disconnectHomeComponent: PropTypes.func
  }

  constructor() {
    super()
    this.state = {
      selectedTab: null
    }
  }

  componentWillUnmount() {
    const {disconnectHomeComponent} = this.props
    disconnectHomeComponent()
  }

  render() {
    const {history, location, username: myUsername, notificationLoaded} = this.props
    let username = ''
    if (location.pathname.includes('/users/')) {
      username = location.pathname.split('/')[2]
    }
    return (
      <div>
        <div
          className="col-xs-3"
          style={{
            marginTop: '2em',
            position: 'fixed'
          }}
        >
          <ul className="list-group unselectable" style={{
            fontSize: '1.3em',
            maxWidth: '12em'
          }}>
            <Route path='/' exact children={({match}) => (
              <li
                className={`list-group-item left-menu-item home-left-menu ${match && ' active'}`}
                onClick={() => history.push('/')}
              >
                <a>Home</a>
              </li>
            )}/>
            <li
              className={`list-group-item left-menu-item home-left-menu ${username === myUsername && ' active'}`}
              onClick={() => history.push(`/users/${myUsername}`)}
            >
              <a>Profile</a>
            </li>
            <Route exact path='/users' children={({match}) => (
              <li
                className={`list-group-item left-menu-item home-left-menu ${(match || ((username && myUsername) && (username !== myUsername))) && ' active'}`}
                onClick={() => history.push('/users')}
              >
                <a>People</a>
              </li>
            )}/>
          </ul>
          {notificationLoaded &&
            <Notification
              device="tablet"
              position="relative"
            />
          }
        </div>
        <div className="col-md-6 col-xs-offset-3 col-xs-9">
          <Route exact path="/" component={Feeds}/>
          <Route path="/users/:username" component={Profile}/>
          <Route exact path="/users" component={People}/>
        </div>
        {notificationLoaded &&
          <Notification
            device="desktop"
            className="col-xs-3 col-xs-offset-9"
          />
        }
      </div>
    )
  }
}
