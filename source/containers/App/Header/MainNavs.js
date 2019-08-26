import React from 'react';
import PropTypes from 'prop-types';
import HeaderNav from './HeaderNav';
import { Color } from 'constants/css';
import { css } from 'emotion';

MainNavs.propTypes = {
  exploreCategory: PropTypes.string,
  chatLoading: PropTypes.bool,
  homeLink: PropTypes.string,
  isUsername: PropTypes.bool,
  numChatUnreads: PropTypes.number,
  numNewNotis: PropTypes.number,
  numNewPosts: PropTypes.number,
  onMobileMenuOpen: PropTypes.func.isRequired,
  pathname: PropTypes.string,
  totalRewardAmount: PropTypes.number
};

export default function MainNavs({
  exploreCategory,
  chatLoading,
  homeLink,
  isUsername,
  numChatUnreads,
  numNewNotis,
  numNewPosts,
  onMobileMenuOpen,
  pathname,
  totalRewardAmount
}) {
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
        alert={numNewPosts > 0}
        isUsername={isUsername}
      >
        HOME{numNewPosts > 0 ? ` (${numNewPosts})` : ''}
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
      <div className={`header-nav ${chatLoading ? 'mobile' : 'hidden'}`}>
        Loading...
      </div>
      <div>
        <HeaderNav
          to="/talk"
          pathname={pathname}
          className="desktop"
          imgLabel="comments"
          alert={numChatUnreads > 0}
          isUsername={isUsername}
        >
          TALK
        </HeaderNav>
      </div>
    </div>
  );
}
