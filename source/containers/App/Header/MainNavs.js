import React, { useEffect, useState } from 'react';
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
  searchFilter: PropTypes.string,
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
  searchFilter,
  totalRewardAmount
}) {
  const [exploreCategory, setExploreCategory] = useState('');
  const subjectPageMatch = matchPath(pathname, {
    path: '/subjects/:id',
    exact: true
  });
  useEffect(() => {
    const { section } = getSectionFromPathname(pathname);
    if (subjectPageMatch) return setExploreCategory(pathname.substring(1));
    if (!exploreCategory) {
      setExploreCategory(
        ['videos', 'subjects', 'links'].includes(searchFilter)
          ? searchFilter
          : 'subjects'
      );
    } else {
      if (['links', 'videos', 'subjects'].includes(section)) {
        setExploreCategory(section);
      }
    }
  }, [pathname, subjectPageMatch]);
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
          to={subjectPageMatch ? '/subjects' : `/${exploreCategory}`}
          pathname={pathname}
          className="desktop"
          imgLabel={subjectPageMatch ? 'arrow-left' : 'search'}
        >
          EXPLORE
        </HeaderNav>
      </div>
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
