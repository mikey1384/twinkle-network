import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Route} from 'react-router-dom'
import Profile from './Profile'
import People from './People'
import Feeds from './Feeds'
import Notification from './Notification'
import Responsive from 'components/Wrappers/Responsive'
import {disconnectHomeComponent} from 'redux/actions/FeedActions'
import {fetchNotifications, clearNotifications} from 'redux/actions/NotiActions'

@connect(
  state => ({
    username: state.UserReducer.username,
    userId: state.UserReducer.userId,
    notificationLoaded: state.NotiReducer.loaded
  }),
  {
    disconnectHomeComponent,
    fetchNotifications,
    clearNotifications
  }
)
export default class Home extends Component {
  static propTypes = {
    userId: PropTypes.number,
    history: PropTypes.object,
    location: PropTypes.object,
    notificationLoaded: PropTypes.bool,
    username: PropTypes.string,
    disconnectHomeComponent: PropTypes.func,
    clearNotifications: PropTypes.func,
    fetchNotifications: PropTypes.func
  }

  constructor() {
    super()
    this.state = {
      selectedTab: null
    }
  }

  componentDidMount() {
    const {fetchNotifications} = this.props
    fetchNotifications()
  }

  componentDidUpdate(prevProps) {
    const {fetchNotifications, clearNotifications, userId} = this.props
    if (prevProps.userId !== userId) {
      if (userId) {
        fetchNotifications()
      } else {
        clearNotifications()
      }
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
          className="col-xs-2"
          style={{
            marginLeft: '1em',
            marginTop: '2em',
            position: 'fixed'
          }}
        >
          <ul className="list-group unselectable" style={{fontSize: '1.3em'}}>
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
        </div>
        <div className="col-md-6 col-md-offset-3 col-xs-10 col-xs-offset-2">
          <Route exact path="/" component={Feeds}/>
          <Route path="/users/:username" component={Profile}/>
          <Route exact path="/users" component={People}/>
        </div>
        <div
          className="col-xs-3 col-xs-offset-9"
          style={{position: 'fixed'}}
        >
          {notificationLoaded &&
            <Responsive device="desktop">
              <Notification />
            </Responsive>
          }
        </div>
      </div>
    )
  }
}
