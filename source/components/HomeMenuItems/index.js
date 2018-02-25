import React from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'
import { container } from './Styles'
import Icon from 'components/Icon'

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
            <div className="icon" style={{ width: '3rem' }}>
              <Icon icon="bolt" size="1x" />
            </div>
            <a>Stories</a>
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
            <div className="icon" style={{ width: '3rem' }}>
              <Icon icon="users" size="1x" />
            </div>
            <a>People</a>
          </nav>
        )}
      />
    </div>
  )
}
