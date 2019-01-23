import React from 'react';
import PropTypes from 'prop-types';
import { Link, Route } from 'react-router-dom';
import { container } from './Styles';
import Icon from 'components/Icon';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';

HomeMenuItems.propTypes = {
  history: PropTypes.object,
  style: PropTypes.object
};

export default function HomeMenuItems({ history, style = {} }) {
  return (
    <div className={`unselectable ${container}`} style={style}>
      <ErrorBoundary>
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
      </ErrorBoundary>
      <ErrorBoundary>
        <Route
          exact
          path="/users"
          children={({ match }) => (
            <nav
              className={match ? 'active' : ''}
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
      </ErrorBoundary>
      <div
        style={{
          fontSize: '1rem',
          display: 'flex',
          justifyContent: 'center',
          marginTop: '1.5rem'
        }}
      >
        <div>
          © 2019 Twinkle Network ·{' '}
          <Link to="/privacy" style={{ color: '#000' }}>
            Privacy
          </Link>
        </div>
      </div>
    </div>
  );
}
