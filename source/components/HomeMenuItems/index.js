import React from 'react';
import PropTypes from 'prop-types';
import { Link, Route } from 'react-router-dom';
import { container } from './Styles';
import Icon from 'components/Icon';
import ErrorBoundary from 'components/ErrorBoundary';
import { Color } from 'constants/css';
import { isMobile } from 'helpers';
import { useMyState } from 'helpers/hooks';
import { useAppContext } from 'contexts';

HomeMenuItems.propTypes = {
  history: PropTypes.object,
  style: PropTypes.object
};

export default function HomeMenuItems({ history, style = {} }) {
  const {
    user: {
      actions: { onSetProfilesLoaded }
    }
  } = useAppContext();
  const { managementLevel } = useMyState();

  return (
    <ErrorBoundary>
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
                  <Icon icon="book" size="1x" />
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
              className={match ? 'active' : ''}
              onClick={handleOnPeopleClick}
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
        {managementLevel > 0 && isMobile(navigator) && (
          <Route
            exact
            path="/management"
            children={({ match }) => (
              <nav
                className={match ? 'active' : ''}
                onClick={() => history.push('/management')}
              >
                <a href="/management" onClick={e => e.preventDefault()}>
                  <div
                    style={{
                      width: '3rem',
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                  >
                    <Icon icon="sliders-h" size="1x" />
                  </div>
                  <span className="homemenu__label">Manage</span>
                </a>
              </nav>
            )}
          />
        )}
        <div
          style={{
            fontSize: '1rem',
            display: 'flex',
            justifyContent: 'center',
            marginTop: '1.5rem',
            color: Color.gray()
          }}
        >
          <div>
            © 2019 Twinkle Network ·{' '}
            <Link to="/privacy" style={{ color: Color.gray() }}>
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );

  function handleOnPeopleClick() {
    if (isMobile(navigator)) {
      onSetProfilesLoaded(false);
    }
    history.push('/users');
  }
}
