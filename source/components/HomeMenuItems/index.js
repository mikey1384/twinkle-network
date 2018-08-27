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
          <nav
            className={match ? 'active' : ''}
            onClick={() => history.push('/')}
          >
            <a href="/" onClick={e => e.preventDefault()}>
              <div
                style={{
                  width: '3rem',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <Icon icon="bolt" size="1x" />
              </div>
              <span className="homemenu__label">Stories</span>
            </a>
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
            <a href="/users" onClick={e => e.preventDefault()}>
              <div
                style={{
                  width: '3rem',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <Icon icon="users" size="1x" />
              </div>
              <span className="homemenu__label">People</span>
            </a>
          </nav>
        )}
      />
    </div>
  )
}
