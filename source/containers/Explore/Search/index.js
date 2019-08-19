import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { setDefaultSearchFilter } from 'helpers/requestHelpers';
import { mobileMaxWidth } from 'constants/css';
import { setResults } from 'redux/actions/SearchActions';
import { updateDefaultSearchFilter } from 'redux/actions/UserActions';
import { connect } from 'react-redux';
import { css } from 'emotion';
import TopFilter from './TopFilter';
import Categories from './Categories';
import Results from './Results';
import SearchBox from './SearchBox';

Search.propTypes = {
  history: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  pathname: PropTypes.string.isRequired,
  searchScrollPosition: PropTypes.number,
  searchText: PropTypes.string.isRequired,
  searchFilter: PropTypes.string.isRequired,
  setResults: PropTypes.func.isRequired,
  style: PropTypes.object,
  updateDefaultSearchFilter: PropTypes.func.isRequired
};

function Search({
  dispatch,
  history,
  pathname,
  searchScrollPosition,
  searchText,
  searchFilter,
  setResults,
  style,
  updateDefaultSearchFilter
}) {
  const category = pathname?.split('/')[1];
  const prevSearchText = useRef(searchText);
  const SearchPageRef = useRef(null);
  const SearchBoxRef = useRef(null);
  useEffect(() => {
    setTimeout(() => {
      if (SearchPageRef.current) {
        SearchPageRef.current.scrollTop = searchScrollPosition;
      }
    }, 10);
    if (
      !stringIsEmpty(prevSearchText.current) &&
      prevSearchText.current.length >= 2 &&
      (stringIsEmpty(searchText) || searchText.length < 2)
    ) {
      setResults({ results: [], loadMoreButton: false });
    }
    prevSearchText.current = searchText;
  }, [searchText]);

  return (
    <div style={style}>
      {stringIsEmpty(searchText) && (
        <Categories
          style={{ marginTop: '7rem', marginBottom: '4rem' }}
          defaultFilter={searchFilter}
          filter={category}
          setDefaultSearchFilter={handleSetDefaultSearchFilter}
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
    if (category === searchFilter) return;
    await setDefaultSearchFilter({
      filter: category,
      dispatch
    });
    updateDefaultSearchFilter(category);
    if (stringIsEmpty(searchText)) {
      SearchBoxRef.current.focus();
    }
  }
}

export default connect(
  state => ({
    userId: state.UserReducer.userId,
    searchScrollPosition: state.SearchReducer.searchScrollPosition,
    searchFilter: state.UserReducer.searchFilter
  }),
  dispatch => ({
    dispatch,
    setResults: data => dispatch(setResults(data)),
    updateDefaultSearchFilter: filter =>
      dispatch(updateDefaultSearchFilter(filter))
  })
)(Search);
