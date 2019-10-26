import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import HeaderNav from './HeaderNav';
import { matchPath } from 'react-router';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import { getSectionFromPathname } from 'helpers';
import { truncateText } from 'helpers/stringHelpers';
import { useViewContext } from 'contexts';

MainNavs.propTypes = {
  chatLoading: PropTypes.bool,
  isAtExploreTab: PropTypes.bool,
  loggedIn: PropTypes.bool,
  numChatUnreads: PropTypes.number,
  numNewNotis: PropTypes.number,
  numNewPosts: PropTypes.number,
  onMobileMenuOpen: PropTypes.func.isRequired,
  pathname: PropTypes.string,
  defaultSearchFilter: PropTypes.string,
  totalRewardAmount: PropTypes.number
};

export default function MainNavs({
  chatLoading,
  isAtExploreTab,
  loggedIn,
  numChatUnreads,
  numNewNotis,
  numNewPosts,
  onMobileMenuOpen,
  pathname,
  defaultSearchFilter,
  totalRewardAmount
}) {
  const {
    state: { exploreCategory, explorePath, exploreSubNav, profileNav, homeNav },
    actions: {
      onSetExploreCategory,
      onSetExplorePath,
      onSetExploreSubNav,
      onSetProfileNav,
      onSetHomeNav
    }
  } = useViewContext();
  const loaded = useRef(false);
  const chatMatch = matchPath(pathname, {
    path: '/chat',
    exact: true
  });
  const commentPageMatch = matchPath(pathname, {
    path: '/comments/:id',
    exact: true
  });
  const homeMatch = matchPath(pathname, {
    path: '/',
    exact: true
  });
  const usersMatch = matchPath(pathname, {
    path: '/users',
    exact: true
  });
  const linkPageMatch = matchPath(pathname, {
    path: '/links/:id',
    exact: true
  });
  const subjectPageMatch = matchPath(pathname, {
    path: '/subjects/:id',
    exact: true
  });
  const videoPageMatch = matchPath(pathname, {
    path: '/videos/:id',
    exact: true
  });
  const playlistsMatch = matchPath(pathname, {
    path: '/playlists/:id',
    exact: true
  });
  const explorePageMatch =
    !!subjectPageMatch ||
    !!playlistsMatch ||
    !!videoPageMatch ||
    !!linkPageMatch ||
    !!commentPageMatch;
  const profilePageMatch = matchPath(pathname, {
    path: '/users/:userId'
  });
  useEffect(() => {
    const { section } = getSectionFromPathname(pathname);
    if (homeMatch) {
      onSetHomeNav('/');
    } else if (usersMatch) {
      onSetHomeNav('/users');
    }
    if (explorePageMatch) {
      if (exploreSubNav !== section) {
        onSetExploreSubNav(section);
      }
      onSetExplorePath(pathname.substring(1));
    }
    if (profilePageMatch) {
      onSetProfileNav(pathname);
    }
    if (!loaded.current && defaultSearchFilter) {
      onSetExploreCategory(
        ['videos', 'subjects', 'links'].includes(defaultSearchFilter)
          ? defaultSearchFilter
          : 'subjects'
      );
      loaded.current = true;
    } else {
      if (['links', 'videos', 'subjects'].includes(section)) {
        onSetExploreCategory(section);
      }
    }
  }, [defaultSearchFilter, pathname]);
  const subSectionIconType =
    exploreSubNav === 'videos' || exploreSubNav === 'playlists'
      ? 'film'
      : exploreSubNav === 'links'
      ? 'book'
      : exploreSubNav === 'subjects'
      ? 'bolt'
      : 'comment-alt';
  let profileUsername = '';
  if (profileNav) {
    const splitProfileNav = profileNav.split('/users/')[1].split('/');
    profileUsername = splitProfileNav[0];
  }
  return (
    <div
      className={css`
        padding: 0;
        display: flex;
        justify-content: center;
        width: 100%;
      `}
    >
      <HeaderNav
        isMobileSideMenu
        className={`${chatLoading ? 'hidden' : 'mobile'}`}
        alert={numNewNotis > 0 || totalRewardAmount > 0}
        alertColor={Color.gold()}
        imgLabel="bars"
        onClick={onMobileMenuOpen}
      />
      {profileNav && (
        <HeaderNav
          to={profileNav}
          pathname={pathname}
          className="mobile"
          imgLabel="user"
        />
      )}
      <HeaderNav
        to="/"
        isHome
        className="mobile"
        imgLabel="home"
        alert={numNewPosts > 0}
      />
      <HeaderNav
        to={`/${exploreCategory}`}
        pathname={pathname}
        className="mobile"
        imgLabel="search"
      />
      {exploreSubNav && (
        <HeaderNav
          to={`/${explorePath}`}
          pathname={pathname}
          className="mobile"
          imgLabel={subSectionIconType}
        />
      )}
      <HeaderNav
        to="/chat"
        pathname={pathname}
        className="mobile"
        imgLabel="comments"
        alert={loggedIn && !chatMatch && numChatUnreads > 0}
      />
      {profileNav && (
        <HeaderNav
          to={profileNav}
          pathname={pathname}
          className="desktop"
          style={{ marginRight: '2rem' }}
          imgLabel="user"
        >
          {truncateText({ text: profileUsername.toUpperCase(), limit: 7 })}
        </HeaderNav>
      )}
      <HeaderNav
        to={homeNav}
        isHome
        pathname={pathname}
        className="desktop"
        imgLabel="home"
        alert={!usersMatch && !isAtExploreTab && numNewPosts > 0}
      >
        HOME
        {!usersMatch && numNewPosts > 0 ? ` (${numNewPosts})` : ''}
      </HeaderNav>
      <HeaderNav
        to={`/${exploreCategory}`}
        pathname={pathname}
        className="desktop"
        style={{ marginLeft: '2rem' }}
        imgLabel="search"
      >
        EXPLORE
      </HeaderNav>
      {exploreSubNav && (
        <HeaderNav
          to={`/${explorePath}`}
          pathname={pathname}
          className="desktop"
          style={{ marginLeft: '2rem' }}
          imgLabel={subSectionIconType}
        >
          {exploreSubNav.substring(0, exploreSubNav.length - 1).toUpperCase()}
        </HeaderNav>
      )}
      <div
        className={css`
          margin-left: 2rem;
          @media (max-width: ${mobileMaxWidth}) {
            margin-left: 0;
          }
        `}
      >
        <HeaderNav
          to="/chat"
          pathname={pathname}
          className="desktop"
          imgLabel="comments"
          alert={loggedIn && !chatMatch && numChatUnreads > 0}
        >
          CHAT
        </HeaderNav>
      </div>
    </div>
  );
}
