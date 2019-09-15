import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import HeaderNav from './HeaderNav';
import { matchPath } from 'react-router';
import { Color } from 'constants/css';
import { css } from 'emotion';
import { getSectionFromPathname } from 'helpers';

MainNavs.propTypes = {
  chatLoading: PropTypes.bool,
  homeLink: PropTypes.string,
  isAtExploreTab: PropTypes.bool,
  isUsername: PropTypes.bool,
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
  homeLink,
  isAtExploreTab,
  isUsername,
  numChatUnreads,
  numNewNotis,
  numNewPosts,
  onMobileMenuOpen,
  pathname,
  defaultSearchFilter,
  totalRewardAmount
}) {
  const [exploreCategory, setExploreCategory] = useState('subjects');
  const [subExploreLink, setSubExploreLink] = useState('');
  const [subSection, setSubSection] = useState('');
  const loaded = useRef(false);
  const subjectPageMatch = matchPath(pathname, {
    path: '/subjects/:id',
    exact: true
  });
  const videoPageMatch = matchPath(pathname, {
    path: '/videos/:id',
    exact: true
  });
  const linkPageMatch = matchPath(pathname, {
    path: '/links/:id',
    exact: true
  });
  const commentPageMatch = matchPath(pathname, {
    path: '/comments/:id',
    exact: true
  });
  const pageMatch =
    !!subjectPageMatch ||
    !!videoPageMatch ||
    !!linkPageMatch ||
    !!commentPageMatch;
  useEffect(() => {
    const { section } = getSectionFromPathname(pathname);
    if (pageMatch) {
      if (subSection !== section) {
        setSubSection(section);
      }
      setSubExploreLink(pathname.substring(1));
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
    subSection === 'videos'
      ? 'film'
      : subSection === 'links'
      ? 'book'
      : subSection === 'subjects'
      ? 'bolt'
      : 'comment-alt';
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
        isUsername={isUsername}
      >
        Home
      </HeaderNav>
      <HeaderNav
        to={homeLink}
        isHome
        pathname={pathname}
        className="desktop"
        imgLabel="home"
        alert={!isAtExploreTab && numNewPosts > 0}
        isUsername={isUsername}
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
      {subSection && (
        <div style={{ marginRight: '2rem' }}>
          <HeaderNav
            to={`/${subExploreLink}`}
            pathname={pathname}
            className="desktop"
            imgLabel={subSectionIconType}
          >
            {subSection.substring(0, subSection.length - 1).toUpperCase()}
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
          isUsername={isUsername}
        >
          TALK
        </HeaderNav>
      </div>
    </div>
  );
}
