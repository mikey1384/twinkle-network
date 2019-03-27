import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Checkbox from 'components/Checkbox';
import { searchPage } from './Styles';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { setDefaultSearchFilter } from 'helpers/requestHelpers';
import { Color, mobileMaxWidth } from 'constants/css';
import {
  changeFilter,
  closeSearch,
  recordSearchScroll,
  setResults
} from 'redux/actions/SearchActions';
import { updateDefaultSearchFilter } from 'redux/actions/UserActions';
import { connect } from 'react-redux';
import { css } from 'emotion';
import TopFilter from './TopFilter';
import FirstPage from './FirstPage';
import Results from './Results';
import CloseText from './CloseText';

SearchPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  changeFilter: PropTypes.func.isRequired,
  closeSearch: PropTypes.func.isRequired,
  onSearchBoxFocus: PropTypes.func.isRequired,
  recordSearchScroll: PropTypes.func.isRequired,
  searchFilter: PropTypes.string,
  searchScrollPosition: PropTypes.number,
  searchText: PropTypes.string.isRequired,
  selectedFilter: PropTypes.string.isRequired,
  setResults: PropTypes.func.isRequired,
  updateDefaultSearchFilter: PropTypes.func.isRequired,
  userId: PropTypes.number
};

function SearchPage({
  changeFilter,
  closeSearch,
  dispatch,
  onSearchBoxFocus,
  recordSearchScroll,
  searchFilter,
  searchScrollPosition,
  searchText,
  selectedFilter,
  setResults,
  updateDefaultSearchFilter,
  userId
}) {
  const [prevSearchText, setPrevSearchText] = useState(searchText);
  const SearchPageRef = useRef(null);
  useEffect(() => {
    if (!selectedFilter) changeFilter(searchFilter || 'video');
    setTimeout(() => {
      if (SearchPageRef.current) {
        SearchPageRef.current.scrollTop = searchScrollPosition;
      }
    }, 10);
    if (
      !stringIsEmpty(prevSearchText) &&
      prevSearchText.length >= 2 &&
      (stringIsEmpty(searchText) || searchText.length < 2)
    ) {
      setResults({ results: [], loadMoreButton: false });
    }
    setPrevSearchText(searchText);

    return function onUnmount() {
      recordSearchScroll(SearchPageRef.current.scrollTop);
    };
  }, [searchText]);

  return (
    <div ref={SearchPageRef} className={searchPage}>
      <div
        className={css`
          width: 80%;
          @media (max-width: ${mobileMaxWidth}) {
            width: 100%;
            margin: 0 1rem 0 1rem;
          }
        `}
      >
        <CloseText className="desktop" />
        <div
          style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            padding: '1rem',
            color: Color.darkerGray()
          }}
        >
          {stringIsEmpty(searchText) ? (
            <div style={{ textTransform: 'capitalize' }}>
              {renderHelperText()}
            </div>
          ) : (
            <span>
              <span style={{ textTransform: 'capitalize' }}>
                {selectedFilter === 'url' ? 'link' : selectedFilter}
              </span>
              : {`"${searchText}"`}
            </span>
          )}
          {userId && (
            <Checkbox
              label={`Always search for ${
                selectedFilter === 'url' ? 'link' : selectedFilter
              }s first:`}
              backgroundColor="#fff"
              checked={selectedFilter === searchFilter}
              onClick={handleSetDefaultSearchFilter}
            />
          )}
        </div>
        <TopFilter
          applyFilter={handleChangeFilter}
          selectedFilter={selectedFilter}
        />
        {stringIsEmpty(searchText) ? (
          <FirstPage
            changeFilter={handleChangeFilter}
            defaultFilter={searchFilter}
            filter={selectedFilter}
            setDefaultSearchFilter={handleSetDefaultSearchFilter}
          />
        ) : (
          <Results
            changeFilter={handleChangeFilter}
            closeSearch={closeSearch}
            searchText={searchText}
            filter={selectedFilter}
          />
        )}
      </div>
    </div>
  );

  function handleChangeFilter(nextFilter) {
    setResults({ results: [], loadMoreButton: false });
    changeFilter(nextFilter);
    onSearchBoxFocus();
  }

  function renderHelperText() {
    if (selectedFilter === 'all') return 'Search all content type...';
    if (selectedFilter === 'url') return 'Search links...';
    return `Search ${selectedFilter}s...`;
  }

  async function handleSetDefaultSearchFilter() {
    if (selectedFilter === searchFilter) return;
    await setDefaultSearchFilter({
      filter: selectedFilter,
      dispatch
    });
    updateDefaultSearchFilter(selectedFilter);
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
    recordSearchScroll: scrollTop => dispatch(recordSearchScroll(scrollTop)),
    setResults: data => dispatch(setResults(data)),
    updateDefaultSearchFilter: filter =>
      dispatch(updateDefaultSearchFilter(filter))
  })
)(SearchPage);
