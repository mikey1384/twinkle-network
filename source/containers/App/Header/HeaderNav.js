import PropTypes from 'prop-types';
import React from 'react';
import Icon from 'components/Icon';
import { connect } from 'react-redux';
import { Link, Route } from 'react-router-dom';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import { getSectionFromPathname } from 'helpers';

HeaderNav.propTypes = {
  active: PropTypes.bool,
  alert: PropTypes.bool,
  alertColor: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  imgLabel: PropTypes.string,
  isHome: PropTypes.bool,
  isUsername: PropTypes.bool,
  onClick: PropTypes.func,
  pathname: PropTypes.string,
  profileTheme: PropTypes.string,
  style: PropTypes.object,
  to: PropTypes.string
};

function HeaderNav({
  active,
  alert,
  alertColor,
  className,
  to,
  children,
  imgLabel,
  isHome,
  isUsername,
  onClick = () => {},
  pathname,
  profileTheme,
  style
}) {
  const themeColor = profileTheme || 'logoBlue';
  const highlighted =
    ['/featured', '/videos', '/links', '/subjects', '/comments'].includes(to) &&
    ['featured', 'videos', 'links', 'subjects', 'comments'].includes(
      getSectionFromPathname(pathname)?.section
    );
  return (
    <Route
      path={to}
      exact={isHome && !isUsername}
      children={({ match }) => (
        <div
          className={`${className} ${css`
            display: flex;
            align-items: center;
            justify-content: center;
            .chat {
              color: ${Color.gray()};
            }
            a {
              text-decoration: none;
              font-weight: bold;
              color: ${Color.gray()};
              align-items: center;
              line-height: 1;
            }
            > a.active {
              color: ${Color[themeColor](0.8)}!important;
              > svg {
                color: ${Color[themeColor](0.8)}!important;
              }
            }
            &:hover {
              > a {
                > svg {
                  color: ${Color[themeColor](0.6)};
                }
                color: ${Color[themeColor](0.6)};
              }
            }
            @media (max-width: ${mobileMaxWidth}) {
              width: 100%;
              justify-content: center;
              font-size: 4rem;
              a {
                .nav-label {
                  display: none;
                }
              }
              > a.active {
                > svg {
                  color: ${Color.black()}!important;
                }
              }
              &:hover {
                > a {
                  > svg {
                    color: ${Color.gray()};
                  }
                }
              }
            }
          `}`}
          style={style}
        >
          {to ? (
            <Link
              className={to && (match || highlighted) ? 'active ' : ''}
              style={{
                display: 'flex',
                alignItems: 'center',
                ...(alert ? { color: alertColor || Color.gold() } : {})
              }}
              to={to}
              onClick={onClick}
            >
              <Icon icon={isHome ? 'home' : imgLabel} />
              <span className="nav-label" style={{ marginLeft: '0.7rem' }}>
                {children}
              </span>
            </Link>
          ) : (
            <a
              className={active ? 'active ' : ''}
              style={{
                display: 'flex',
                cursor: 'pointer',
                justifyContent: 'center'
              }}
              onClick={onClick}
            >
              <Icon
                style={{
                  ...(alert ? { color: alertColor || Color.gold() } : {})
                }}
                icon={imgLabel}
              />
              <span
                className="nav-label"
                style={{
                  marginLeft: '0.7rem',
                  ...(alert ? { color: alertColor || Color.gold() } : {})
                }}
              >
                {children}
              </span>
            </a>
          )}
        </div>
      )}
    />
  );
}

export default connect(state => ({
  profileTheme: state.UserReducer.profileTheme
}))(HeaderNav);
