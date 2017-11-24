import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import {Link, Route} from 'react-router-dom'
import Profile from './Profile'
import People from './People'
import Stories from './Stories'
import Notification from 'containers/Notification'
import ProfileWidget from './ProfileWidget'
import {Color} from 'constants/css'

Home.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
  notificationLoaded: PropTypes.bool,
  realName: PropTypes.string,
  username: PropTypes.string,
  userId: PropTypes.number,
  profilePicId: PropTypes.number
}
function Home({
  history, location, userId, profilePicId,
  realName, username: myUsername, notificationLoaded
}) {
  let username = ''
  if (location.pathname.includes('/users/')) {
    username = location.pathname.split('/')[2]
  }
  return (
    <div>
      <div
        className="col-xs-3"
        style={{position: 'fixed'}}
      >
        <ProfileWidget history={history} />
        <ul className="list-group unselectable" style={{
          marginTop: '1em',
          fontSize: '1.3em',
          maxWidth: '12em'
        }}>
          <Route path='/' exact children={({match}) => (
            <li
              className={`list-group-item left-menu-item home-left-menu ${match && ' active'}  flexbox-container`}
              onClick={() => history.push('/')}
            >
              <div className="media-left">
                <a>
                  <img
                    alt="Thumbnail"
                    className="media-object"
                    style={{width: '3vw', height: '3vw'}}
                    src="/img/feed.png"
                  />
                </a>
              </div>
              <a>Stories</a>
              <div className="clearfix"></div>
            </li>
          )}/>
          <Route exact path='/users' children={({match}) => (
            <li
              className={`list-group-item left-menu-item home-left-menu ${(match || ((username && myUsername) && (username !== myUsername))) ? ' active' : ''} flexbox-container`}
              onClick={() => history.push('/users')}
            >
              <div className="media-left">
                <a>
                  <img
                    alt="Thumbnail"
                    className="media-object"
                    style={{width: '3vw', height: '3vw'}}
                    src="/img/people.png"
                  />
                </a>
              </div>
              <a>People</a>
              <div className="clearfix"></div>
            </li>
          )}/>
        </ul>
        {notificationLoaded && renderNotification('tablet')}
      </div>
      <div className="col-md-6 col-xs-offset-3 col-xs-9">
        <Route exact path="/" component={Stories}/>
        <Route path="/users/:username" component={Profile}/>
        <Route exact path="/users" component={People}/>
      </div>
      {notificationLoaded && renderNotification('desktop')}
    </div>
  )
}

function renderNotification(device) {
  return (
    <Notification
      device={device}
      className="col-xs-3 col-xs-offset-9"
    >
      <div className="well" style={{marginBottom: '0px', textAlign: 'center', padding: '1rem'}}>
        <p
          style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '0px'
          }}
        >
          <span style={{color: Color.logoGreen}}>Twin</span><span style={{color: Color.logoBlue}}>kle</span>&nbsp;
          <span style={{color: Color.orange}}>XP!</span>
        </p>
        <Link
          to="/twinklexp"
          style={{fontSize: '1.5rem', fontWeight: 'bold'}}
        >
          Click here to learn how to earn them
        </Link>
      </div>
    </Notification>
  )
}

export default connect(
  state => ({
    realName: state.UserReducer.realName,
    username: state.UserReducer.username,
    userId: state.UserReducer.userId,
    profilePicId: state.UserReducer.profilePicId,
    notificationLoaded: state.NotiReducer.loaded
  })
)(Home)
