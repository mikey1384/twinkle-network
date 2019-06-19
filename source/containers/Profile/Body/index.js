import React from 'react';
import PropTypes from 'prop-types';
import { Color, mobileMaxWidth } from 'constants/css';
import FilterBar from 'components/FilterBar';
import Routes from './Routes';
import { css } from 'emotion';

Body.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  profile: PropTypes.shape({
    id: PropTypes.number.isRequired
  }),
  selectedTheme: PropTypes.string
};

export default function Body({
  history,
  location,
  match,
  match: {
    params: { username }
  },
  profile,
  selectedTheme
}) {
  return (
    <div style={{ height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div
          className={css`
            width: 55rem;
            background: #fff;
            margin-bottom: 1rem;
            border-bottom: 1px solid ${Color.borderGray()};
            @media (max-width: ${mobileMaxWidth}) {
              width: 25rem;
            }
          `}
        />
        <FilterBar color={selectedTheme}>
          <nav
            className={
              location.pathname === `/users/${username}` ? 'active' : ''
            }
            style={{ cursor: 'pointer' }}
            onClick={() => history.push(`/users/${username}`)}
          >
            <a>Profile</a>
          </nav>
          <nav
            className={
              location.pathname === `/users/${username}/likes` ? 'active' : ''
            }
            style={{ cursor: 'pointer' }}
            onClick={() => history.push(`${match.url}${`/likes`}`)}
          >
            <a>Likes</a>
          </nav>
          <nav
            className={
              location.pathname !== `/users/${username}` &&
              location.pathname !== `/users/${username}/likes`
                ? 'active'
                : ''
            }
            style={{ cursor: 'pointer' }}
            onClick={() => history.push(`${match.url}${`/all`}`)}
          >
            <a>Posts</a>
          </nav>
        </FilterBar>
        <div
          className={css`
            width: 35rem;
            background: #fff;
            margin-bottom: 1rem;
            border-bottom: 1px solid ${Color.borderGray()};
            @media (max-width: ${mobileMaxWidth}) {
              width: 0;
            }
          `}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <div
          className={css`
            display: flex;
            margin: 0 1rem;
            width: 100%;
            justify-content: center;
            @media (max-width: ${mobileMaxWidth}) {
              margin: 0;
            }
          `}
        >
          <Routes
            history={history}
            location={location}
            match={match}
            profile={profile}
            selectedTheme={selectedTheme}
          />
        </div>
      </div>
    </div>
  );
}
