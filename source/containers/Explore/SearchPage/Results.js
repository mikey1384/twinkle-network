import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import ContentListItem from 'components/ContentListItem';
import { setResults, showMoreResults } from 'redux/actions/SearchActions';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { searchContent } from 'helpers/requestHelpers';
import { connect } from 'react-redux';
import { Color } from 'constants/css';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';

Results.propTypes = {
  changeFilter: PropTypes.func.isRequired,
  closeSearch: PropTypes.func.isRequired,
  filter: PropTypes.string.isRequired,
  loadMoreButton: PropTypes.bool.isRequired,
  results: PropTypes.array.isRequired,
  searchText: PropTypes.string.isRequired,
  setResults: PropTypes.func.isRequired,
  showMoreResults: PropTypes.func.isRequired
};

function Results({
  changeFilter,
  closeSearch,
  filter,
  loadMoreButton,
  results,
  searchText,
  setResults,
  showMoreResults
}) {
  const [searching, setSearching] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [firstRun, setFirstRun] = useState(true);
  const prevFilter = useRef(filter);
  const prevSearchText = useRef(searchText);
  const timerRef = useRef(null);

  useEffect(() => {
    if (filter !== prevFilter.current) {
      handleSearchContent();
    }
    prevFilter.current = filter;
  }, [filter]);

  useEffect(() => {
    if (!stringIsEmpty(searchText) && searchText.length > 1) {
      if (firstRun && results.length === 0) {
        setResults({ filter, results: [], loadMoreButton: false });
      }
      setFirstRun(false);
      if (
        (firstRun && results.length === 0) ||
        searchText !== prevSearchText.current
      ) {
        clearTimeout(timerRef.current);
        setSearching(true);
        timerRef.current = setTimeout(handleSearchContent, 500);
      }
      prevSearchText.current = searchText;
    }
  }, [searchText]);

  async function handleSearchContent() {
    const data = await searchContent({
      filter,
      searchText
    });
    setResults({ filter, ...data });
    return setSearching(false);
  }

  const availableFilters = ['video', 'url', 'subject'].filter(
    availableFilter => availableFilter !== filter
  );
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        justifyContent: 'center'
      }}
    >
      {(searching || filter !== prevFilter.current) && <Loading />}
      {!searching &&
        searchText.length > 1 &&
        results.map(result => (
          <ContentListItem
            key={result.id}
            style={{ marginBottom: '1rem' }}
            onClick={closeSearch}
            contentObj={result}
          />
        ))}
      {!searching && results.length === 0 && filter === prevFilter.current && (
        <div
          style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: Color.darkerGray(),
            justifyContent: 'center',
            height: '40vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <p style={{ textTransform: 'capitalize' }}>{`No ${
              filter === 'url' ? 'link' : filter
            }s Found`}</p>
            <div style={{ marginTop: '1rem', fontSize: '2rem' }}>
              Search with the same keyword(s) for:
              {availableFilters.map((availableFilter, index) => (
                <p style={{ textTransform: 'capitalize' }} key={index}>
                  <a
                    style={{ cursor: 'pointer' }}
                    onClick={() => changeFilter(availableFilter)}
                  >{`${
                    availableFilter === 'url' ? 'link' : availableFilter
                  }s`}</a>
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
      {!searching && loadMoreButton && (
        <div style={{ paddingBottom: '8rem' }}>
          <LoadMoreButton
            filled
            color="lightBlue"
            loading={loadingMore}
            onClick={loadMoreSearchResults}
          />
        </div>
      )}
    </div>
  );

  async function loadMoreSearchResults() {
    setLoadingMore(true);
    const data = await searchContent({
      filter,
      searchText,
      shownResults: results
    });
    if (data) showMoreResults(data);
    setLoadingMore(false);
  }
}

export default connect(
  state => ({
    loadMoreButton: state.SearchReducer.loadMoreButton,
    results: state.SearchReducer.results
  }),
  { setResults, showMoreResults }
)(Results);
