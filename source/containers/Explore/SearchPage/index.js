import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { setDefaultSearchFilter } from 'helpers/requestHelpers';
import { mobileMaxWidth } from 'constants/css';
import {
  changeFilter,
  closeSearch,
  setResults
} from 'redux/actions/SearchActions';
import { updateDefaultSearchFilter } from 'redux/actions/UserActions';
import { connect } from 'react-redux';
import { css } from 'emotion';
import TopFilter from './TopFilter';
import FirstPage from './FirstPage';
import Results from './Results';
import SearchBox from './SearchBox';

SearchPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  changeFilter: PropTypes.func.isRequired,
  closeSearch: PropTypes.func.isRequired,
  searchFilter: PropTypes.string,
  searchScrollPosition: PropTypes.number,
  searchText: PropTypes.string.isRequired,
  selectedFilter: PropTypes.string.isRequired,
  setResults: PropTypes.func.isRequired,
  style: PropTypes.object,
  updateDefaultSearchFilter: PropTypes.func.isRequired
};

function SearchPage({
  changeFilter,
  closeSearch,
  dispatch,
  searchFilter,
  searchScrollPosition,
  searchText,
  selectedFilter,
  setResults,
  style,
  updateDefaultSearchFilter
}) {
  const prevSearchText = useRef(searchText);
  const SearchPageRef = useRef(null);
  const SearchBoxRef = useRef(null);
  useEffect(() => {
    if (!selectedFilter) changeFilter(searchFilter || 'video');
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
        <FirstPage
          style={{ marginTop: '7rem', marginBottom: '4rem' }}
          changeFilter={handleChangeFilter}
          defaultFilter={searchFilter}
          filter={selectedFilter}
          setDefaultSearchFilter={handleSetDefaultSearchFilter}
        />
      )}
      <SearchBox
        style={{ width: '50%', marginTop: '2rem' }}
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
            applyFilter={handleChangeFilter}
            selectedFilter={selectedFilter}
          />
          <Results
            changeFilter={handleChangeFilter}
            closeSearch={closeSearch}
            searchText={searchText}
            filter={selectedFilter}
          />
        </>
      )}
    </div>
  );

  function handleChangeFilter(nextFilter) {
    setResults({ results: [], loadMoreButton: false });
    changeFilter(nextFilter);
    if (stringIsEmpty(searchText)) {
      SearchBoxRef.current.focus();
    }
  }

  async function handleSetDefaultSearchFilter() {
    if (selectedFilter === searchFilter) return;
    await setDefaultSearchFilter({
      filter: selectedFilter,
      dispatch
    });
    updateDefaultSearchFilter(selectedFilter);
    if (stringIsEmpty(searchText)) {
      SearchBoxRef.current.focus();
    }
  }
}

export default connect(
  state => ({
    userId: state.UserReducer.userId,
    searchFilter: state.UserReducer.searchFilter,
    searchScrollPosition: state.SearchReducer.searchScrollPosition,
    selectedFilter: state.SearchReducer.selectedFilter
  }),
  dispatch => ({
    dispatch,
    changeFilter: filter => dispatch(changeFilter(filter)),
    closeSearch: () => dispatch(closeSearch()),
    setResults: data => dispatch(setResults(data)),
    updateDefaultSearchFilter: filter =>
      dispatch(updateDefaultSearchFilter(filter))
  })
)(SearchPage);
