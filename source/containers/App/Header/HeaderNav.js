import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { Link, Route } from 'react-router-dom';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import {
  useAppContext,
  useContentContext,
  useExploreContext,
  useHomeContext,
  useProfileContext
} from 'contexts';

HeaderNav.propTypes = {
  isMobile: PropTypes.bool,
  active: PropTypes.bool,
  alert: PropTypes.bool,
  alertColor: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  imgLabel: PropTypes.string,
  isHome: PropTypes.bool,
  onClick: PropTypes.func,
  pathname: PropTypes.string,
  style: PropTypes.object,
  to: PropTypes.string
};

export default function HeaderNav({
  active,
  alert,
  alertColor,
  className,
  to,
  children,
  imgLabel,
  isHome,
  isMobile,
  onClick = () => {},
  pathname,
  style
}) {
  const { state: profileState = {} } = useProfileContext();
  const {
    actions: { onReloadContent }
  } = useContentContext();
  const {
    actions: { onClearLinksLoaded, onClearVideosLoaded, onReloadSubjects }
  } = useExploreContext();
  const BodyRef = useRef(document.scrollingElement || document.documentElement);
  const highlighted =
    ['/featured', '/videos', '/links', '/subjects', '/comments'].includes(to) &&
    ['featured', 'videos', 'links', 'subjects', 'comments'].includes(
      pathname.substring(1)
    );
  const activeColor = alert ? alertColor : Color.darkGray();
  const hoverColor = alert ? alertColor : Color.darkGray();
  const {
    actions: { onReloadFeeds }
  } = useHomeContext();
  const {
    user: {
      actions: { onSetProfilesLoaded }
    }
  } = useAppContext();
  return (
    <Route
      path={to}
      exact
      children={({ match }) => (
        <div
          onClick={() => {
            if (match && !isMobile) {
              handleMatch(match);
            }
          }}
          className={`${className} ${css`
            display: flex;
            align-items: center;
            justify-content: center;
            .chat {
              color: ${Color.lightGray()};
            }
            a {
              text-decoration: none;
              font-weight: bold;
              color: ${Color.lightGray()};
              align-items: center;
              line-height: 1;
            }
            > a.active {
              color: ${activeColor}!important;
              > svg {
                color: ${activeColor}!important;
              }
            }
            &:hover {
              > a {
                > svg {
                  color: ${hoverColor};
                }
                color: ${hoverColor};
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
                  color: ${Color.darkGray()}!important;
                }
              }
              &:hover {
                > a {
                  > svg {
                    color: ${Color.lightGray()};
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

  function handleMatch(match) {
    if (match.path === '/') {
      onReloadFeeds();
    }
    if (match.path.includes('/users/')) {
      const { profileId } = profileState[match.path.split('/users/')[1]] || {};
      onReloadContent({
        contentId: profileId,
        contentType: 'user'
      });
    }
    if (match.path === '/users') {
      onSetProfilesLoaded(false);
    }
    if (
      ['/featured', '/videos', '/links', '/subjects', '/comments'].includes(
        match.path
      )
    ) {
      onClearLinksLoaded();
      onReloadSubjects();
      onClearVideosLoaded();
    }
    document.getElementById('App').scrollTop = 0;
    BodyRef.current.scrollTop = 0;
  }
}
