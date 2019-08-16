import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ChatButton from './ChatButton';
import HeaderNav from './HeaderNav';
import Icon from 'components/Icon';
import { Color } from 'constants/css';
import { css } from 'emotion';

MainNavs.propTypes = {
  chatLoading: PropTypes.bool,
  chatMode: PropTypes.bool,
  closeSearch: PropTypes.func.isRequired,
  initSearch: PropTypes.func.isRequired,
  isUsername: PropTypes.bool,
  numChatUnreads: PropTypes.number,
  numNewNotis: PropTypes.number,
  numNewPosts: PropTypes.number,
  onChatButtonClick: PropTypes.func,
  onMobileMenuOpen: PropTypes.func.isRequired,
  pathname: PropTypes.string,
  searchMode: PropTypes.bool,
  totalRewardAmount: PropTypes.number
};

export default function MainNavs({
  chatLoading,
  chatMode,
  closeSearch,
  initSearch,
  isUsername,
  numChatUnreads,
  numNewNotis,
  numNewPosts,
  onChatButtonClick,
  onMobileMenuOpen,
  pathname,
  searchMode,
  totalRewardAmount
}) {
  const [prevPathname, setPrevPathname] = useState();
  useEffect(() => {
    return function() {
      setPrevPathname(pathname);
    };
  }, [pathname]);

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
        {renderWorkNav()}
      </div>
      <div
        className={`header-nav ${
          chatLoading || chatMode ? 'hidden' : 'mobile'
        }`}
        onClick={onChatButtonClick}
      >
        <a
          style={{
            color: numChatUnreads > 0 && Color.gold()
          }}
        >
          <Icon icon="comments" />
        </a>
      </div>
      <div className={`header-nav ${chatLoading ? 'mobile' : 'hidden'}`}>
        Loading...
      </div>
      <div>
        <ChatButton
          className="desktop"
          onClick={onChatButtonClick}
          chatMode={chatMode}
          loading={chatLoading}
          numUnreads={numChatUnreads}
        />
      </div>
    </div>
  );

  function renderWorkNav() {
    if (
      !prevPathname ||
      !['xp', 'links', 'videos'].includes(pathname.split('/')[1])
    ) {
      return (
        <HeaderNav
          to="/featured"
          onClick={closeSearch}
          pathname={pathname}
          className="desktop"
          imgLabel="search"
        >
          EXPLORE
        </HeaderNav>
      );
    }

    if (['links'].includes(prevPathname.split('/')[1])) {
      return (
        <HeaderNav
          to="/links"
          onClick={closeSearch}
          pathname={pathname}
          className="desktop"
          imgLabel="book"
        >
          LINKS
        </HeaderNav>
      );
    }

    if (['videos'].includes(prevPathname.split('/')[1])) {
      return (
        <HeaderNav
          to="/videos"
          onClick={closeSearch}
          pathname={pathname}
          className="desktop"
          imgLabel="film"
        >
          VIDEOS
        </HeaderNav>
      );
    }

    return (
      <HeaderNav
        to="/featured"
        onClick={closeSearch}
        pathname={pathname}
        className="desktop"
        imgLabel="bolt"
      >
        FEATURED
      </HeaderNav>
    );
  }
}
