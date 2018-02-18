import React from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'
import { container } from './Styles'

HomeMenuItems.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
  style: PropTypes.object
}
export default function HomeMenuItems({ history, location, style = {} }) {
  let username = ''
  if (location.pathname.includes('/users/')) {
    username = location.pathname.split('/')[2]
  }
  return (
    <div className={`unselectable ${container}`} style={style}>
      <Route
        path="/"
        exact
        children={({ match }) => (
          <nav className={match && 'active'} onClick={() => history.push('/')}>
            <div className="item-icon">
              <a>
                <img alt="Thumbnail" src="/img/feed.png" />
              </a>
            </div>
            <div className="item-name">
              <a>Stories</a>
            </div>
          </nav>
        )}
      />
      <Route
        exact
        path="/users"
        children={({ match }) => (
          <nav
            className={match || username ? 'active' : ''}
            onClick={() => history.push('/users')}
          >
            <div className="item-icon">
              <a>
                <img alt="Thumbnail" src="/img/people.png" />
              </a>
            </div>
            <div className="item-name">
              <a>People</a>
            </div>
          </nav>
        )}
      />
    </div>
  )
}
