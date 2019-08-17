import React from 'react';
import PropTypes from 'prop-types';
import HeaderNav from './HeaderNav';
import Icon from 'components/Icon';
import { Color } from 'constants/css';
import { css } from 'emotion';

MainNavs.propTypes = {
  chatLoading: PropTypes.bool,
  closeSearch: PropTypes.func.isRequired,
  initSearch: PropTypes.func.isRequired,
  isUsername: PropTypes.bool,
  numChatUnreads: PropTypes.number,
  numNewNotis: PropTypes.number,
  numNewPosts: PropTypes.number,
  onMobileMenuOpen: PropTypes.func.isRequired,
  pathname: PropTypes.string,
  searchMode: PropTypes.bool,
  totalRewardAmount: PropTypes.number
};

export default function MainNavs({
  chatLoading,
  closeSearch,
  initSearch,
  isUsername,
  numChatUnreads,
  numNewNotis,
  numNewPosts,
  onMobileMenuOpen,
  pathname,
  searchMode,
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
        className={`${searchMode || chatLoading ? 'hidden' : 'mobile'}`}
        alert={numNewNotis > 0 || totalRewardAmount > 0}
        alertColor={Color.gold()}
        imgLabel="user"
        onClick={onMobileMenuOpen}
      />
      <div
        className={`header-nav ${chatLoading ? 'hidden' : 'mobile'}`}
        onClick={searchMode ? closeSearch : initSearch}
        style={{ width: searchMode && '10%' }}
      >
        <a className={searchMode ? 'active' : ''}>
          {searchMode ? <Icon icon="times" /> : <Icon icon="search" />}
        </a>
      </div>
      <HeaderNav
        to="/featured"
        onClick={closeSearch}
        pathname={pathname}
        className={chatLoading || searchMode ? 'hidden' : 'mobile'}
        imgLabel="bolt"
      />
      <HeaderNav
        to="/"
        onClick={() => {
          closeSearch();
          window.scrollTo(0, 0);
        }}
        isHome
        className={chatLoading || searchMode ? 'hidden' : 'mobile'}
        imgLabel="home"
        alert={numNewPosts > 0}
        isUsername={isUsername}
      >
        Home
      </HeaderNav>
      <HeaderNav
        to="/"
        isHome
        onClick={closeSearch}
        pathname={pathname}
        className="desktop"
        imgLabel="home"
        alert={numNewPosts > 0}
        isUsername={isUsername}
      >
        HOME
      </HeaderNav>
      <div style={{ marginLeft: '2rem', marginRight: '2rem' }}>
        <HeaderNav
          to="/featured"
          onClick={closeSearch}
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
