import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import HeaderNav from './HeaderNav';
import { matchPath } from 'react-router';
import { Color } from 'constants/css';
import { css } from 'emotion';
import { getSectionFromPathname } from 'helpers';
import { truncateText } from 'helpers/stringHelpers';

MainNavs.propTypes = {
  chatLoading: PropTypes.bool,
  isAtExploreTab: PropTypes.bool,
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
  numChatUnreads,
  numNewNotis,
  numNewPosts,
  onMobileMenuOpen,
  pathname,
  defaultSearchFilter,
  totalRewardAmount
}) {
  const [exploreCategory, setExploreCategory] = useState('subjects');
  const [explorePath, setExplorePath] = useState('');
  const [exploreSubNav, setExploreSubNav] = useState('');
  const [profileNav, setProfileNav] = useState('');
  const [homeNav, setHomeNav] = useState('/');
  const loaded = useRef(false);
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
  const explorePageMatch =
    !!subjectPageMatch ||
    !!videoPageMatch ||
    !!linkPageMatch ||
    !!commentPageMatch;
  const profilePageMatch = matchPath(pathname, {
    path: '/users/:userId'
  });
  useEffect(() => {
    const { section } = getSectionFromPathname(pathname);
    if (homeMatch) {
      setHomeNav('/');
    } else if (usersMatch) {
      setHomeNav('/users');
    }
    if (explorePageMatch) {
      if (exploreSubNav !== section) {
        setExploreSubNav(section);
      }
      setExplorePath(pathname.substring(1));
    }
    if (profilePageMatch) {
      setProfileNav(pathname);
    }
    if (!loaded.current && defaultSearchFilter) {
      setExploreCategory(
        ['videos', 'subjects', 'links'].includes(defaultSearchFilter)
          ? defaultSearchFilter
          : 'subjects'
      );
      loaded.current = true;
    } else {
      if (['links', 'videos', 'subjects'].includes(section)) {
        setExploreCategory(section);
      }
    }
  }, [defaultSearchFilter, pathname, subjectPageMatch]);
  const subSectionIconType =
    exploreSubNav === 'videos'
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
        align-items: center;
      `}
    >
      <HeaderNav
        className={`${chatLoading ? 'hidden' : 'mobile'}`}
        alert={numNewNotis > 0 || totalRewardAmount > 0}
        alertColor={Color.gold()}
        imgLabel="user"
        onClick={onMobileMenuOpen}
      />
      <HeaderNav
        to="/"
        isHome
        className="mobile"
        imgLabel="home"
        alert={numNewPosts > 0}
      >
        Home
      </HeaderNav>
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
        alert={!isAtExploreTab && numNewPosts > 0}
      >
        HOME{!isAtExploreTab && numNewPosts > 0 ? ` (${numNewPosts})` : ''}
      </HeaderNav>
      <div style={{ marginLeft: '2rem', marginRight: '2rem' }}>
        <HeaderNav
          to={`/${exploreCategory}`}
          pathname={pathname}
          className="desktop"
          imgLabel="search"
        >
          EXPLORE
        </HeaderNav>
      </div>
      {exploreSubNav && (
        <div style={{ marginRight: '2rem' }}>
          <HeaderNav
            to={`/${explorePath}`}
            pathname={pathname}
            className="desktop"
            imgLabel={subSectionIconType}
          >
            {exploreSubNav.substring(0, exploreSubNav.length - 1).toUpperCase()}
          </HeaderNav>
        </div>
      )}
      <div className={`header-nav ${chatLoading ? 'mobile' : 'hidden'}`}>
        Loading...
      </div>
      <div>
        <HeaderNav
          to="/talk"
          pathname={pathname}
          className="desktop"
          imgLabel="comments"
          alert={!isAtExploreTab && numChatUnreads > 0}
        >
          TALK
        </HeaderNav>
      </div>
    </div>
  );
}
