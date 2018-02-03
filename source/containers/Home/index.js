import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, Route } from 'react-router-dom'
import Profile from './Profile'
import People from './People'
import Stories from './Stories'
import Notification from 'containers/Notification'
import ProfileWidget from './ProfileWidget'
import { Color } from 'constants/css'

class Home extends Component {
  static propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
    username: PropTypes.string
  }

  state = {
    tabletNotification: null,
    desktopNotification: null
  }

  componentDidMount() {
    this.setState({
      tabletNotification: this.renderNotification('tablet'),
      desktopNotification: this.renderNotification('desktop')
    })
  }

  render() {
    const { history, location, username: myUsername } = this.props
    const { tabletNotification, desktopNotification } = this.state
    let username = ''
    if (location.pathname.includes('/users/')) {
      username = location.pathname.split('/')[2]
    }
    return (
      <div>
        <div className="col-xs-3" style={{ position: 'fixed' }}>
          <ProfileWidget history={history} />
          <ul
            className="list-group unselectable"
            style={{
              marginTop: '1em',
              fontSize: '1.3em',
              maxWidth: '12em'
            }}
          >
            <Route
              path="/"
              exact
              children={({ match }) => (
                <li
                  className={`list-group-item left-menu-item home-left-menu ${match &&
                    ' active'}  flexbox-container`}
                  onClick={() => history.push('/')}
                >
                  <div className="media-left">
                    <a>
                      <img
                        alt="Thumbnail"
                        className="media-object"
                        style={{ width: '3vw', height: '3vw' }}
                        src="/img/feed.png"
                      />
                    </a>
                  </div>
                  <a>Stories</a>
                  <div className="clearfix" />
                </li>
              )}
            />
            <Route
              exact
              path="/users"
              children={({ match }) => (
                <li
                  className={`list-group-item left-menu-item home-left-menu ${
                    match || (username && myUsername && username !== myUsername)
                      ? ' active'
                      : ''
                  } flexbox-container`}
                  onClick={() => history.push('/users')}
                >
                  <div className="media-left">
                    <a>
                      <img
                        alt="Thumbnail"
                        className="media-object"
                        style={{ width: '3vw', height: '3vw' }}
                        src="/img/people.png"
                      />
                    </a>
                  </div>
                  <a>People</a>
                  <div className="clearfix" />
                </li>
              )}
            />
          </ul>
          {tabletNotification}
        </div>
        <div className="col-md-6 col-xs-offset-3 col-xs-9">
          <Route exact path="/" component={Stories} />
          <Route path="/users/:username" component={Profile} />
          <Route exact path="/users" component={People} />
        </div>
        {desktopNotification}
      </div>
    )
  }

  renderNotification = device => {
    return (
      <Notification
        device={device}
        className={device === 'desktop' ? 'col-xs-3 col-xs-offset-9' : null}
        position={device === 'tablet' ? 'relative' : 'fixed'}
      >
        <div
          className="well"
          style={{ marginBottom: '0px', textAlign: 'center', padding: '1rem' }}
        >
          <p
            style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              marginBottom: '0px'
            }}
          >
            <span style={{ color: Color.logoGreen }}>Twin</span>
            <span style={{ color: Color.logoBlue }}>kle</span>&nbsp;
            <span style={{ color: Color.orange }}>XP!</span>
          </p>
          <Link
            to="/twinklexp"
            style={{ fontSize: '1.5rem', fontWeight: 'bold' }}
          >
            Click here to learn how to earn them
          </Link>
        </div>
      </Notification>
    )
  }
}

export default connect(state => ({
  realName: state.UserReducer.realName,
  username: state.UserReducer.username,
  userId: state.UserReducer.userId,
  profilePicId: state.UserReducer.profilePicId
}))(Home)
