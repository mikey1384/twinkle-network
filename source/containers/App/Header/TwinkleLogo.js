import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { Color } from 'constants/css';
import { css } from 'emotion';

TwinkleLogo.propTypes = {
  closeSearch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  isUsername: PropTypes.bool,
  numNewPosts: PropTypes.number,
  pathname: PropTypes.string.isRequired,
  style: PropTypes.object
};
export default function TwinkleLogo({
  closeSearch,
  history,
  isUsername,
  numNewPosts,
  pathname,
  style
}) {
  const atHomeSection = ![
    'links',
    'videos',
    'featured',
    'comments',
    'subjects'
  ].includes(pathname.split('/')[1]);

  return (
    <Route
      to="/"
      children={({ match }) => {
        return (
          <div
            style={style}
            className={`desktop ${css`
              cursor: pointer;
              position: relative;
              width: 10rem;
              height: 2rem;
            `}`}
            onClick={() => {
              history.push('/');
              closeSearch();
            }}
          >
            <div
              onClick={() => (document.getElementById('App').scrollTop = 0)}
              className={`${css`
                font-size: 2rem;
                font-weight: bold;
                font-family: sans-serif, Arial, Helvetica;
                line-height: 0.9;
                color: ${Color.gray()};
                > .logo {
                  line-height: 1;
                }
                &:hover {
                  > .logo-twin {
                    color: ${Color.logoBlue()};
                  }
                  > .logo-kle {
                    color: ${Color.logoGreen()};
                  }
                }
                &.active {
                  > .logo-twin {
                    color: ${Color.logoBlue()};
                  }
                  > .logo-kle {
                    color: ${Color.logoGreen()};
                  }
                }
              `} ${isUsername || match.isExact ? 'active' : ''}`}
            >
              <span
                style={
                  atHomeSection && numNewPosts > 0
                    ? {
                        color: Color.gold()
                      }
                    : {}
                }
                className="logo logo-twin"
              >
                Twin
              </span>
              <span
                style={
                  atHomeSection && numNewPosts > 0
                    ? {
                        color: Color.gold()
                      }
                    : {}
                }
                className="logo logo-kle"
              >
                kle
              </span>
            </div>
          </div>
        );
      }}
    />
  );
}
