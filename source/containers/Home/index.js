import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import {Route} from 'react-router-dom'
import Profile from './Profile'
import People from './People'
import Feeds from './Feeds'
import Notification from 'containers/Notification'
import ProfilePic from 'components/ProfilePic'

Home.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
  notificationLoaded: PropTypes.bool,
  username: PropTypes.string,
  userId: PropTypes.number,
  profilePicId: PropTypes.number
}
function Home({history, location, userId, profilePicId, username: myUsername, notificationLoaded}) {
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
          <li
            className={`list-group-item left-menu-item home-left-menu ${username === myUsername && ' active'} flexbox-container`}
            onClick={() => history.push(`/users/${myUsername}`)}
          >
            <ProfilePic size='3' userId={userId} profilePicId={profilePicId} /><a>Profile</a>
            <div className="clearfix"></div>
          </li>
          <Route exact path='/users' children={({match}) => (
            <li
              className={`list-group-item left-menu-item home-left-menu ${(match || ((username && myUsername) && (username !== myUsername))) && ' active'} flexbox-container`}
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

export default connect(
  state => ({
    username: state.UserReducer.username,
    userId: state.UserReducer.userId,
    profilePicId: state.UserReducer.profilePicId,
    notificationLoaded: state.NotiReducer.loaded
  })
)(Home)
