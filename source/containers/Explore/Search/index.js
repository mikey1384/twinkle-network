import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import TopFilter from './TopFilter';
import Categories from '../Categories';
import Results from './Results';
import SearchBox from './SearchBox';
import { getSectionFromPathname } from 'helpers';
import { useExploreContext } from 'contexts';

Search.propTypes = {
  history: PropTypes.object,
  pathname: PropTypes.string.isRequired,
  style: PropTypes.object
};

export default function Search({ history, pathname, style }) {
  const {
    state: {
      search: { searchText }
    },
    actions: { onLoadSearchResults }
  } = useExploreContext();
  const category = getSectionFromPathname(pathname)?.section;
  const prevSearchText = useRef(searchText);
  const SearchBoxRef = useRef(null);
  useEffect(() => {
    if (
      !stringIsEmpty(prevSearchText.current) &&
      prevSearchText.current.length >= 2 &&
      (stringIsEmpty(searchText) || searchText.length < 2)
    ) {
      onLoadSearchResults({ results: [], loadMoreButton: false });
    }
    prevSearchText.current = searchText;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  return (
    <div style={style}>
      {stringIsEmpty(searchText) && (
        <Categories
          style={{ marginTop: '6rem', marginBottom: '4rem' }}
          filter={category}
          onSetDefaultSearchFilter={handleSetDefaultSearchFilter}
        />
      )}
      <SearchBox
        style={{
          width: '50%',
          marginTop: '2rem',
          height: '5rem'
        }}
        category={category}
        className={css`
          svg,
          input {
            font-size: 2.3rem;
          }
        `}
        innerRef={SearchBoxRef}
      />
      {!stringIsEmpty(searchText) && (
        <>
          <TopFilter
            className={css`
              width: 100%;
              margin-top: 2rem;
              @media (max-width: ${mobileMaxWidth}) {
                margin-top: 0;
                border-top: 0;
              }
            `}
            history={history}
            selectedFilter={category}
          />
          <Results searchText={searchText} filter={category} />
        </>
      )}
    </div>
  );

  async function handleSetDefaultSearchFilter() {
    if (stringIsEmpty(searchText)) {
      SearchBoxRef.current?.focus();
    }
  }
}
